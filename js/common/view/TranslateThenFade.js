// Copyright 2018-2020, University of Colorado Boulder

/**
 * Animation sequence that translates a Node, then fades it out.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const STEPPER = null; // Animation will be stepped via step function

class TranslateThenFade {

  /**
   * @param {Node} node
   * @param {Object} [options]
   */
  constructor( node, options ) {

    options = merge( {
      destination: Vector2.ZERO, // destination position
      translateDuration: 0.7, // motion duration, in seconds
      fadeDuration: 0.25, // fade duration, in seconds
      onComplete: () => {}, // called when the animation completes
      onStop: () => {} // called when the animation is stopped (by calling stop)
    }, options );

    // @private
    this.onStop = options.onStop;

    // Property for animating position. unlink not needed.
    const positionProperty = new Property( node.translation );
    positionProperty.link( position => {
      node.translation = position;
    } );

    // Property for animating opacity. unlink not needed.
    const opacityProperty = new NumberProperty( node.opacity );
    opacityProperty.link( opacity => {
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
    this.translateAnimation.finishEmitter.addListener( () => this.fadeAnimation.start() );

    // When fade finishes, perform callback. removeListener not needed.
    this.fadeAnimation.finishEmitter.addListener( () => options.onComplete() );
  }

  /**
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    this.translateAnimation.step( dt );
    this.fadeAnimation.step( dt );
  }

  /**
   * Starts the animation.
   * @public
   */
  start() {
    this.translateAnimation.start();
  }

  /**
   * Stops the animation.
   * @public
   */
  stop() {
    this.translateAnimation.stop();
    this.fadeAnimation.stop();
    this.onStop();
  }
}

equalityExplorer.register( 'TranslateThenFade', TranslateThenFade );

export default TranslateThenFade;