// Copyright 2017-2018, University of Colorado Boulder

//TODO migrate to common code? This was copied from unit-rates.URMovable, which was copied from function-builder.Movable
/**
 * A model element that is movable.
 * It has a current location and a desired destination.
 * When the user drags the model element, it moves immediately to the desired destination.
 * When the destination is set programmatically, it animates to the desired destination.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function EqualityExplorerMovable( options ) {

    options = _.extend( {
      location: Vector2.ZERO, // {Vector2} initial location
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} bounds that constrain dragging
      dragging: false, // {boolean} is this instance being dragged by the user?
      animationSpeed: 400 // {number} distance/second when animating
    }, options );

    // @public (read-only) {Property.<Vector2>} DO NOT set this directly! Use moveTo or animateTo.
    this.locationProperty = new Property( options.location, { valueType: Vector2 } );

    // @public (read-only)
    this.dragBounds = options.dragBounds;

    // @public drag handlers must manage this flag during a drag sequence
    this.dragging = options.dragging;

    // @private
    this.animationSpeed = options.animationSpeed;

    // @private {Vector2} destination to animate to, set using animateTo
    this.destination = options.location.copy();

    // @private {function|null} called when animation step occurs, set using animateTo. Don't do anything expensive here!
    this.animationStepCallback = null;

    // @private {function|null} called when animation to destination completes, set using animateTo
    this.animationCompletedCallback = null;

    // @public (read-only) emit1 when dispose has completed.
    // Callback signature is function( {Term} term ), where the parameter is the term that was disposed.
    this.disposedEmitter = new Emitter();

    // @public (read-only) has dispose completed?
    this.disposed = false;
  }

  equalityExplorer.register( 'EqualityExplorerMovable', EqualityExplorerMovable );

  return inherit( Object, EqualityExplorerMovable, {

    /**
     * Creates the options that would be needed to instantiate a copy of this object.
     * This is used by subtypes that implement copy.
     * @returns {Object}
     * @public
     */
    copyOptions: function() {
      return {
        location: this.locationProperty.value,
        dragBounds: this.dragBounds,
        animationSpeed: this.animationSpeed
      };
    },

    // @public
    dispose: function() {
      assert && assert( !this.disposed, 'dispose called twice for ' + this );

      this.locationProperty.dispose();

      // Do this last, sequence is important!
      this.disposed = true;
      this.disposedEmitter.emit1( this );
      this.disposedEmitter.dispose();
    },

    // @public
    reset: function() {

      // call moveTo instead of locationProperty.set, so that any animation in progress is cancelled
      this.moveTo( this.locationProperty.initialValue );
    },

    /**
     * Moves immediately to the specified location, without animation.
     * @param {Vector2} location
     * @public
     */
    moveTo: function( location ) {

      // cancel any pending callbacks
      this.animationStepCallback = null;
      this.animationCompletedCallback = null;

      // move immediately to the location
      this.destination = location;
      this.locationProperty.set( location );
    },

    /**
     * Animates to the specified location.
     * Provides optional callback that occur on animation step and completion.
     * @param {Vector2} destination
     * @param {Object} [options]
     * @public
     */
    animateTo: function( destination, options ) {

      options = _.extend( {
        animationStepCallback: null, // {function} called when animation step occurs
        animationCompletedCallback: null // {function} called when animation has completed
      }, options );

      this.destination = destination;
      this.animationStepCallback = options.animationStepCallback;
      this.animationCompletedCallback = options.animationCompletedCallback;
    },

    /**
     * Animates location, when not being dragged by the user.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {
      
      assert && assert( !this.disposed, 'attempt to step disposed moveable' );

      var doStep = !this.dragging &&
                   ( !this.locationProperty.get().equals( this.destination ) || this.animationCompletedCallback );

      if ( doStep ) {

        // optional callback
        this.animationStepCallback && this.animationStepCallback();

        // distance from destination
        var totalDistance = this.locationProperty.get().distance( this.destination );

        // distance to move on this step
        var stepDistance = this.animationSpeed * dt;

        if ( totalDistance <= stepDistance ) {

          // move directly to the destination
          this.locationProperty.set( this.destination );

          // Perform the animationCompletedCallback, which may set a new callback. The new callback must be
          // a new function instance, since equality is used to check whether a new callback was set.
          var saveAnimationCompletedCallback = this.animationCompletedCallback;
          this.animationCompletedCallback && this.animationCompletedCallback();
          if ( saveAnimationCompletedCallback === this.animationCompletedCallback ) {
            this.animationCompletedCallback = null;
          }
        }
        else {

          // move one step towards the destination
          var stepAngle = Math.atan2(
            this.destination.y - this.locationProperty.get().y,
            this.destination.x - this.locationProperty.get().x );
          var stepVector = Vector2.createPolar( stepDistance, stepAngle );
          this.locationProperty.set( this.locationProperty.get().plus( stepVector ) );
        }
      }
    }
  } );
} );
