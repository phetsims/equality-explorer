// Copyright 2017-2018, University of Colorado Boulder

//TODO migrate to common code, see https://github.com/phetsims/scenery-phet/issues/345
/**
 * User-interface component for picking one of several values
 * This is essentially a value with integrated up/down spinners.
 * But PhET has been calling it a 'picker', so that's what this type is named.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FireOnHoldInputListener = require( 'SCENERY_PHET/buttons/FireOnHoldInputListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringProperty = require( 'AXON/StringProperty' );

  // constants
  var BUTTON_STATES = [ 'up', 'down', 'over', 'out' ];

  /**
   * @param {Property.<Object>} valueProperty - value of the current item that is displayed
   * @param {{value:Object, node:Node}[]} items - the set of items that you can select from
   * @param {Object} [options]
   * @constructor
   */
  function ObjectPicker( valueProperty, items, options ) {

    options = _.extend( {
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
      upFunction: function( index ) { return index + 1; },
      downFunction: function( index ) { return index - 1; },

      // {Property.<boolean>||null} whether the up and down buttons are enabled.
      // If the client provides these, then the client is fully responsible for the state of these Properties.
      // If null, a default implementation is used.
      upEnabledProperty: null,
      downEnabledProperty: null
    }, options );

    options.arrowsPressedColor = options.arrowsPressedColor || Color.toColor( options.arrowsColor ).darkerColor();
    options.gradientColor = options.gradientColor || options.arrowsColor;
    options.gradientPressedColor = options.gradientPressedColor || Color.toColor( options.gradientColor ).darkerColor();

    Node.call( this );

    //------------------------------------------------------------
    // Nodes

    // maximum dimensions of item Nodes
    var maxWidth = _.maxBy( items, function( item ) {
      return item.node.width;
    } ).node.width;
    var maxHeight = _.maxBy( items, function( item ) {
      return item.node.height;
    } ).node.height;

    // compute shape of the background behind the value
    var backgroundWidth = maxWidth + ( 2 * options.xMargin );
    var backgroundHeight = maxHeight + ( 2 * options.yMargin );
    var backgroundOverlap = 1;
    var backgroundCornerRadius = options.cornerRadius;

    // parent for value, to maintain rendering order and simplify centering
    var valueParentNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, {
      pickable: false
    } );

    // top half of the background, for 'up'. Shape computed starting at upper-left, going clockwise.
    var upShape = new Shape()
      .arc( backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, Math.PI, Math.PI * 3 / 2, false )
      .arc( backgroundWidth - backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, -Math.PI / 2, 0, false )
      .lineTo( backgroundWidth, ( backgroundHeight / 2 ) + backgroundOverlap )
      .lineTo( 0, ( backgroundHeight / 2 ) + backgroundOverlap )
      .close();
    var upBackground = new Path( upShape, { pickable: false } );

    // bottom half of the background, for 'down'. Shape computed starting at bottom-right, going clockwise.
    var downShape = new Shape()
      .arc( backgroundWidth - backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, 0, Math.PI / 2, false )
      .arc( backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( 0, backgroundHeight / 2 )
      .lineTo( backgroundWidth, backgroundHeight / 2 )
      .close();
    var downBackground = new Path( downShape, { pickable: false } );

    // separate rectangle for stroke around value background
    var strokedBackground = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, backgroundCornerRadius, backgroundCornerRadius, {
      pickable: false,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } );

    // compute size of arrows
    var arrowButtonSize = new Dimension2( 0.5 * backgroundWidth, options.arrowHeight );

    // options shared by both arrows
    var arrowOptions = {
      stroke: options.arrowStroke,
      lineWidth: options.arrowLineWidth,
      pickable: false
    };

    // up arrow
    var upArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, 0 )
      .lineTo( arrowButtonSize.width, arrowButtonSize.height )
      .lineTo( 0, arrowButtonSize.height )
      .close();
    var upArrow = new Path( upArrowShape, _.extend( {}, arrowOptions, {
      centerX: upBackground.centerX,
      bottom: upBackground.top - options.arrowYSpacing
    } ) );

    // down arrow
    var downArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, arrowButtonSize.height )
      .lineTo( 0, 0 )
      .lineTo( arrowButtonSize.width, 0 )
      .close();
    var downArrow = new Path( downArrowShape, _.extend( {}, arrowOptions, {
      centerX: downBackground.centerX,
      top: downBackground.bottom + options.arrowYSpacing
    } ) );

    // parents for 'up' and 'down' components
    var upParent = new Node( { children: [ upBackground, upArrow ] } );
    upParent.addChild( new Rectangle( upParent.localBounds ) ); // invisible overlay
    var downParent = new Node( { children: [ downBackground, downArrow ] } );
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
    var arrowColors = {
      up: options.arrowsColor,
      over: options.arrowsColor,
      down: options.arrowsPressedColor,
      out: options.arrowsColor,
      disabled: 'rgb( 176,176,176 )'
    };

    // background colors
    var highlightGradient = createVerticalGradient( options.gradientColor, options.backgroundColor, options.gradientColor, backgroundHeight );
    var pressedGradient = createVerticalGradient( options.gradientPressedColor, options.backgroundColor, options.gradientPressedColor, backgroundHeight );
    var backgroundColors = {
      up: options.backgroundColor,
      over: highlightGradient,
      down: pressedGradient,
      out: pressedGradient,
      disabled: options.backgroundColor
    };

    //------------------------------------------------------------
    // Properties

    // index of the item that's currently selected
    var indexProperty = new NumberProperty( indexOfItemWithValue( items, valueProperty.value ), {
      numberType: 'Integer',
      range: new Range( 0, items.length - 1 )
    } );

    // state of the up and down button
    var upStateProperty = new StringProperty( 'up', { validValues: BUTTON_STATES } );
    var downStateProperty = new StringProperty( 'up', { validValues: BUTTON_STATES } );

    // enables the up button
    if ( !options.upEnabledProperty ) {
      options.upEnabledProperty = new DerivedProperty( [ indexProperty ],
        function( index ) {
          return options.wrapEnabled || ( index < items.length - 1 );
        } );
    }

    // enables the down button
    if ( !options.downEnabledProperty ) {
      options.downEnabledProperty = new DerivedProperty( [ indexProperty ],
        function( index ) {
          return options.wrapEnabled || ( index > 0 );
        } );
    }

    //------------------------------------------------------------
    // Observers and InputListeners

    // up - removeInputListener unnecessary
    upParent.addInputListener( new ButtonStateListener( upStateProperty ) );
    var upListener = new FireOnHoldInputListener( {
      listener: function() {
        var index = options.upFunction( indexProperty.value );
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
    var downListener = new FireOnHoldInputListener( {
      listener: function() {
        var index = options.downFunction( indexProperty.value );
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
    var upEnabledListener = function( enabled ) { upListener.enabled = enabled; };
    var downEnabledListener = function( enabled ) { downListener.enabled = enabled; };
    options.upEnabledProperty.link( upEnabledListener );
    options.downEnabledProperty.link( downEnabledListener );

    // Update displayed Node and index to match the curret value
    var valueObserver = function( value ) {

      valueParentNode.removeAllChildren();

      // show the node associated with the value
      var index = indexOfItemWithValue( items, value );
      var valueNode = items[ index ].node;
      valueParentNode.addChild( valueNode );
      valueNode.centerX = backgroundWidth / 2;
      valueNode.centerY = backgroundHeight / 2;

      // synchronize the index
      indexProperty.value = index;
    };
    valueProperty.link( valueObserver ); // unlink required in dispose

    // unlink not required
    indexProperty.link( function( index ) {
      valueProperty.value = items[ index ].value;
    } );

    // @private update colors for 'up' components, unmultilink unnecessary
    Property.multilink( [ upStateProperty, options.upEnabledProperty ], function( buttonState, enabled ) {
      updateColors( buttonState, enabled, upBackground, upArrow, backgroundColors, arrowColors );
    } );

    // @private update colors for 'down' components, unmultilink unnecessary
    Property.multilink( [ downStateProperty, options.downEnabledProperty ], function( buttonState, enabled ) {
      updateColors( buttonState, enabled, downBackground, downArrow, backgroundColors, arrowColors );
    } );

    this.mutate( options );

    // @private called by dispose
    this.disposeObjectPicker = function() {

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

  equalityExplorer.register( 'ObjectPicker', ObjectPicker );

  inherit( Node, ObjectPicker, {

    // @public
    dispose: function() {
      this.disposeObjectPicker();
      Node.prototype.dispose.call( this );
    }
  } );

  /**
   * Converts ButtonListener events to state changes.
   *
   * @param {StringProperty} stateProperty - see BUTTON_STATES
   * @constructor
   */
  function ButtonStateListener( stateProperty ) {
    ButtonListener.call( this, {
      up: function() { stateProperty.set( 'up' ); },
      over: function() { stateProperty.set( 'over' ); },
      down: function() { stateProperty.set( 'down' ); },
      out: function() { stateProperty.set( 'out' ); }
    } );
  }

  equalityExplorer.register( 'ObjectPicker.ButtonStateListener', ButtonStateListener );

  inherit( ButtonListener, ButtonStateListener );

  /**
   * Gets the index of the item that has a specified value.
   * @param {{value:Object, node:Node}} items
   * @param {Object} value
   * @return {number}
   */
  var indexOfItemWithValue = function( items, value ) {
    var index = -1;
    for ( var i = 0; i < items.length; i++ ) {
      if ( items[ i ].value === value ) {
        index = i;
        break;
      }
    }
    assert && assert( index !== -1, 'invalid value: ' + index );
    return index;
  };

  // creates a vertical gradient
  var createVerticalGradient = function( topColor, centerColor, bottomColor, height ) {
    return new LinearGradient( 0, 0, 0, height )
      .addColorStop( 0, topColor )
      .addColorStop( 0.5, centerColor )
      .addColorStop( 1, bottomColor );
  };

  // Update arrow and background colors
  var updateColors = function( buttonState, enabled, background, arrow, backgroundColors, arrowColors ) {
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
  };

  return ObjectPicker;
} );
