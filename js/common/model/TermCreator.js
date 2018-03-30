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
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Event = require( 'SCENERY/input/Event' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function TermCreator( options ) {

    var self = this;

    options = _.extend( {
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging is constrained to these bounds

      // {number} like terms will occupy this cell index in the plate's 2D grid
      // -1 means 'no cell', and like terms will not be combined
      likeTermsCellIndex: -1
    }, options );

    // @private {Vector2} locations of the associated positive and negative TermCreatorNodes.
    // Deferred initialization, see set positiveLocation() and set negativeLocation() for notes.
    this._positiveLocation = null;
    this._negativeLocation = null;

    // @private {Plate} the plate that this term creator is associated with.
    // Deferred initialization, see set plate() for notes.
    this._plate = null;

    // @public (read-only) like terms will be combined in this cell in the plate's 2D grid
    this.likeTermsCellIndex = options.likeTermsCellIndex;
    this.combineLikeTermsEnabled = ( options.likeTermsCellIndex !== -1 ); // convenience property

    // @public (read-only) if we're combining like terms, they will be in this cell in the 2D grid
    this.cellIndex = options.cellIndex;

    // @public {read-only) {Bounds2} drag bounds for terms created
    this.dragBounds = options.dragBounds;

    // @private {ObservableArray.<Term>} all terms that currently exist
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
    this.weightOnPlateProperty = new Property( Fraction.fromInteger( 0 ), {
      valueType: Fraction,
      useDeepEquality: true // set value only if truly different, prevents costly unnecessary notifications
    } );

    // @public emit3 is called when a term is created.
    // Callback signature is function( {TermCreator} termCreator, {Term} term, {Event|null} [event] )
    // event arg will be non-null if the term was created as the result of a user interaction.
    // dispose not required.
    this.termCreatedEmitter = new Emitter();

    // @public emit is called when adding a term to the plate would cause EqualityExplorerConstants.LARGEST_INTEGER
    // to be exceeded.  See See https://github.com/phetsims/equality-explorer/issues/48
    this.numberLimitExceededEmitter = new Emitter();

    // @public {TermCreator|null} optional equivalent term creator on the opposite side of the scale.
    // This is needed for the lock feature, which involves creating an equivalent term on the opposite side of the scale.
    // Example: When locked, if you drag -x out of the left toolbox, -x must also drag out of the right toolbox.
    this.equivalentTermCreator = null;

    // @public {BooleanProperty|null} indicates whether the term creator is locked to equivalentTermCreator
    this.lockedProperty = new BooleanProperty( false );

    // @private called when Term.dispose is called
    this.termWasDisposedBound = this.termWasDisposed.bind( this );

    // @private
    this.updateWeightOnPlatePropertyBound = this.updateWeightOnPlateProperty.bind( this );

    // Update weight when number of terms on plate changes.
    // unlink not required.
    this.numberOfTermsOnPlateProperty.link( function( numberOfTermsOnPlate ) {
      self.updateWeightOnPlatePropertyBound();
    } );

    // When locked changes...
    // unlink not required.
    this.lockedProperty.lazyLink( function( locked ) {

      // If lock feature is turned on, verify that an equivalentTermCreator has been provided.
      assert && assert( !locked || self.equivalentTermCreator, 'lock feature requires equivalentTermCreator' );

      // Changing lock state causes all terms that are not on the plate to be disposed.
      self.disposeTermsNotOnPlate();
    } );
  }

  equalityExplorer.register( 'TermCreator', TermCreator );

  return inherit( Object, TermCreator, {

    /**
     * Initializes the plate that this TermCreator is associated with. This association necessarily occurs
     * after instantiation, since TermCreators are instantiated before Plates, and the association is 2-way.
     * @param {Plate} value
     * @public
     */
    set plate( value ) {
      assert && assert( !this._plate, 'attempted to initialize plate twice' );
      this._plate = value;
    },

    /**
     * Gets the plate that this TermCreator is associated with.
     * @returns {Plate}
     * @public
     */
    get plate() {
      assert && assert( this._plate, 'attempt to access plate before it was initialized' );
      return this._plate;
    },

    /**
     * Initializes the location of the positive TermCreatorNode.
     * The value is dependent on the view and is unknowable until the sim has loaded.
     * See TermCreatorNode.frameStartedCallback for initialization.
     * @param {Vector2} value
     * @public
     */
    set positiveLocation( value ) {
      assert && assert( !this._positiveLocation, 'attempted to initialize positiveLocation twice' );
      assert && assert( value instanceof Vector2, 'invalid positiveLocation: ' + value );
      this._positiveLocation = value;
    },

    /**
     * Gets the location of the positive TermCreatorNode.
     * @returns {Vector2}
     * @public
     */
    get positiveLocation() {
      assert && assert( this._positiveLocation, 'attempt to access positiveLocation before it was initialized' );
      return this._positiveLocation;
    },

    /**
     * Initializes the location of the negative TermCreatorNode.
     * The value is dependent on the view and is unknowable until the sim has loaded.
     * See TermCreatorNode.frameStartedCallback for initialization.
     * @param {Vector2} value
     * @public
     */
    set negativeLocation( value ) {
      assert && assert( !this._negativeLocation, 'attempted to initialize negativeLocation twice' );
      assert && assert( value instanceof Vector2, 'invalid negativeLocation: ' + value );
      this._negativeLocation = value;
    },

    /**
     * Gets the location of the negative TermCreatorNode.
     * @returns {Vector2}
     * @public
     */
    get negativeLocation() {
      assert && assert( this._negativeLocation, 'attempt to access negativeLocation before it was initialized' );
      return this._negativeLocation;
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
        sign: 1,
        dragBounds: this.dragBounds,
        event: null // {Event|null} event is non-null if the term is created as the result of a user interaction
      }, options );
      assert && assert( options.sign === 1 || options.sign === -1, 'invalid sign: ' + options.sign );
      assert && assert( options.event === null || options.event instanceof Event, 'invalid event: ' + options.event );

      // create term
      var term = this.createTermProtected( options );
      this.allTerms.add( term );

      // Clean up when the term is disposed.
      // removeListener required when the term is disposed, see termWasDisposed.
      term.disposedEmitter.addListener( this.termWasDisposedBound );

      // Notify that a term was created
      this.termCreatedEmitter.emit3( this, term, options.event );

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
     * Gets the terms that are on the plate.
     * @returns {Term[]}
     * @public
     */
    getTermsOnPlate: function() {
      return this.termsOnPlate.getArray().slice(); // defensive copy
    },

    /**
     * Gets the positive terms on the plate.
     * @returns {Term[]}
     * @public
     */
    getPositiveTermsOnPlate: function() {
      return _.filter( this.termsOnPlate.getArray(), function( term ) {
        return ( term.sign === 1 );
      } );
    },

    /**
     * Gets the negative terms on the plate.
     * @returns {Term[]}
     * @public
     */
    getNegativeTermsOnPlate: function() {
      return _.filter( this.termsOnPlate.getArray(), function( term ) {
        return ( term.sign === -1 );
      } );
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

      // operate on a copy, since dispose causes the ObservableArray to be modified
      this.disposeTerms( this.allTerms.getArray().slice() );
    },

    /**
     * Disposes of all terms that are on the plate.
     * @public
     */
    disposeTermsOnPlate: function() {

      // operate on a copy, since dispose causes the ObservableArray to be modified
      this.disposeTerms( this.termsOnPlate.getArray().slice() );
    },

    /**
     * Disposes of all terms that are NOT on the plate.
     * @public
     */
    disposeTermsNotOnPlate: function() {
      this.disposeTerms( _.difference( this.allTerms.getArray(), this.termsOnPlate.getArray() ) );
    },

    /**
     * Disposes of some collection of terms.
     * @param {Term[]} terms
     * @private
     */
    disposeTerms: function( terms ) {
      for ( var i = 0; i < terms.length; i++ ) {
        terms[ i ].dispose(); // results in call to termWasDisposed
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
      var weight = Fraction.fromInteger( 0 );
      for ( var i = 0; i < this.termsOnPlate.length; i++ ) {
        weight = weight.plus( this.termsOnPlate.get( i ).weight ).reduced();
      }
      this.weightOnPlateProperty.value = weight;
    },

    //-------------------------------------------------------------------------------------------------
    // Below here are @abstract methods, to be implemented by subtypes
    //-------------------------------------------------------------------------------------------------

    /**
     * Creates the icon used to represent this term in the TermsToolbox and equations.
     * @param {Object} [options]
     * @returns {Node}
     * @public
     * @abstract
     */
    createIcon: function( options ) {
      throw new Error( 'createIcon must be implemented by subtypes' );
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
     * Does the specified term have a numerator or denominator that exceeds EqualityExplorerConstants.LARGEST_INTEGER?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isNumberLimitExceeded: function( term ) {
      throw new Error( 'isNumberLimitExceeded must be implemented by subtype' );
    },

    //TODO is this needed?
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
     * @param {Object} [options] - passed to the TermNode's constructor
     * @returns {TermNode}
     * @public
     * @abstract
     */
    createTermNode: function( term, options ) {
      throw new Error( 'createTermNode must be implemented by subtypes' );
    },

    /**
     * Applies an operation to terms on the plate.
     *
     * @param {UniversalOperation} operation
     * @returns {boolean} - true if the operation resulted in a term on the plate becoming zero, false otherwise
     * @public
     * @abstract
     */
    applyOperation: function( operation ) {
      throw new Error( 'applyOperation must be implemented by subtypes' );
    },

    /**
     * Is this term creator equivalent to a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @abstract
     */
    isEquivalentTo: function( termCreator ) {
      throw new Error( 'isEquivalentTo must be implemented by subtype' );
    },

    /**
     * Creates a lightweight data structure that describes the terms on the plate for this TermCreator.
     * The format of this data structure is specific to the TermCreator type.
     * @returns {*}
     * @public
     * @abstract
     */
    createSnapshot: function() {
      throw new Error( 'createSnapshot must be implemented by subtype' );
    },

    /**
     * Restores a snapshot of terms on the plate for this TermCreator.
     * @param {*} snapshot - see createSnapshot
     * @public
     * @abstract
     */
    restoreSnapshot: function( snapshot ) {
      throw new Error( 'restoreSnapshot must be implemented by subtype' );
    }
  } );
} );
