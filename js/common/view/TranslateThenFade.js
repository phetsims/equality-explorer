// Copyright 2018-2020, University of Colorado Boulder

/**
 * Animation sequence that translates a Node, then fades it out.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const STEPPER = null; // Animation will be stepped via step function

/**
 * @param {Node} node
 * @param {Object} [options]
 * @constructor
 */
function TranslateThenFade( node, options ) {

  const self = this;

  options = merge( {
    destination: Vector2.ZERO, // destination position
    translateDuration: 0.7, // motion duration, in seconds
    fadeDuration: 0.25, // fade duration, in seconds
    onComplete: function() {}, // called when the animation completes
    onStop: function() {} // called when the animation is stopped (by calling stop)
  }, options );

  // @private
  this.onStop = options.onStop;

  // Property for animating position. unlink not needed.
  const positionProperty = new Property( node.translation );
  positionProperty.link( function( position ) {
    node.translation = position;
  } );

  // Property for animating opacity. unlink not needed.
  const opacityProperty = new NumberProperty( node.opacity );
  opacityProperty.link( function( opacity ) {
    node.opacity = opacity;
  } );

  // Animation for translate
  this.translateAnimation = new Animation( {
    stepEmitter: STEPPER,
    duration: options.translateDuration,
    targets: [ {
      property: positionProperty,
      easing: Easing.QUINTIC_IN,
      to: options.destination
    } ]
  } );

  // Animation for fade
  this.fadeAnimation = new Animation( {
    stepEmitter: STEPPER,
    duration: options.fadeDuration,
    targets: [ {
      property: opacityProperty,
      easing: Easing.LINEAR,
      to: 0
    } ]
  } );

  // When translation finishes, start opacity animation. removeListener not needed.
  this.translateAnimation.finishEmitter.addListener( function() {
    self.fadeAnimation.start();
  } );

  // When fade finishes, perform callback. removeListener not needed.
  this.fadeAnimation.finishEmitter.addListener( function() {
    options.onComplete();
  } );
}

equalityExplorer.register( 'TranslateThenFade', TranslateThenFade );

export default inherit( Object, TranslateThenFade, {

  /**
   * @param {number} dt - time step, in seconds
   * @public
   */
  step: function( dt ) {
    this.translateAnimation.step( dt );
    this.fadeAnimation.step( dt );
  },

  /**
   * Starts the animation.
   * @public
   */
  start: function() {
    this.translateAnimation.start();
  },

  /**
   * Stops the animation.
   * @public
   */
  stop: function() {
    this.translateAnimation.stop();
    this.fadeAnimation.stop();
    this.onStop();
  }
} );