// Copyright 2017-2022, University of Colorado Boulder

/**
 * User-interface component for picking one of several values. The values are arbitrary Objects.
 *
 * NOTE: A long time ago in a galaxy far, far away, ObjectPicker was mostly copied from NumberPicker. While not
 * totally in-sync, their implementations remained similar for quite a while (not exactly light years, but hey, this
 * is software). But alas dear reader, by the time that you discover this prose, ObjectPicker and NumberPicker will
 * have undoubtedly diverged so much that it will be a real headache to unify them. To that, I have 2 words to offer:
 * 'priorities' and 'sorry'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color, FireListener, FireListenerOptions, LinearGradient, Node, NodeOptions, Path, PathOptions, Rectangle, TColor } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';

const ButtonStateValues = [ 'up', 'down', 'over', 'out' ] as const;
type ButtonState = ( typeof ButtonStateValues )[number];

type ArrowColors = {
  up: TColor;
  over: TColor;
  down: TColor;
  out: TColor;
  disabled: TColor;
};

type BackgroundColors = {
  up: TColor;
  over: LinearGradient;
  down: LinearGradient;
  out: LinearGradient;
  disabled: TColor;
};

export type ObjectPickerItem<T> = {
  value: T;
  node: Node;
};

type SelfOptions = {
  wrapEnabled?: boolean; // whether to wrap around at ends of range
  backgroundColor?: TColor; // color of the background when pointer is not over it
  arrowsColor?: TColor; // color of arrows
  arrowsPressedColor?: TColor; // color of arrows when pressed, computed if null
  gradientColor?: TColor; // base color of top/bottom gradient on pointer over, defaults to options.arrowsColor if null
  gradientPressedColor?: TColor; // {Color|string|null} color top/bottom gradient when pressed, computed if null
  cornerRadius?: number;
  xMargin?: number;
  yMargin?: number;
  timerDelay?: number; // start to fire continuously after pressing for this long (milliseconds)
  timerInterval?: number; // fire continuously at this frequency (milliseconds),
  touchAreaXDilation?: number;
  touchAreaYDilation?: number;
  mouseAreaXDilation?: number;
  mouseAreaYDilation?: number;
  backgroundStroke?: TColor;
  backgroundLineWidth?: number;
  arrowHeight?: number;
  arrowYSpacing?: number;
  arrowStroke?: TColor;
  arrowLineWidth?: number;
  incrementFunction?: ( index: number ) => number;
  decrementFunction?: ( index: number ) => number;

  // whether increment and decrement are enabled.
  // If the client provides these, then the client is fully responsible for the state of these Properties.
  // If null, a default implementation is used.
  incrementEnabledProperty?: LinkableProperty<boolean> | null;
  decrementEnabledProperty?: LinkableProperty<boolean> | null;
};

type ObjectPickerOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

class ObjectPicker<T> extends Node {

  private readonly disposeObjectPicker: () => void;

  /**
   * @param valueProperty - value of the current item that is displayed
   * @param items - the set of items that you can select from
   * @param [providedOptions]
   */
  public constructor( valueProperty: Property<T>, items: ObjectPickerItem<T>[], providedOptions: ObjectPickerOptions ) {

    const options = optionize<ObjectPickerOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      wrapEnabled: false,
      cursor: 'pointer',
      backgroundColor: 'white',
      arrowsColor: 'blue',
      arrowsPressedColor: null,
      gradientColor: null,
      gradientPressedColor: null,
      cornerRadius: 6,
      xMargin: 3,
      yMargin: 3,
      timerDelay: 400,
      timerInterval: 100,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 5,
      backgroundStroke: 'gray',
      backgroundLineWidth: 0.5,
      arrowHeight: 6,
      arrowYSpacing: 3,
      arrowStroke: 'black',
      arrowLineWidth: 0.25,
      incrementFunction: ( index: number ) => index + 1,
      decrementFunction: ( index: number ) => index - 1,
      incrementEnabledProperty: null,
      decrementEnabledProperty: null
    }, providedOptions );

    options.arrowsPressedColor = options.arrowsPressedColor || Color.toColor( options.arrowsColor ).darkerColor();
    options.gradientColor = options.gradientColor || options.arrowsColor;
    options.gradientPressedColor = options.gradientPressedColor || Color.toColor( options.gradientColor ).darkerColor();

    super();

    //------------------------------------------------------------
    // Nodes

    // maximum dimensions of item Nodes
    assert && assert( items.length > 0 );
    const maxWidth = _.maxBy( items, item => item.node.width )!.node.width;
    const maxHeight = _.maxBy( items, item => item.node.height )!.node.height;

    // compute shape of the background behind the value
    const backgroundWidth = maxWidth + ( 2 * options.xMargin );
    const backgroundHeight = maxHeight + ( 2 * options.yMargin );
    const backgroundOverlap = 1;
    const backgroundCornerRadius = options.cornerRadius;

    // parent for value, to maintain rendering order and simplify centering
    const valueParentNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, {
      pickable: false
    } );

    // Top half of the background. Pressing here will increment the value.
    // Shape computed starting at upper-left, going clockwise.
    const incrementBackgroundNode = new Path( new Shape()
        .arc( backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, Math.PI, Math.PI * 3 / 2, false )
        .arc( backgroundWidth - backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, -Math.PI / 2, 0, false )
        .lineTo( backgroundWidth, ( backgroundHeight / 2 ) + backgroundOverlap )
        .lineTo( 0, ( backgroundHeight / 2 ) + backgroundOverlap )
        .close(),
      { pickable: false } );

    // Bottom half of the background. Pressing here will decrement the value.
    // Shape computed starting at bottom-right, going clockwise.
    const decrementBackgroundNode = new Path( new Shape()
        .arc( backgroundWidth - backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, 0, Math.PI / 2, false )
        .arc( backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, Math.PI / 2, Math.PI, false )
        .lineTo( 0, backgroundHeight / 2 )
        .lineTo( backgroundWidth, backgroundHeight / 2 )
        .close(),
      { pickable: false } );

    // separate rectangle for stroke around value background
    const strokedBackground = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, backgroundCornerRadius, backgroundCornerRadius, {
      pickable: false,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } );

    // compute size of arrows
    const arrowButtonSize = new Dimension2( 0.5 * backgroundWidth, options.arrowHeight );

    // options shared by both arrows
    const arrowOptions = {
      stroke: options.arrowStroke,
      lineWidth: options.arrowLineWidth,
      pickable: false
    };

    // increment arrow, pointing up, described clockwise from tip
    const incrementArrow = new Path( new Shape()
        .moveTo( arrowButtonSize.width / 2, 0 )
        .lineTo( arrowButtonSize.width, arrowButtonSize.height )
        .lineTo( 0, arrowButtonSize.height )
        .close(),
      combineOptions<PathOptions>( {}, arrowOptions, {
        centerX: incrementBackgroundNode.centerX,
        bottom: incrementBackgroundNode.top - options.arrowYSpacing
      } ) );

    // decrement arrow, pointing down, described clockwise from the tip
    const decrementArrow = new Path( new Shape()
        .moveTo( arrowButtonSize.width / 2, arrowButtonSize.height )
        .lineTo( 0, 0 )
        .lineTo( arrowButtonSize.width, 0 )
        .close(),
      combineOptions<PathOptions>( {}, arrowOptions, {
        centerX: decrementBackgroundNode.centerX,
        top: decrementBackgroundNode.bottom + options.arrowYSpacing
      } ) );

    // parents for increment and decrement components
    const incrementParent = new Node( { children: [ incrementBackgroundNode, incrementArrow ] } );
    incrementParent.addChild( new Rectangle( incrementParent.localBounds ) ); // invisible overlay
    const decrementParent = new Node( { children: [ decrementBackgroundNode, decrementArrow ] } );
    decrementParent.addChild( new Rectangle( decrementParent.localBounds ) ); // invisible overlay

    // rendering order
    this.addChild( incrementParent );
    this.addChild( decrementParent );
    this.addChild( strokedBackground );
    this.addChild( valueParentNode );

    //------------------------------------------------------------
    // Pointer areas

    // touch areas
    incrementParent.touchArea = Shape.rectangle(
      incrementParent.left - ( options.touchAreaXDilation / 2 ), incrementParent.top - options.touchAreaYDilation,
      incrementParent.width + options.touchAreaXDilation, incrementParent.height + options.touchAreaYDilation );
    decrementParent.touchArea = Shape.rectangle(
      decrementParent.left - ( options.touchAreaXDilation / 2 ), decrementParent.top,
      decrementParent.width + options.touchAreaXDilation, decrementParent.height + options.touchAreaYDilation );

    // mouse areas
    incrementParent.mouseArea = Shape.rectangle(
      incrementParent.left - ( options.mouseAreaXDilation / 2 ), incrementParent.top - options.mouseAreaYDilation,
      incrementParent.width + options.mouseAreaXDilation, incrementParent.height + options.mouseAreaYDilation );
    decrementParent.mouseArea = Shape.rectangle(
      decrementParent.left - ( options.mouseAreaXDilation / 2 ), decrementParent.top,
      decrementParent.width + options.mouseAreaXDilation, decrementParent.height + options.mouseAreaYDilation );

    //------------------------------------------------------------
    // Colors

    // arrow colors, corresponding to ButtonState and incrementEnabledProperty/decrementEnabledProperty
    const arrowColors = {
      up: options.arrowsColor,
      over: options.arrowsColor,
      down: options.arrowsPressedColor,
      out: options.arrowsColor,
      disabled: 'rgb( 176,176,176 )'
    };

    // background colors, corresponding to ButtonState and enabledProperty.value
    const highlightGradient = createVerticalGradient( options.gradientColor, options.backgroundColor, options.gradientColor, backgroundHeight );
    const pressedGradient = createVerticalGradient( options.gradientPressedColor, options.backgroundColor, options.gradientPressedColor, backgroundHeight );
    const backgroundColors = {
      up: options.backgroundColor,
      over: highlightGradient,
      down: pressedGradient,
      out: pressedGradient,
      disabled: options.backgroundColor
    };

    //------------------------------------------------------------
    // Properties

    // index of the item that's currently selected
    const indexProperty = new NumberProperty( indexOfItemWithValue<T>( items, valueProperty.value ), {
      numberType: 'Integer',
      range: new Range( 0, items.length - 1 )
    } );

    const incrementButtonStateProperty = new StringUnionProperty( 'up', {
      validValues: ButtonStateValues
    } );
    const decrementButtonStateProperty = new StringUnionProperty( 'down', {
      validValues: ButtonStateValues
    } );

    // enables the increment button
    const incrementEnabledProperty = options.incrementEnabledProperty ||
                                     new DerivedProperty( [ indexProperty ],
                                       index => ( options.wrapEnabled || ( index < items.length - 1 ) )
                                     );

    // enables the decrement button
    const decrementEnabledProperty = options.decrementEnabledProperty ||
                                     new DerivedProperty( [ indexProperty ],
                                       index => ( options.wrapEnabled || ( index > 0 ) )
                                     );

    //------------------------------------------------------------
    // Observers and InputListeners

    const inputListenerOptions: ObjectPickerInputListenerOptions = {
      fireOnHold: true,
      fireOnHoldDelay: options.timerDelay,
      fireOnHoldInterval: options.timerInterval
    };

    const incrementInputListener = new ObjectPickerInputListener( incrementButtonStateProperty,
      combineOptions<ObjectPickerInputListenerOptions>( {}, inputListenerOptions, {
        fire: () => {
          if ( incrementInputListener.enabled ) {
            let index = options.incrementFunction( indexProperty.value );
            if ( options.wrapEnabled && index >= items.length ) {
              index = options.incrementFunction( -1 );
            }
            indexProperty.value = index;
          }
        },
        tandem: options.tandem.createTandem( 'incrementInputListener' )
      } ) );
    incrementParent.addInputListener( incrementInputListener );

    const decrementInputListener = new ObjectPickerInputListener( decrementButtonStateProperty,
      combineOptions<ObjectPickerInputListenerOptions>( {}, inputListenerOptions, {
        fire: () => {
          if ( decrementInputListener.enabled ) {
            let index = options.decrementFunction( indexProperty.value );
            if ( options.wrapEnabled && index < 0 ) {
              index = options.decrementFunction( items.length );
            }
            indexProperty.value = index;
          }
        },
        tandem: options.tandem.createTandem( 'decrementInputListener' )
      } ) );
    decrementParent.addInputListener( decrementInputListener );

    // enable/disable, unlink required
    const incrementEnabledListener = ( enabled: boolean ) => {
      incrementInputListener.enabled = enabled;
    };
    const decrementEnabledListener = ( enabled: boolean ) => {
      decrementInputListener.enabled = enabled;
    };
    incrementEnabledProperty.link( incrementEnabledListener );
    decrementEnabledProperty.link( decrementEnabledListener );

    // Update displayed Node and index to match the current value
    const valueObserver = ( value: T ) => {

      valueParentNode.removeAllChildren();

      // show the node associated with the value
      const index = indexOfItemWithValue<T>( items, value );
      const valueNode = items[ index ].node;
      valueParentNode.addChild( valueNode );
      valueNode.centerX = backgroundWidth / 2;
      valueNode.centerY = backgroundHeight / 2;

      // synchronize the index
      indexProperty.value = index;
    };
    valueProperty.link( valueObserver ); // unlink required in dispose

    // unlink not required
    indexProperty.link( index => {
      valueProperty.value = items[ index ].value;
    } );

    // update colors for increment components
    Multilink.multilink(
      [ incrementButtonStateProperty, incrementEnabledProperty ],
      ( buttonState, enabled ) => {
        updateColors( buttonState, enabled, incrementBackgroundNode, incrementArrow, backgroundColors, arrowColors );
      } );

    // update colors for decrement components
    Multilink.multilink(
      [ decrementButtonStateProperty, decrementEnabledProperty ],
      ( buttonState, enabled ) => {
        updateColors( buttonState, enabled, decrementBackgroundNode, decrementArrow, backgroundColors, arrowColors );
      } );

    this.mutate( options );

    this.disposeObjectPicker = () => {

      if ( valueProperty.hasListener( valueObserver ) ) {
        valueProperty.unlink( valueObserver );
      }

      if ( incrementEnabledProperty.hasListener( incrementEnabledListener ) ) {
        incrementEnabledProperty.unlink( incrementEnabledListener );
      }

      if ( decrementEnabledProperty.hasListener( decrementEnabledListener ) ) {
        decrementEnabledProperty.unlink( decrementEnabledListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeObjectPicker();
    super.dispose();
  }
}

/**
 * Converts FireListener events to ButtonState changes.
 */
type ObjectPickerInputListenerOptions = FireListenerOptions<FireListener>;

class ObjectPickerInputListener extends FireListener {
  public constructor( buttonStateProperty: StringUnionProperty<ButtonState>, options: ObjectPickerInputListenerOptions ) {
    super( options );
    Multilink.multilink(
      [ this.isOverProperty, this.isPressedProperty ],
      ( isOver, isPressed ) => {
        buttonStateProperty.set(
          isOver && !isPressed ? 'over' :
          isOver && isPressed ? 'down' :
          !isOver && !isPressed ? 'up' :
          'out'
        );
      } );

    this.enabled = true;
  }
}

/**
 * Gets the index of the item that has a specified value.
 */
function indexOfItemWithValue<T>( items: ObjectPickerItem<T>[], value: T ): number {
  let index = -1;
  for ( let i = 0; i < items.length; i++ ) {
    if ( items[ i ].value === value ) {
      index = i;
      break;
    }
  }
  assert && assert( index !== -1, `invalid value: ${index}` );
  return index;
}

/**
 * Creates a vertical gradient.
 */
function createVerticalGradient( topColor: TColor, centerColor: TColor, bottomColor: TColor, height: number ): LinearGradient {
  return new LinearGradient( 0, 0, 0, height )
    .addColorStop( 0, topColor )
    .addColorStop( 0.5, centerColor )
    .addColorStop( 1, bottomColor );
}

/**
 * Updates arrow and background colors
 */
function updateColors( buttonState: ButtonState, enabled: boolean, background: Path, arrow: Path,
                       backgroundColors: BackgroundColors, arrowColors: ArrowColors ): void {
  if ( enabled ) {
    arrow.stroke = 'black';
    if ( buttonState === 'up' ) {
      background.fill = backgroundColors.up;
      arrow.fill = arrowColors.up;
    }
    else if ( buttonState === 'over' ) {
      background.fill = backgroundColors.over;
      arrow.fill = arrowColors.over;
    }
    else if ( buttonState === 'down' ) {
      background.fill = backgroundColors.down;
      arrow.fill = arrowColors.down;
    }
    else if ( buttonState === 'out' ) {
      background.fill = backgroundColors.out;
      arrow.fill = arrowColors.out;
    }
    else {
      throw new Error( `unsupported buttonState: ${buttonState}` );
    }
  }
  else {
    background.fill = backgroundColors.disabled;
    arrow.fill = arrowColors.disabled;
    arrow.stroke = arrowColors.disabled; // stroke so that arrow size will look the same when it's enabled/disabled
  }
}

equalityExplorer.register( 'ObjectPicker', ObjectPicker );
export default ObjectPicker;