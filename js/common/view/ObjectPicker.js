// Copyright 2017-2020, University of Colorado Boulder

//TODO consolidate with NumberPicker when needed by another sim, see https://github.com/phetsims/scenery-phet/issues/345
/**
 * User-interface component for picking one of several values. The values are arbitry Objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import FireOnHoldInputListener from '../../../../scenery-phet/js/buttons/FireOnHoldInputListener.js';
import ButtonListener from '../../../../scenery/js/input/ButtonListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const BUTTON_STATES = [ 'up', 'down', 'over', 'out' ];

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
      upFunction: index => index + 1,
      downFunction: index => index - 1,

      // {Property.<boolean>|null} whether the up and down buttons are enabled.
      // If the client provides these, then the client is fully responsible for the state of these Properties.
      // If null, a default implementation is used.
      upEnabledProperty: null,
      downEnabledProperty: null
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

    // top half of the background, for 'up'. Shape computed starting at upper-left, going clockwise.
    const upShape = new Shape()
      .arc( backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, Math.PI, Math.PI * 3 / 2, false )
      .arc( backgroundWidth - backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, -Math.PI / 2, 0, false )
      .lineTo( backgroundWidth, ( backgroundHeight / 2 ) + backgroundOverlap )
      .lineTo( 0, ( backgroundHeight / 2 ) + backgroundOverlap )
      .close();
    const upBackground = new Path( upShape, { pickable: false } );

    // bottom half of the background, for 'down'. Shape computed starting at bottom-right, going clockwise.
    const downShape = new Shape()
      .arc( backgroundWidth - backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, 0, Math.PI / 2, false )
      .arc( backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( 0, backgroundHeight / 2 )
      .lineTo( backgroundWidth, backgroundHeight / 2 )
      .close();
    const downBackground = new Path( downShape, { pickable: false } );

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

    // up arrow
    const upArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, 0 )
      .lineTo( arrowButtonSize.width, arrowButtonSize.height )
      .lineTo( 0, arrowButtonSize.height )
      .close();
    const upArrow = new Path( upArrowShape, merge( {}, arrowOptions, {
      centerX: upBackground.centerX,
      bottom: upBackground.top - options.arrowYSpacing
    } ) );

    // down arrow
    const downArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, arrowButtonSize.height )
      .lineTo( 0, 0 )
      .lineTo( arrowButtonSize.width, 0 )
      .close();
    const downArrow = new Path( downArrowShape, merge( {}, arrowOptions, {
      centerX: downBackground.centerX,
      top: downBackground.bottom + options.arrowYSpacing
    } ) );

    // parents for 'up' and 'down' components
    const upParent = new Node( { children: [ upBackground, upArrow ] } );
    upParent.addChild( new Rectangle( upParent.localBounds ) ); // invisible overlay
    const downParent = new Node( { children: [ downBackground, downArrow ] } );
    downParent.addChild( new Rectangle( downParent.localBounds ) ); // invisible overlay

    // rendering order
    this.addChild( upParent );
    this.addChild( downParent );
    this.addChild( strokedBackground );
    this.addChild( valueParentNode );

    //------------------------------------------------------------
    // Pointer areas

    // touch area
    upParent.touchArea = Shape.rectangle(
      upParent.left - ( options.touchAreaXDilation / 2 ), upParent.top - options.touchAreaYDilation,
      upParent.width + options.touchAreaXDilation, upParent.height + options.touchAreaYDilation );
    downParent.touchArea = Shape.rectangle(
      downParent.left - ( options.touchAreaXDilation / 2 ), downParent.top,
      downParent.width + options.touchAreaXDilation, downParent.height + options.touchAreaYDilation );

    // mouse area
    upParent.mouseArea = Shape.rectangle(
      upParent.left - ( options.mouseAreaXDilation / 2 ), upParent.top - options.mouseAreaYDilation,
      upParent.width + options.mouseAreaXDilation, upParent.height + options.mouseAreaYDilation );
    downParent.mouseArea = Shape.rectangle(
      downParent.left - ( options.mouseAreaXDilation / 2 ), downParent.top,
      downParent.width + options.mouseAreaXDilation, downParent.height + options.mouseAreaYDilation );

    //------------------------------------------------------------
    // Colors

    // arrow colors
    const arrowColors = {
      up: options.arrowsColor,
      over: options.arrowsColor,
      down: options.arrowsPressedColor,
      out: options.arrowsColor,
      disabled: 'rgb( 176,176,176 )'
    };

    // background colors
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

    // state of the up and down button
    const upStateProperty = new StringProperty( 'up', { validValues: BUTTON_STATES } );
    const downStateProperty = new StringProperty( 'up', { validValues: BUTTON_STATES } );

    // enables the up button
    if ( !options.upEnabledProperty ) {
      options.upEnabledProperty = new DerivedProperty( [ indexProperty ],
        index => ( options.wrapEnabled || ( index < items.length - 1 ) )
      );
    }

    // enables the down button
    if ( !options.downEnabledProperty ) {
      options.downEnabledProperty = new DerivedProperty( [ indexProperty ],
        index => ( options.wrapEnabled || ( index > 0 ) )
      );
    }

    //------------------------------------------------------------
    // Observers and InputListeners

    // up - removeInputListener unnecessary
    upParent.addInputListener( new ButtonStateListener( upStateProperty ) );
    const upListener = new FireOnHoldInputListener( {
      listener: () => {
        let index = options.upFunction( indexProperty.value );
        if ( options.wrapEnabled && index >= items.length ) {
          index = options.upFunction( -1 );
        }
        indexProperty.value = index;
      },
      timerDelay: options.timerDelay,
      timerInterval: options.timerInterval
    } );
    upParent.addInputListener( upListener );

    // down - removeInputListener unnecessary
    downParent.addInputListener( new ButtonStateListener( downStateProperty ) );
    const downListener = new FireOnHoldInputListener( {
      listener: () => {
        let index = options.downFunction( indexProperty.value );
        if ( options.wrapEnabled && index < 0 ) {
          index = options.downFunction( items.length );
        }
        indexProperty.value = index;
      },
      timerDelay: options.timerDelay,
      timerInterval: options.timerInterval
    } );
    downParent.addInputListener( downListener );

    // enable/disable, unlink required
    const upEnabledListener = enabled => { upListener.enabled = enabled; };
    const downEnabledListener = enabled => { downListener.enabled = enabled; };
    options.upEnabledProperty.link( upEnabledListener );
    options.downEnabledProperty.link( downEnabledListener );

    // Update displayed Node and index to match the curret value
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

    // @private update colors for 'up' components, unmultilink unnecessary
    Property.multilink( [ upStateProperty, options.upEnabledProperty ],
      ( buttonState, enabled ) => {
        updateColors( buttonState, enabled, upBackground, upArrow, backgroundColors, arrowColors );
      } );

    // @private update colors for 'down' components, unmultilink unnecessary
    Property.multilink( [ downStateProperty, options.downEnabledProperty ],
      ( buttonState, enabled ) => {
        updateColors( buttonState, enabled, downBackground, downArrow, backgroundColors, arrowColors );
      } );

    this.mutate( options );

    // @private called by dispose
    this.disposeObjectPicker = () => {

      if ( valueProperty.hasListener( valueObserver ) ) {
        valueProperty.unlink( valueObserver );
      }

      if ( options.upEnabledProperty.hasListener( upEnabledListener ) ) {
        options.upEnabledProperty.unlink( upEnabledListener );
      }

      if ( options.downEnabledProperty.hasListener( downEnabledListener ) ) {
        options.downEnabledProperty.unlink( downEnabledListener );
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
 * Converts ButtonListener events to state changes.
 */
class ButtonStateListener extends ButtonListener {

  /**
   * @param {StringProperty} stateProperty - see BUTTON_STATES
   */
  constructor( stateProperty ) {
    super( {
      up: () => stateProperty.set( 'up' ),
      over: () => stateProperty.set( 'over' ),
      down: () => stateProperty.set( 'down' ),
      out: () => stateProperty.set( 'out' )
    } );
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
  assert && assert( index !== -1, 'invalid value: ' + index );
  return index;
}

// creates a vertical gradient
function createVerticalGradient( topColor, centerColor, bottomColor, height ) {
  return new LinearGradient( 0, 0, 0, height )
    .addColorStop( 0, topColor )
    .addColorStop( 0.5, centerColor )
    .addColorStop( 1, bottomColor );
}

// Update arrow and background colors
function updateColors( buttonState, enabled, background, arrow, backgroundColors, arrowColors ) {
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
      throw new Error( 'unsupported buttonState: ' + buttonState );
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