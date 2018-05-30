// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for creating and managing terms.
 *
 * Terms can be created in 3 ways:
 * - by dragging them out of a toolbox below a plate
 * - by restoring a snapshot
 * - by using the 'universal operation' control.
 *
 * TermCreators operate in one of two modes, based on the value of {boolean} this.combineLikeTermsEnabled:
 * true: each term *type* occupies one cell on the scale, and all like terms are combined
 * false: each term *instance* occupies one cell on the scale, and terms are combined only if they sum to zero
 *
 * See https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md
 * for a detailed description of how the PhET 'creator pattern' is applied in this simulation.
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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
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

    // @public emit is called when adding a term to the plate would cause EqualityExplorerQueryParameters.maxInteger
    // to be exceeded.  See See https://github.com/phetsims/equality-explorer/issues/48
    this.maxIntegerExceededEmitter = new Emitter();

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
     * Given a term, gets the location for an equivalent term on the opposite side of the scale.
     * When locked, equivalent terms track the y coordinate of their associated term, but their
     * x coordinate is offset by the distance between their associated toolbox locations.
     * @param {Term} term
     * @returns {Vector2}
     * @public
     */
    getEquivalentTermLocation: function( term ) {
      assert && assert( this.isManagedTerm( term ), 'term is not managed by this TermCreator: ' + term );

      var xOffset;
      if ( term.significantValue.getValue() >= 0 ) {
        xOffset = this.equivalentTermCreator.positiveLocation.x - this.positiveLocation.x;
      }
      else {
        xOffset = this.equivalentTermCreator.negativeLocation.x - this.negativeLocation.x;
      }

      return term.locationProperty.value.plusXY( xOffset, 0 );
    },

    /**
     * Animates terms.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {

      // operate on a copy, since step may involve modifying the array
      var allTermsCopy = this.allTerms.getArray().slice();
      for ( var i = 0; i < allTermsCopy.length; i++ ) {
        var term = allTermsCopy[ i ];

        // Stepping a term may result in some other term being disposed, so only step terms
        // that have not been disposed. See https://github.com/phetsims/equality-explorer/issues/94.
        if ( !term.disposed ) {
          allTermsCopy[ i ].step( dt );
        }
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
        event: null // {Event|null} event is non-null if the term is created as the result of a user interaction
      }, options );
      assert && assert( options.sign === 1 || options.sign === -1, 'invalid sign: ' + options.sign );

      // create term
      var term = this.createTermProtected( options );

      // manage the term
      this.manageTerm( term, options.event );

      return term;
    },

    /**
     * Tells this term creator to manage a term.  Once managed, a term cannot be unmanaged - it's a life commitment!
     * @param {Term} term
     * @param {Event|null} [event] is provided if term was created as the result of a user interaction
     * @public
     */
    manageTerm: function( term, event ) {
      assert && assert( !this.isManagedTerm( term ), 'term is already managed: ' + term );
      assert && assert( !event || event instanceof Event, 'invalid event: ' + event );

      this.allTerms.add( term );

      // set the term's drag bounds
      term.dragBounds = this.dragBounds;

      // set the term's toolboxLocation, so that it knows how to animate back to the toolbox
      if ( term.significantValue.getValue() >= 0 ) {
        term.toolboxLocation = this.positiveLocation;
      }
      else {
        assert && assert( this.negativeLocation, 'negativeLocation has not been initialized' );
        term.toolboxLocation = this.negativeLocation;
      }

      // Clean up when the term is disposed.
      // removeListener required when the term is disposed, see termWasDisposed.
      term.disposedEmitter.addListener( this.termWasDisposedBound );

      // Notify listeners that a term is being managed by this term creator.
      // This will result in creation of the corresponding view.
      this.termCreatedEmitter.emit3( this, term, event );
    },

    /**
     * Is the specified term managed by this term creator?
     * @param {Term} term
     * @returns {boolean}
     * @private
     */
    isManagedTerm: function( term ) {
      return this.allTerms.contains( term );
    },

    /**
     * Puts a term on the plate. If the term wasn't already managed, it become mananaged.
     * @param {Term} term
     * @param {number} [cell] - cell in the plate's 2D grid, defaults to this.likeTermsCell when combining like terms
     * @public
     */
    putTermOnPlate: function( term, cell ) {
      assert && assert( !this.termsOnPlate.contains( term ), 'term already on plate: ' + term );

      if ( cell === undefined && this.combineLikeTermsEnabled ) {
        cell = this.likeTermsCell;
      }
      assert && assert( cell !== undefined, 'cell is undefined' );

      // ORDER IS VERY IMPORTANT HERE!
      if ( !this.isManagedTerm( term ) ) {
        this.manageTerm( term );
      }
      this.plate.addTerm( term, cell );
      this.termsOnPlate.push( term );
      term.onPlateProperty.value = true;

      assert && assert( !this.combineLikeTermsEnabled || this.termsOnPlate.length <= 1,
        'when combineLikeTermsEnabled, there should be at most 1 term on plate: ' + this.termsOnPlate.length );
    },

    /**
     * Removes a term from the plate.
     * @param {Term} term
     * @returns {number} the cell that the term was removed from
     * @public
     */
    removeTermFromPlate: function( term ) {
      assert && assert( this.allTerms.contains( term ), 'term not found: ' + term );
      assert && assert( this.termsOnPlate.contains( term ), 'term not on plate: ' + term );

      // ORDER IS VERY IMPORTANT HERE!
      var cell = this.plate.removeTerm( term );
      this.termsOnPlate.remove( term );
      term.onPlateProperty.value = false;
      return cell;
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
      this.hideAllTermHalos();
    },

    /**
     * Disposes of all terms that are NOT on the plate.
     * @public
     */
    disposeTermsNotOnPlate: function() {
      this.disposeTerms( _.difference( this.allTerms.getArray(), this.termsOnPlate.getArray() ) );
      this.hideAllTermHalos();
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
     * Hides halos for all terms. This is done as part of disposeTermsOnPlate and disposeTermsNotOnPlate,
     * so that some term is not left with its halo visible after the term that it overlapped disappears.
     * See https://github.com/phetsims/equality-explorer/issues/59.
     * @private
     */
    hideAllTermHalos: function() {
      for ( var i = 0; i < this.allTerms.getArray().length; i++ ) {
        this.allTerms.get( i ).haloVisibleProperty.value = false;
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
     * Do this TermCreator and the specified TermCreator create like terms?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     */
    isLikeTermCreator: function( termCreator ) {

      // Create 2 terms via createTermProtected, not createTerm, so that they are not managed.
      var thisTerm = this.createTermProtected();
      var thatTerm = termCreator.createTermProtected();

      // If the 2 terms are 'like' then the creators are 'like'.
      var isLike = thisTerm.isLikeTerm( thatTerm );
      
      // Dispose of the terms.
      thisTerm.dispose();
      thatTerm.dispose();

      return isLike;
    },

    /**
     * Creates a lightweight data structure that describes the terms on the plate for this TermCreator.
     * The format of the termOptions field is specific to the Term subtype, and consists of options
     * to a Term type's constructor.  This data structure is opaque outside of TermCreator.
     * @returns {{cell: number, termOptions:Object }[]}
     * @public
     */
    createSnapshot: function() {
      var snapshot = [];
      var termsOnPlate = this.getTermsOnPlate();
      for ( var i = 0; i < termsOnPlate.length; i++ ) {
        var term = termsOnPlate[ i ];
        snapshot.push( {
          cell: this.plate.getCellForTerm( term ), // {number} cell that the Term occupies
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
        var term = this.createTerm( snapshot[ i ].termOptions );
        this.putTermOnPlate( term, snapshot[ i ].cell );
      }
    },

    /**
     * Applies an operation to terms on the plate.
     * @param {UniversalOperation} operation
     * @returns {boolean} - true if the operation resulted in a term on the plate becoming zero, false otherwise
     * @public
     */
    applyOperation: function( operation ) {

      assert && assert( this.combineLikeTermsEnabled, 'applyOperation is only supported when combining like terms' );
      assert && assert( this.termsOnPlate.length <= 1, 'expected at most 1 term on plate: ' + this.termsOnPlate.length );

      var summedToZero = false;
      var plateWasEmpty = false;

      // Get the term on the plate, or use zero term
      var term = this.plate.getTermInCell( this.likeTermsCell );
      if ( !term ) {
        plateWasEmpty = true;
        term = this.createZeroTerm( {
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
      }

      // {Term|null} Apply the operation to the term. Returns null if the operation was not applicable to the term.
      var newTerm = term.applyOperation( operation );

      if ( newTerm ) {

        // dispose of the term
        term.dispose();

        if ( newTerm.sign === 0 ) {
          summedToZero = !plateWasEmpty;
        }
        else {

          // manage the new term and put it on the plate
          this.putTermOnPlate( newTerm, this.likeTermsCell );
        }
      }

      return summedToZero;
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
     * Creates a term whose significant value is zero. The term is not managed by the TermCreator.
     * This is used when applying an operation to an empty plate.
     * @param {Object} [options] - Term constructor options
     * @returns {Term}
     * @public
     * @abstract
     */
    createZeroTerm: function( options ) {
      throw new Error( 'createZeroTerm must be implemented by subtypes' );
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
    }
  } );
} );
