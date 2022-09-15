// Copyright 2017-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * User-interface component for picking one of several values. The values are arbitry Objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { Shape } from '../../../../kite/js/imports.js';
import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color, FireListener, LinearGradient, Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const ButtonState = EnumerationDeprecated.byKeys( [ 'UP', 'DOWN', 'OVER', 'OUT' ] );

class ObjectPicker extends Node {

  /**
   * @param {Property.<Object>} valueProperty - value of the current item that is displayed
   * @param {{value:Object, node:Node}[]} items - the set of items that you can select from
   * @param {Object} [options]
   */
  constructor( valueProperty, items, options ) {

    options = merge( {
      wrapEnabled: false, // whether to wrap around at ends of range
      cursor: 'pointer',
      backgroundColor: 'white', // {Color|string} color of the background when pointer is not over it
      arrowsColor: 'blue', // {Color|string} color of arrows
      arrowsPressedColor: null, // {Color|string|null} color of arrows when pressed, computed if null
      gradientColor: null, // base color of top/bottom gradient on pointer over, defaults to options.arrowsColor if null
      gradientPressedColor: null, // {Color|string|null} color top/bottom gradient when pressed, computed if null
      cornerRadius: 6,
      xMargin: 3,
      yMargin: 3,
      timerDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      timerInterval: 100, // fire continuously at this frequency (milliseconds),
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
      incrementFunction: index => index + 1,
      decrementFunction: index => index - 1,

      // {Property.<boolean>|null} whether increment and decrement are enabled.
      // If the client provides these, then the client is fully responsible for the state of these Properties.
      // If null, a default implementation is used.
      incrementEnabledProperty: null,
      decrementEnabledProperty: null
    }, options );

    options.arrowsPressedColor = options.arrowsPressedColor || Color.toColor( options.arrowsColor ).darkerColor();
    options.gradientColor = options.gradientColor || options.arrowsColor;
    options.gradientPressedColor = options.gradientPressedColor || Color.toColor( options.gradientColor ).darkerColor();

    super();

    //------------------------------------------------------------
    // Nodes

    // maximum dimensions of item Nodes
    const maxWidth = _.maxBy( items, item => item.node.width ).node.width;
    const maxHeight = _.maxBy( items, item => item.node.height ).node.height;

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
      merge( {}, arrowOptions, {
        centerX: incrementBackgroundNode.centerX,
        bottom: incrementBackgroundNode.top - options.arrowYSpacing
      } ) );

    // decrement arrow, pointing down, described clockwise from the tip
    const decrementArrow = new Path( new Shape()
        .moveTo( arrowButtonSize.width / 2, arrowButtonSize.height )
        .lineTo( 0, 0 )
        .lineTo( arrowButtonSize.width, 0 )
        .close(),
      merge( {}, arrowOptions, {
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
    const indexProperty = new NumberProperty( indexOfItemWithValue( items, valueProperty.value ), {
      numberType: 'Integer',
      range: new Range( 0, items.length - 1 )
    } );

    const incrementButtonStateProperty = new EnumerationDeprecatedProperty( ButtonState, ButtonState.UP );
    const decrementButtonStateProperty = new EnumerationDeprecatedProperty( ButtonState, ButtonState.UP );

    // enables the increment button
    if ( !options.incrementEnabledProperty ) {
      options.incrementEnabledProperty = new DerivedProperty( [ indexProperty ],
        index => ( options.wrapEnabled || ( index < items.length - 1 ) )
      );
    }

    // enables the decrement button
    if ( !options.decrementEnabledProperty ) {
      options.decrementEnabledProperty = new DerivedProperty( [ indexProperty ],
        index => ( options.wrapEnabled || ( index > 0 ) )
      );
    }

    //------------------------------------------------------------
    // Observers and InputListeners

    const inputListenerOptions = {
      fireOnHold: true,
      fireOnHoldDelay: options.timerDelay,
      fireOnHoldInterval: options.timerInterval
    };

    // increment - removeInputListener unnecessary
    const incrementInputListener = new ObjectPickerInputListener( incrementButtonStateProperty,
      merge( {
        fire: () => {
          if ( incrementInputListener.enabled ) {
            let index = options.incrementFunction( indexProperty.value );
            if ( options.wrapEnabled && index >= items.length ) {
              index = options.incrementFunction( -1 );
            }
            indexProperty.value = index;
          }
        }
      }, inputListenerOptions ) );
    incrementParent.addInputListener( incrementInputListener );

    // decrement - removeInputListener unnecessary
    const decrementInputListener = new ObjectPickerInputListener( decrementButtonStateProperty,
      merge( {
        fire: () => {
          if ( decrementInputListener.enabled ) {
            let index = options.decrementFunction( indexProperty.value );
            if ( options.wrapEnabled && index < 0 ) {
              index = options.decrementFunction( items.length );
            }
            indexProperty.value = index;
          }
        }
      }, inputListenerOptions ) );
    decrementParent.addInputListener( decrementInputListener );

    // enable/disable, unlink required
    const incrementEnabledListener = enabled => {
      incrementInputListener.enabled = enabled;
    };
    const decrementEnabledListener = enabled => {
      decrementInputListener.enabled = enabled;
    };
    options.incrementEnabledProperty.link( incrementEnabledListener );
    options.decrementEnabledProperty.link( decrementEnabledListener );

    // Update displayed Node and index to match the current value
    const valueObserver = value => {

      valueParentNode.removeAllChildren();

      // show the node associated with the value
      const index = indexOfItemWithValue( items, value );
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

    // update colors for increment components, unmultilink unnecessary
    Multilink.multilink(
      [ incrementButtonStateProperty, options.incrementEnabledProperty ],
      ( buttonState, enabled ) => {
        updateColors( buttonState, enabled, incrementBackgroundNode, incrementArrow, backgroundColors, arrowColors );
      } );

    // update colors for decrement components, unmultilink unnecessary
    Multilink.multilink(
      [ decrementButtonStateProperty, options.decrementEnabledProperty ],
      ( buttonState, enabled ) => {
        updateColors( buttonState, enabled, decrementBackgroundNode, decrementArrow, backgroundColors, arrowColors );
      } );

    this.mutate( options );

    // @private called by dispose
    this.disposeObjectPicker = () => {

      if ( valueProperty.hasListener( valueObserver ) ) {
        valueProperty.unlink( valueObserver );
      }

      if ( options.incrementEnabledProperty.hasListener( incrementEnabledListener ) ) {
        options.incrementEnabledProperty.unlink( incrementEnabledListener );
      }

      if ( options.decrementEnabledProperty.hasListener( decrementEnabledListener ) ) {
        options.decrementEnabledProperty.unlink( decrementEnabledListener );
      }
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeObjectPicker();
    super.dispose();
  }
}

/**
 * Converts FireListener events to ButtonState changes.
 */
class ObjectPickerInputListener extends FireListener {

  /**
   * @param {EnumerationDeprecatedProperty.<ButtonState>} buttonStateProperty
   * @param {Object} [options]
   */
  constructor( buttonStateProperty, options ) {
    super( options );
    Multilink.multilink(
      [ this.isOverProperty, this.isPressedProperty ],
      ( isOver, isPressed ) => {
        buttonStateProperty.set(
          isOver && !isPressed ? ButtonState.OVER :
          isOver && isPressed ? ButtonState.DOWN :
          !isOver && !isPressed ? ButtonState.UP :
          !isOver && isPressed ? ButtonState.OUT :
          assert && assert( false, 'bad state' )
        );
      } );

    // @public
    this.enabled = true;
  }
}

/**
 * Gets the index of the item that has a specified value.
 * @param {{value:Object, node:Node}} items
 * @param {Object} value
 * @returns {number}
 */
function indexOfItemWithValue( items, value ) {
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
 * @param {ColorDef} topColor
 * @param {ColorDef} centerColor
 * @param {ColorDef} bottomColor
 * @param {number} height
 * @returns {LinearGradient}
 */
function createVerticalGradient( topColor, centerColor, bottomColor, height ) {
  return new LinearGradient( 0, 0, 0, height )
    .addColorStop( 0, topColor )
    .addColorStop( 0.5, centerColor )
    .addColorStop( 1, bottomColor );
}

/**
 * Updates arrow and background colors
 * @param {ButtonState} buttonState
 * @param {boolean} enabled
 * @param {ColorDef} background
 * @param {Path} arrow
 * @param {Object} backgroundColors - see backgroundColors in constructor
 * @param {Object} arrowColors - see arrowColors in constructor
 */
function updateColors( buttonState, enabled, background, arrow, backgroundColors, arrowColors ) {
  if ( enabled ) {
    arrow.stroke = 'black';
    if ( buttonState === ButtonState.UP ) {
      background.fill = backgroundColors.up;
      arrow.fill = arrowColors.up;
    }
    else if ( buttonState === ButtonState.OVER ) {
      background.fill = backgroundColors.over;
      arrow.fill = arrowColors.over;
    }
    else if ( buttonState === ButtonState.DOWN ) {
      background.fill = backgroundColors.down;
      arrow.fill = arrowColors.down;
    }
    else if ( buttonState === ButtonState.OUT ) {
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