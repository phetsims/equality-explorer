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

      // {number} like terms will occupy this cell in the plate's 2D grid
      // null means 'no cell', and like terms will not be combined
      likeTermsCell: null
    }, options );

    // @private {Plate} the plate that this term creator is associated with.
    // Deferred initialization, see set plate() for notes.
    this._plate = null;
    
    // @private {Vector2} locations of the associated positive and negative TermCreatorNodes.
    // Deferred initialization, see set positiveLocation() and set negativeLocation() for notes.
    this._positiveLocation = null;
    this._negativeLocation = null;

    // @public (read-only) like terms will be combined in this cell in the plate's 2D grid
    this.likeTermsCell = options.likeTermsCell;
    this.combineLikeTermsEnabled = ( options.likeTermsCell !== null ); // convenience property

    // @public {read-only) {Bounds2} drag bounds for terms created
    this.dragBounds = options.dragBounds;

    // @private {ObservableArray.<Term>} all terms that currently exist
    this.allTerms = new ObservableArray();

    // @protected {ObservableArray.<Term>} terms that are on the plate, a subset of this.allTerms
    this.termsOnPlate = new ObservableArray();

    // @public (read-only) so we don't have to expose this.termsOnPlate
    // dispose not needed.
    this.numberOfTermsOnPlateProperty = new DerivedProperty( [ this.termsOnPlate.lengthProperty ],
      function( length ) {
        return length;
      } );

    // @public (read-only) weight of the terms that are on the plate
    // We can't use a DerivedProperty here because subtypes may have additional Properties
    // that require updating weightOnPlateProperty.
    this.weightOnPlateProperty = new Property( Fraction.fromInteger( 0 ), {
      valueType: Fraction,
      useDeepEquality: true // set value only if truly different, prevents costly unnecessary notifications
    } );

    // @public emit3 is called when a term is created.
    // Callback signature is function( {TermCreator} termCreator, {Term} term, {Event|null} [event] ),
    // where event is non-null if the term was created as the result of a user interaction.
    // dispose not required.
    this.termCreatedEmitter = new Emitter();

    // @public emit is called when adding a term to the plate would cause EqualityExplorerConstants.LARGEST_INTEGER
    // to be exceeded.  See See https://github.com/phetsims/equality-explorer/issues/48
    this.numberLimitExceededEmitter = new Emitter();

    // @public {TermCreator|null} optional equivalent term creator on the opposite side of the scale.
    // This is needed for the lock feature, which involves creating an equivalent term on the opposite side of the scale.
    // Example: When locked, if you drag -x out of the left toolbox, -x must also drag out of the right toolbox.
    // Because this is a 2-way association, initialization is deferred until after instantiation.
    // See set equivalentTermCreator() for notes.
    this._equivalentTermCreator = null;

    // @public {BooleanProperty|null} indicates whether this term creator is locked to equivalentTermCreator
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
     * Initializes the location of the optional negative TermCreatorNode.
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
     * Gets the location of the optional negative TermCreatorNode.
     * @returns {Vector2|null}
     * @public
     */
    get negativeLocation() {
      assert && assert( this._negativeLocation, 'attempt to access negativeLocation before it was initialized' );
      return this._negativeLocation;
    },

    /**
     * Initializes the optional equivalent TermCreator for the opposite plate, required for the optional 'lock' feature.
     * This association necessarily occurs after instantiation because it's a 2-way association.
     * @param {TermCreator} value
     * @public
     */
    set equivalentTermCreator( value ) {
      assert && assert( !this._equivalentTermCreator, 'attempted to initialize equivalentTermCreator twice' );
      assert && assert( this.isLikeTermCreator( value ), 'value is not a like TermCreator: ' + value );
      this._equivalentTermCreator = value;
    },

    /**
     * Gets the optional equivalent TermCreator for the opposite plate.
     * @returns {TermCreator|null}
     * @public
     */
    get equivalentTermCreator() {
      assert && assert( this._equivalentTermCreator, 'attempt to access equivalentTermCreator before it was initialized' );
      return this._equivalentTermCreator;
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

      // manage the term
      this.manageTerm( term, options.event );

      return term;
    },

    /**
     * Tells this term creator to manage a term.
     *
     * NOTE! Since TermCreator manages Terms throughout their entire lifecycle, it is of utmost importance
     * that all Terms are created via this method, or a method that calls this method.
     *
     * @param {Term} term
     * @param {Event|null} event is non-null if term was created as the result of a user interaction
     * @public
     */
    manageTerm: function( term, event ) {

      this.allTerms.add( term );

      // Clean up when the term is disposed.
      // removeListener required when the term is disposed, see termWasDisposed.
      term.disposedEmitter.addListener( this.termWasDisposedBound );

      // Notify listeners that a term was created.
      // This will result in creation of the corresponding view.
      this.termCreatedEmitter.emit3( this, term, event );
    },

    /**
     * Creates a term and puts it in a specified cell in the associate plate's 2D grid.
     * @param {number} cell
     * @param {Object} [options] - options passed to createTerm
     * @returns {Term}
     * @public
     */
    createTermOnPlate: function( cell, options ) {
      var term = this.createTerm( options );
      this.putTermOnPlate( term, cell );
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
     * Gets the term that occupies the 'like terms' cell on the plate.
     * @returns {Term|null}
     * @public
     */
    getLikeTermOnPlate: function() {
      assert && assert( this.combineLikeTermsEnabled, 'getLikeTermOnPlate is only supported when combineLikeTermsEnabled' );
      assert && assert( this.termsOnPlate.length <= 1, 'expected at most 1 term on plate' );
      return this.plate.getTermInCell( this.likeTermsCell );
    },

    /**
     * Puts a term on the plate. ORDER IS VERY IMPORTANT HERE!
     * @param {Term} term
     * @param {number} cell - cell in the associated plate's 2D grid
     * @public
     */
    putTermOnPlate: function( term, cell ) {
      assert && assert( this.allTerms.contains( term ), 'term not found: ' + term );
      assert && assert( !this.termsOnPlate.contains( term ), 'term already on plate: ' + term );
      phet.log && phet.log( 'TermCreator.putTermOnPlate: ' + term );
      this.plate.addTerm( term, cell );
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

    /**
     * Do this term creator and the specified term creator create like terms?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     */
    isLikeTermCreator: function( termCreator ) {

      // Create 2 terms via createTermProtected, not createTerm, so that they are not managed.
      // Specify location because this method is called before positiveLocation and negativeLocation are initialized.
      var options = { location: Vector2.ZERO };
      var thisTerm = this.createTermProtected( options );
      var thatTerm = termCreator.createTermProtected( options );

      // If the 2 terms are 'like' then the creators are 'like'.
      var isLike = thisTerm.isLikeTerm( thatTerm );
      
      // Dispose of the terms.
      thisTerm.dispose();
      thatTerm.dispose();

      return isLike;
    },

    /**
     * Creates a lightweight data structure that describes the terms on the plate for this TermCreator.
     * The format of the term field is specific to the Term subtype.
     * @returns {{cell: number, term:Object }[]}
     * @public
     */
    createSnapshot: function() {
      var snapshot = [];
      var termsOnPlate = this.getTermsOnPlate();
      for ( var i = 0; i < termsOnPlate.length; i++ ) {
        var term = termsOnPlate[ i ];
        snapshot.push( {
          cell: this.plate.getCellForTerm( term ), // {number}
          termOptions: term.createSnapshot() // {Object} options to Term's constructor, specific to subtype
        } );
      }
      return snapshot;
    },

    /**
     * Restores a snapshot of terms on the plate for this TermCreator.
     * @param {*} snapshot - see return value of createSnapshot
     * @public
     */
    restoreSnapshot: function( snapshot ) {
      for ( var i = 0; i < snapshot.length; i++ ) {
        this.createTermOnPlate( snapshot[ i ].cell, snapshot[ i ].termOptions );
      }
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
     * Creates a new term by combining two terms.
     * Careful! When implementing this, the term must be created by calling createTerm, or the term won't be managed.
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
     * Careful! When implementing this, the term must be created by calling createTerm, or the term won't be managed.
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
    }
  } );
} );
