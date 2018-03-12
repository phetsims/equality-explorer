// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for creating and managing terms.
 * Terms are created either by dragging them out of the toolbox below the plate,
 * by restoring a snapshot, or by using the 'universal operation' control.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Event = require( 'SCENERY/input/Event' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Node} icon - icon used to represent this term creator
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function TermCreator( icon, options ) {

    var self = this;

    options = _.extend( {
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging is constrained to these bounds
      initialNumberOfTermsOnPlate: 0, // {number} integer number of terms initially on the plate

      // {number} like terms will occupy this cell index in the plate's 2D grid
      // -1 means 'no cell', and like terms will not be combined
      likeTermsCellIndex: -1
    }, options );

    assert && assert( Util.isInteger( options.initialNumberOfTermsOnPlate ) && ( options.initialNumberOfTermsOnPlate >= 0 ),
      'initialNumberOfTermsOnPlate must be an integer >= 0: ' + options.initialNumberOfTermsOnPlate );

    // @private has this instance been fully initialized?
    this.isInitialized = false;

    // @private icon that appears in toolboxes below the scale. See ES5 getter.
    this._icon = icon;

    // @public (read-only after initialization) {Vector2}
    // Location is dependent on the view and is unknowable until the sim has loaded.
    // TermCreators will ultimately be located in the toolbox below the plate. See initialize.
    this.location = null;

    // @private Number of terms to put on the plate initially.
    // Terms cannot be put on the plate until this.location is initialized.
    this.initialNumberOfTermsOnPlate = options.initialNumberOfTermsOnPlate;

    // @public (read-only) {Plate} the plate that this term creator is associated with.
    // This association necessarily occurs after instantiation.
    this.plate = null;

    // @public (read-only) like terms will be combined in this cell in the plate's 2D grid
    this.likeTermsCellIndex = options.likeTermsCellIndex;
    this.combineLikeTerms = ( options.likeTermsCellIndex !== -1 ); // convenience property

    // @public (read-only) if we're combining like terms, they will be in this cell in the 2D grid
    this.cellIndex = options.cellIndex;

    // @public {read-only) {Bounds2} drag bounds for terms created
    this.dragBounds = options.dragBounds;

    // @protected {ObservableArray.<Term>} all terms that currently exist
    this.allTerms = new ObservableArray();

    // @protected {ObservableArray.<Term>} terms that are on the plate, a subset of allTerms
    this.termsOnPlate = new ObservableArray();

    // @public (read-only) so we don't have to expose this.termsOnPlate
    // dispose not needed.
    this.numberOfTermsOnPlateProperty = new DerivedProperty( [ this.termsOnPlate.lengthProperty ],
      function( length ) {
        return length;
      } );

    // @public (read-only) weight of the terms that are on the plate
    this.weightOnPlateProperty = new Property( ReducedFraction.withInteger( 0 ), {
      valueType: ReducedFraction,
      useDeepEquality: true // set value only if truly different, prevents costly unnecessary notifications
    } );

    // @public emit2 is called when a term is created.
    // Callback signature is function( {Term} term, {Event|null} [event] )
    // event arg will be non-null if the term was created as the result of a user interaction.
    // dispose not required.
    this.termCreatedEmitter = new Emitter();

    // @public {TermCreator} optional inverse term creator on the same side of the scale.
    // This is needed for combining terms on a plate.
    this.inverseTermCreator = null;

    //TODO revisit this
    // @public {BooleanProperty|null} optional Property that indicates whether the term creator is locked.
    // Initialized by client after instantiation, if the term creator is lockable.
    // Resetting this is the responsibility of the client.
    this.lockedProperty = null;

    // @public {TermCreator|null} optional equivalent term creator on the opposite side of the scale.
    // This is needed for the lock feature, so that an equivalent term on the opposite side can be created.
    // Example: When locked, if I drag -x out of the left toolbox, -x needs to also drag out of the right toolbox.
    this.equivalentTermCreator = null;

    // @private called when Term.dispose is called
    this.termWasDisposedBound = this.termWasDisposed.bind( this );

    // @private
    this.updateWeightOnPlatePropertyBound = this.updateWeightOnPlateProperty.bind( this );

    // Update weight when number of terms on plate changes.
    // unlink not required.
    this.numberOfTermsOnPlateProperty.link( function( numberOfTermsOnPlate ) {
      self.updateWeightOnPlatePropertyBound();
    } );
  }

  equalityExplorer.register( 'TermCreator', TermCreator );

  return inherit( Object, TermCreator, {

    /**
     * Gets the icon used to represent this term creator in the toolboxes below the scale.
     * Since this icon is used in multiple places in the scenery DAG (specifically, in multiple
     * toolboxes), it must be wrapped.
     * @returns {Node}
     * @public
     */
    get icon() {
      return new Node( { children: [ this._icon ] } );
    },

    /**
     * Completes initialization. This model element's location is dependent on the location of
     * its associated view element (TermCreatorNode).  So initialization cannot be completed
     * until the sim has fully loaded. See frameStartedCallback in TermCreatorNode.
     * @param {Vector2} location
     * @public
     */
    initialize: function( location ) {

      assert && assert( !this.isInitialized, 'initialize has already been called' );
      this.isInitialized = true;

      this.location = location;

      // populate the plate, see https://github.com/phetsims/equality-explorer/issues/8
      assert && assert( this.plate, 'plate has not been initialized' );
      for ( var i = 0; i < this.initialNumberOfTermsOnPlate; i++ ) {
        var cellIndex = this.plate.getFirstEmptyCell();
        assert && assert( cellIndex !== -1, 'oops, plate is full' );
        this.createTermOnPlate( cellIndex );
      }
    },

    /**
     * Instantiates a term.
     * @param {Object} [options] - passed to the Term's constructor
     * @returns {Term}
     * @protected
     * @abstract
     */
    createTermProtected: function( options ) {
      throw new Error( 'createTermProtected must be implemented by subtypes' );
    },

    /**
     * Creates a new term on the plate by combining two terms.
     * @param {Term} term1
     * @param {Term} term2
     * @param {Object} [options] - passed to the combined Term's constructor
     * @returns {Term|null} - the combined term, null if the terms sum to zero
     * @public
     * @abstract
     */
    combineTerms: function( term1, term2, options ) {
      throw new Error( 'combineTerms must be implemented by subtype' );
    },

    /**
     * Copies the specified term, with possible modifications specified via options.
     * @param {Term} term
     * @param {Object} [options] - passed to the new Term's constructor
     * @returns {Term}
     * @public
     * @abstract
     */
    copyTerm: function( term, options ) {
      throw new Error( 'copyTerm must be implemented by subtype' );
    },

    /**
     * Instantiates the Node that corresponds to a term.
     * @param {Term} term
     * @param {Plate} plate
     * @param {Object} [options] - passed to the TermNode's constructor
     * @returns {TermNode}
     * @public
     * @abstract
     */
    createTermNode: function( term, plate, options ) {
      throw new Error( 'createTermNode must be implemented by subtypes' );
    },

    /**
     * Applies a universal operation to a term on the scale.
     * @param {UniversalOperation} operation
     * @param {Term} term
     * @returns {Term|null} the new term, null if the the operation resulted in zero
     * @public
     * @abstract
     */
    applyOperationToTerm: function( operation, term ) {
      throw new Error( 'applyOperationToTerm must be implemented by subtypes' );
    },

    /**
     * Applies a universal operation to the plate.
     * @param {UniversalOperation} operation
     * @returns {Term|null} the term created, null if no term was created
     * @public
     * @abstract
     */
    applyOperationToPlate: function( operation ) {
      throw new Error( 'applyOperationToPlate must be implemented by subtypes' );
    },

    /**
     * Is this term creator the inverse of a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @abstract
     */
    isInverseOf: function( termCreator ) {
      throw new Error( 'isInverseOf must be implemented by subtype' );
    },

    /**
     * Is this term creator equivalent to a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @abstract
     */
    isEquivalentTo: function( termCreator ) {
      throw new Error( 'isInverseOf must be implemented by subtype' );
    },

    /**
     * Creates a lightweight data structure that describes the terms on the plate for this TermCreator.
     * The format of this data structure is specific to the TermCreator type.
     * @returns {*}
     */
    createSnapshot: function() {
      throw new Error( 'createSnapshot must be implemented by subtype' );
    },

    /**
     * Restores a snapshot of terms on the plate for this TermCreator.
     * @param {*} snapshot - format is specific to TermCreator subtype. See createSnapshot.
     */
    restoreSnapshot: function( snapshot ) {
      throw new Error( 'restoreSnapshot must be implemented by subtype' );
    },

    /**
     * Animates terms.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {
      for ( var i = 0; i < this.allTerms.length; i++ ) {
        this.allTerms.get( i ).step( dt );
      }
    },

    /**
     * Creates a term.
     * @param {Object} [options] - passed to the Term's constructor
     * @returns {Term}
     * @public
     */
    createTerm: function( options ) {

      options = _.extend( {
        location: this.location,
        dragBounds: this.dragBounds,
        event: null // event is non-null if the term is created as the result of a user interaction
      }, options );
      assert && assert( options.event === null || options.event instanceof Event, 'invalid event: ' + event );

      // create term
      var term = this.createTermProtected( options );
      this.allTerms.add( term );

      // Clean up when the term is disposed.
      // removeListener required when the term is disposed, see termWasDisposed.
      term.disposedEmitter.addListener( this.termWasDisposedBound );

      // Notify that a term was created
      this.termCreatedEmitter.emit2( term, options.event );

      return term;
    },

    /**
     * Creates a term and puts it in a specified cell in the associate plate's 2D grid.
     * @param {number} cellIndex
     * @param {Object} [options] - options passed to createTerm
     * @returns {Term}
     * @public
     */
    createTermOnPlate: function( cellIndex, options ) {
      var term = this.createTerm( options );
      this.putTermOnPlate( term, cellIndex );
      return term;
    },

    /**
     * Gets an array of all terms managed.
     * @returns {Term[]}
     * @public
     */
    getTerms: function() {
      return this.allTerms.getArray().slice(); // defensive copy
    },

    /**
     * Gets the terms that are on the plate.
     * @returns {Term[]}
     * @public
     */
    getTermsOnPlate: function() {
      return this.termsOnPlate.getArray().slice(); // defensive copy
    },

    /**
     * Puts a term on the plate. ORDER IS VERY IMPORTANT HERE!
     * @param {Term} term
     * @param {number} cellIndex - cell in the associated plate's 2D grid
     * @public
     */
    putTermOnPlate: function( term, cellIndex ) {
      assert && assert( this.allTerms.contains( term ), 'term not found: ' + term );
      assert && assert( !this.termsOnPlate.contains( term ), 'term already on plate: ' + term );
      phet.log && phet.log( 'TermCreator.putTermOnPlate: ' + term );
      this.plate.addTerm( term, cellIndex );
      this.termsOnPlate.push( term );
    },

    /**
     * Removes a term from the plate. ORDER IS VERY IMPORTANT HERE!
     * @param {Term} term
     * @public
     */
    removeTermFromPlate: function( term ) {
      assert && assert( this.allTerms.contains( term ), 'term not found: ' + term );
      assert && assert( this.termsOnPlate.contains( term ), 'term not on plate: ' + term );
      phet.log && phet.log( 'TermCreator.removeTermFromPlate: ' + term );
      this.plate.removeTerm( term );
      this.termsOnPlate.remove( term );
    },

    /**
     * Is the specified term on the plate?
     * @param {Term} term
     * @returns {boolean}
     * @public
     */
    isTermOnPlate: function( term ) {
      return this.termsOnPlate.contains( term );
    },

    /**
     * Disposes of all terms.
     * @public
     */
    disposeAllTerms: function() {

      // use a while loop because disposing of a term removes it from this.allTerms
      while ( this.allTerms.length > 0 ) {
        this.allTerms.get( 0 ).dispose(); // results in call to termWasDisposed
      }
    },

    /**
     * Disposes of all terms that are on the plate.
     * @public
     */
    disposeTermsOnPlate: function() {

      // use a while loop because disposing of a term modifies this.termsOnPlate
      while ( this.termsOnPlate.length > 0 ) {
        this.termsOnPlate.get( 0 ).dispose(); // results in call to termWasDisposed
      }
    },

    /**
     * Called when Term.dispose is called.
     * @param {Term} term
     * @private
     */
    termWasDisposed: function( term ) {
      assert && assert( this.allTerms.contains( term ), 'term not found: ' + term );

      if ( this.isTermOnPlate( term ) ) {
        this.removeTermFromPlate( term );
      }

      if ( term.disposedEmitter.hasListener( this.termWasDisposedBound ) ) {
        term.disposedEmitter.removeListener( this.termWasDisposedBound );
      }

      this.allTerms.remove( term );
    },

    /**
     * Updates weightOnPlateProperty, the total weight of all terms on the plate.
     * @protected
     */
    updateWeightOnPlateProperty: function() {
      var weight = ReducedFraction.withInteger( 0 );
      for ( var i = 0; i < this.termsOnPlate.length; i++ ) {
        weight = weight.plusFraction( this.termsOnPlate.get( i ).weight );
      }
      this.weightOnPlateProperty.value = weight;
    }
  } );
} );
