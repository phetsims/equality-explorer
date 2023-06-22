// Copyright 2018-2022, University of Colorado Boulder

/**
 * Animation sequence that translates a Node, then fades it out.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const STEP_EMITTER = null; // Animations will be stepped via this.step

type SelfOptions = {
  destination?: Vector2; // destination position
  onComplete?: () => void; // called when the animation completes
  onStop?: () => void; // called when the animation is stopped (by calling stop)
  translateDuration?: number; // motion duration, in seconds
  fadeDuration?: number; // fade duration, in seconds
};

type TranslateThenFadeOptions = SelfOptions;

export default class TranslateThenFade {

  private readonly onStop: () => void;
  private readonly translateAnimation: Animation; // Animation for translate
  private readonly fadeAnimation: Animation; // Animation for fade

  public constructor( node: Node, providedOptions?: TranslateThenFadeOptions ) {

    const options = optionize<TranslateThenFadeOptions, SelfOptions>()( {

      // SelfOptions
      destination: Vector2.ZERO,
      onComplete: _.noop,
      onStop: _.noop,
      translateDuration: 0.7,
      fadeDuration: 0.25
    }, providedOptions );

    this.onStop = options.onStop;

    // Property for animating position.
    const positionProperty = new Property( node.translation );
    positionProperty.link( position => {
      node.translation = position;
    } );

    // Property for animating opacity.
    const opacityProperty = new NumberProperty( node.opacity, {
      range: new Range( 0, 1 )
    } );
    opacityProperty.link( opacity => {
      node.opacity = opacity;
    } );

    this.translateAnimation = new Animation( {
      stepEmitter: STEP_EMITTER,
      duration: options.translateDuration,
      targets: [ {
        property: positionProperty,
        easing: Easing.QUINTIC_IN,
        to: options.destination
      } ]
    } );

    this.fadeAnimation = new Animation( {
      stepEmitter: STEP_EMITTER,
      duration: options.fadeDuration,
      targets: [ {
        property: opacityProperty,
        easing: Easing.LINEAR,
        to: 0
      } ]
    } );

    // When translation finishes, start fade animation.
    this.translateAnimation.finishEmitter.addListener( () => this.fadeAnimation.start() );

    // When fade finishes, perform callback.
    this.fadeAnimation.finishEmitter.addListener( () => options.onComplete() );
  }

  /**
   * Steps the animation.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.translateAnimation.step( dt );
    this.fadeAnimation.step( dt );
  }

  /**
   * Starts the animation.
   */
  public start(): void {
    this.translateAnimation.start();
  }

  /**
   * Stops the animation.
   */
  public stop(): void {
    this.translateAnimation.stop();
    this.fadeAnimation.stop();
    this.onStop();
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

equalityExplorer.register( 'TranslateThenFade', TranslateThenFade );