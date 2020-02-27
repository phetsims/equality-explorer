// Copyright 2017-2020, University of Colorado Boulder

/**
 * A model element that is movable. It has a current position and a desired destination.
 *
 * The model element can be moved using either moveTo or animateTo.
 * moveTo moves immediately to a position, and is typically used while the user is dragging the model element.
 * animateTo animates to a position, and is typically used after the user releases the model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import equalityExplorer from '../../equalityExplorer.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function EqualityExplorerMovable( options ) {

  options = merge( {
    position: Vector2.ZERO, // {Vector2} initial position
    dragBounds: Bounds2.EVERYTHING, // {Bounds2} bounds that constrain dragging
    animationSpeed: 400 // {number} distance/second when animating
  }, options );

  // @public (read-only) DO NOT set this directly! Use moveTo or animateTo.
  this.positionProperty = new Vector2Property( options.position );

  // @public (read-only)
  this.dragBounds = options.dragBounds;

  // @public drag handlers must manage this flag during a drag sequence
  this.draggingProperty = new BooleanProperty( false );

  // @private
  this.animationSpeed = options.animationSpeed;

  // @private {Vector2} destination to animate to, set using animateTo
  this.destination = options.position.copy();

  // @private {function|null} called when animation step occurs, set using animateTo.
  // Don't do anything expensive here!
  this.animationStepCallback = null;

  // @private {function|null} called when animation to destination completes, set using animateTo
  this.animationCompletedCallback = null;

  // @public (read-only) emit when dispose has completed.
  this.disposedEmitter = new Emitter( {
    parameters: [ { valueType: EqualityExplorerMovable } ]
  } );

  // @public (read-only) has dispose completed?
  this.isDisposed = false;
}

equalityExplorer.register( 'EqualityExplorerMovable', EqualityExplorerMovable );

export default inherit( Object, EqualityExplorerMovable, {

  /**
   * Creates the options that would be needed to instantiate a copy of this object.
   * This is used by subtypes that implement copy.
   * @returns {Object}
   * @public
   */
  copyOptions: function() {
    return {
      position: this.positionProperty.value,
      dragBounds: this.dragBounds,
      animationSpeed: this.animationSpeed
    };
  },

  // @public
  dispose: function() {
    assert && assert( !this.isDisposed, 'dispose called twice for ' + this );

    this.positionProperty.dispose();
    this.draggingProperty.dispose();

    // Do this last, sequence is important!
    this.isDisposed = true;
    this.disposedEmitter.emit( this );
    this.disposedEmitter.dispose();
  },

  // @public
  reset: function() {

    // call moveTo instead of positionProperty.set, so that any animation in progress is cancelled
    this.moveTo( this.positionProperty.initialValue );
  },

  /**
   * Moves immediately to the specified position, without animation.
   * @param {Vector2} position
   * @public
   */
  moveTo: function( position ) {

    // cancel any pending callbacks
    this.animationStepCallback = null;
    this.animationCompletedCallback = null;

    // move immediately to the position
    this.destination = position;
    this.positionProperty.set( position );
  },

  /**
   * Animates to the specified position.
   * Provides optional callback that occur on animation step and completion.
   * @param {Vector2} destination
   * @param {Object} [options]
   * @public
   */
  animateTo: function( destination, options ) {

    options = merge( {
      animationStepCallback: null, // {function} called when animation step occurs
      animationCompletedCallback: null // {function} called when animation has completed
    }, options );

    this.destination = destination;
    this.animationStepCallback = options.animationStepCallback;
    this.animationCompletedCallback = options.animationCompletedCallback;
  },

  /**
   * Is this model element animating?
   * @returns {boolean}
   * @public
   */
  isAnimating: function() {
    return !this.draggingProperty.value &&
           ( !this.positionProperty.get().equals( this.destination ) || !!this.animationCompletedCallback );
  },

  /**
   * Animates position, when not being dragged by the user.
   * @param {number} dt - time since the previous step, in seconds
   * @public
   */
  step: function( dt ) {

    assert && assert( !this.isDisposed, 'attempt to step disposed movable' );

    if ( this.isAnimating() ) {

      // optional callback
      this.animationStepCallback && this.animationStepCallback();

      // distance from destination
      const totalDistance = this.positionProperty.get().distance( this.destination );

      // distance to move on this step
      const stepDistance = this.animationSpeed * dt;

      if ( totalDistance <= stepDistance ) {

        // move directly to the destination
        this.positionProperty.set( this.destination );

        // Perform the animationCompletedCallback, which may set a new callback by calling animateTo.
        // The new callback must be a new function instance, since equality is used to check whether
        // a new callback was set.
        const saveAnimationCompletedCallback = this.animationCompletedCallback;
        this.animationCompletedCallback && this.animationCompletedCallback();
        if ( saveAnimationCompletedCallback === this.animationCompletedCallback ) {
          this.animationCompletedCallback = null;
        }
      }
      else {

        // move one step towards the destination
        const stepAngle = Math.atan2(
          this.destination.y - this.positionProperty.get().y,
          this.destination.x - this.positionProperty.get().x );
        const stepVector = Vector2.createPolar( stepDistance, stepAngle );
        this.positionProperty.set( this.positionProperty.get().plus( stepVector ) );
      }
    }
  }
} );