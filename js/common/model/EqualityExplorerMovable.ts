// Copyright 2017-2021, University of Colorado Boulder

/**
 * EqualityExplorerMovable is a model element that is movable. It has a current position and a desired destination.
 *
 * The model element can be moved using either moveTo or animateTo.
 * moveTo moves immediately to a position, and is typically used while the user is dragging the model element.
 * animateTo animates to a position, and is typically used after the user releases the model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import equalityExplorer from '../../equalityExplorer.js';

type SelfOptions = {
  position: Vector2; // initial position
  dragBounds: Bounds2; // bounds that constrain dragging
  animationSpeed: number; // distance/second when animating
};

export type EqualityExplorerMovableOptions = SelfOptions;

type AnimationCallback = ( () => void ) | null;

type AnimateToOptions = {
  animationStepCallback: AnimationCallback; // called when animation step occurs
  animationCompletedCallback: AnimationCallback; // called when animation has completed
};

export default class EqualityExplorerMovable {

  private readonly _positionProperty: Property<Vector2>;

  // The same Property as _positionProperty, but with a read-only API.
  // Callers should use moveTo or animateTo instead of setting positionProperty.
  public readonly positionProperty: TReadOnlyProperty<Vector2>;

  public dragBounds: Bounds2;
  private readonly animationSpeed: number;

  // drag handlers must manage this flag during a drag sequence
  public readonly draggingProperty: Property<boolean>;

  // destination to animate to, set using animateTo
  private destination: Vector2;

  // Called when animation step occurs, set using animateTo. Don't do anything expensive here!
  private animationStepCallback: AnimationCallback;

  // called when animation to destination completes, set using animateTo
  private animationCompletedCallback: AnimationCallback;

  // has dispose completed?
  private _isDisposed: boolean;

  // emits when dispose has completed
  public readonly disposedEmitter: Emitter<[ EqualityExplorerMovable ]>;

  public constructor( providedOptions?: EqualityExplorerMovableOptions ) {

    const options = optionize<EqualityExplorerMovableOptions, SelfOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      dragBounds: Bounds2.EVERYTHING,
      animationSpeed: 400
    }, providedOptions );

    this._positionProperty = new Vector2Property( options.position );
    this.positionProperty = this._positionProperty;
    this.dragBounds = options.dragBounds;
    this.animationSpeed = options.animationSpeed;
    this.draggingProperty = new BooleanProperty( false );
    this.destination = options.position.copy();
    this.animationStepCallback = null;
    this.animationCompletedCallback = null;
    this._isDisposed = false;

    this.disposedEmitter = new Emitter( {
      parameters: [ { valueType: EqualityExplorerMovable } ]
    } );
  }

  public get isDisposed(): boolean { return this._isDisposed; }

  /**
   * Creates the options that would be needed to instantiate a copy of this object.
   * This is used by subclasses that implement copy.
   */
  public copyOptions(): EqualityExplorerMovableOptions {
    return {
      position: this.positionProperty.value,
      dragBounds: this.dragBounds,
      animationSpeed: this.animationSpeed
    };
  }

  public dispose(): void {
    assert && assert( !this.isDisposed, `dispose called twice for ${this}` );

    this.positionProperty.dispose();
    this.draggingProperty.dispose();

    // Do this last, sequence is important!
    this._isDisposed = true;
    this.disposedEmitter.emit( this );
    this.disposedEmitter.dispose();
  }

  public reset(): void {

    // call moveTo instead of positionProperty.set, so that any animation in progress is cancelled
    this.moveTo( this._positionProperty.initialValue );
  }

  /**
   * Moves immediately to the specified position, without animation.
   */
  public moveTo( position: Vector2 ): void {

    // cancel any pending callbacks
    this.animationStepCallback = null;
    this.animationCompletedCallback = null;

    // move immediately to the position
    this.destination = position;
    this._positionProperty.set( position );
  }

  /**
   * Animates to the specified position, with optional callbacks.
   */
  public animateTo( destination: Vector2, providedOptions?: AnimateToOptions ): void {

    const options = combineOptions<AnimateToOptions>( {
      animationStepCallback: null, // {function} called when animation step occurs
      animationCompletedCallback: null // {function} called when animation has completed
    }, providedOptions );

    this.destination = destination;
    this.animationStepCallback = options.animationStepCallback;
    this.animationCompletedCallback = options.animationCompletedCallback;
  }

  /**
   * Is this model element animating?
   */
  public isAnimating(): boolean {
    return !this.draggingProperty.value &&
           ( !this.positionProperty.get().equals( this.destination ) || !!this.animationCompletedCallback );
  }

  /**
   * Animates position, when not being dragged by the user.
   * @param dt - time since the previous step, in seconds
   */
  public step( dt: number ): void {

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
        this._positionProperty.set( this.destination );

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
        this._positionProperty.set( this.positionProperty.get().plus( stepVector ) );
      }
    }
  }
}

equalityExplorer.register( 'EqualityExplorerMovable', EqualityExplorerMovable );