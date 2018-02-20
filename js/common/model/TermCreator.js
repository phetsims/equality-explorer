// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for creating and managing terms.
 * Terms are created either by dragging then out of panels below the scale, or by restoring a snapshot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEFAULT_ICON = new Rectangle( 0, 0,
    EqualityExplorerConstants.SMALL_TERM_DIAMETER, EqualityExplorerConstants.SMALL_TERM_DIAMETER,
    { fill: 'black' } );

  /**
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function TermCreator( options ) {

    options = _.extend( {
      icon: DEFAULT_ICON, // {Node} icon that represents terms of this type
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging is constrained to these bounds
      initialNumberOfTermsOnScale: 0 // {number} integer number of terms initially on the scale
    }, options );

    assert && assert( ( options.initialNumberOfTermsOnScale >= 0 ) && Util.isInteger( options.initialNumberOfTermsOnScale ),
      'initialNumberOfTermsOnScale is invalid: ' + options.initialNumberOfTermsOnScale );

    // @public (ready-only)
    this.icon = options.icon;

    // @public {Vector2} (read-only after initialization)
    // Location is dependent on the view and is unknowable until the sim has loaded.
    // See initialize.
    this.location = null;

    // @private Number of terms to put on the scale initially.
    // Terms cannot be put on the scale until this.location is initialized.
    this.initialNumberOfTermsOnScale = options.initialNumberOfTermsOnScale;

    // @public {Plate} the plate that this term creator is associated with.
    // This association necessarily occurs after instantiation.
    this.plate = null;

    // @public {Bounds2} drag bounds for terms created
    this.dragBounds = options.dragBounds;

    // @protected {ObservableArray.<Term>} all terms that currently exist
    this.allTerms = new ObservableArray();

    // @public (read-only) so we don't need to expose allTerms
    this.numberOfTermsProperty = this.allTerms.lengthProperty;

    // @private {ObservableArray.<Term>} terms that are on the scale, a subset of allTerms
    this.termsOnScale = new ObservableArray();

    // @public (read-only) so we don't need to expose termsOnScale
    this.numberOfTermsOnScaleProperty = this.termsOnScale.lengthProperty;

    // @public {BooleanProperty|null} optional Property that indicates whether the term creator is locked.
    // Initialized by client after instantiation, if the term creator is lockable.
    // Resetting this is the responsibility of the client.
    this.lockedProperty = null;

    // @public emit2 is called when a term is created.
    // Callback signature is function( {Term} term, {Event|null} [event] )
    // event arg will be non-null if the term was created as the result of a user interaction.
    this.termCreatedEmitter = new Emitter();

    //TODO delete equivalentTermCreator if not used for lock feature
    // @public {TermCreator|null} optional equivalent term creator on the opposite side of the scale.
    // This is needed for the lock feature, so that an equivalent term on the opposite side can be created.
    // Example: When locked, if I drag -x out of the left panel, -x needs to also drag out of the right panel.
    this.equivalentTermCreator = null;

    //TODO delete inverseTermCreator if not used for lock feature
    // @public {TermCreator} optional inverse term creator on the opposite side of the scale.
    // This is needed for lock feature, for the case where an inverse term must be created.
    // Example: When locked, if I remove x from the left plate, and the right plate is empty, then x needs
    // to be created and dragged on the right side (by equivalentTermCreator) and -x needs to be created on
    // the right plate (by inverseTermCreator).
    this.inverseTermCreator = null;

    // @private called when Term.dispose is called
    this.termWasDisposedBound = this.termWasDisposed.bind( this );

    // @private has this instance been fully initialized?
    this.isInitialized = false;
  }

  equalityExplorer.register( 'TermCreator', TermCreator );

  return inherit( Object, TermCreator, {

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

      // populate the scale, see https://github.com/phetsims/equality-explorer/issues/8
      assert && assert( this.plate, 'plate has not been initialized' );
      for ( var i = 0; i < this.initialNumberOfTermsOnScale; i++ ) {
        var cellIndex = this.plate.getFirstEmptyCell();
        assert && assert( cellIndex !== -1, 'oops, plate is full' );
        this.createTermOnScale( cellIndex );
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
     * @param {Event|null} event - event is provided if a user interaction is creating the term
     * @param {Object} [options] - passed to the Term's constructor
     * @returns {Term}
     * @public
     */
    createTerm: function( event, options ) {

      // create term
      var term = this.createTermProtected( options );
      this.allTerms.add( term );

      // Clean up when the term is disposed. Term.dispose handles removal of this listener.
      term.disposedEmitter.addListener( this.termWasDisposedBound );

      // Notify that a term was created
      this.termCreatedEmitter.emit2( term, event );

      return term;
    },

    /**
     * Creates a term and puts it in a specified cell in the associate plate's 2D grid.
     * @param {number} cellIndex
     * @returns {Term}
     * @public
     */
    createTermOnScale: function( cellIndex ) {
      var term = this.createTerm( null /* event */ );
      this.putTermOnScale( term, cellIndex );
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
     * Gets the terms that are on the scale.
     * @returns {Term[]}
     * @public
     */
    getTermsOnScale: function() {
      return this.termsOnScale.getArray().slice(); // defensive copy
    },

    /**
     * Puts a term on the scale, in a specified cell in the associated plate's 2D grid.
     * @param {Term} term
     * @param {number} cellIndex
     * @public
     */
    putTermOnScale: function( term, cellIndex ) {
      assert && assert( this.allTerms.contains( term ), 'term not found: ' + term.toString() );
      assert && assert( !this.termsOnScale.contains( term ), 'term already on scale: ' + term.toString() );
      this.termsOnScale.push( term );
      this.plate.addTerm( term, cellIndex );
    },

    /**
     * Removes a term from the scale.
     * @param {Term} term
     * @public
     */
    removeTermFromScale: function( term ) {
      assert && assert( this.allTerms.contains( term ), 'term not found: ' + term.toString() );
      assert && assert( this.termsOnScale.contains( term ), 'term not on scale: ' + term.toString() );
      this.termsOnScale.remove( term );
      this.plate.removeTerm( term );
    },

    /**
     * Is the specified term on the scale?
     * @param {Term} term
     * @returns {boolean}
     * @public
     */
    isTermOnScale: function( term ) {
      return this.termsOnScale.contains( term );
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
     * Disposes of all terms that are on the scale.
     * @public
     */
    disposeTermsOnScale: function() {

      // use a while loop because disposing of a term modifies this.termsOnScale
      while ( this.termsOnScale.length > 0 ) {
        this.termsOnScale.get( 0 ).dispose(); // results in call to termWasDisposed
      }
    },

    /**
     * Called when Term.dispose is called.
     * @param {Term} term
     * @private
     */
    termWasDisposed: function( term ) {
      assert && assert( this.allTerms.contains( term ), 'term not found: ' + term.toString() );
      if ( this.isTermOnScale( term ) ) {
        this.removeTermFromScale( term );
      }
      this.allTerms.remove( term );
    }
  } );
} );
