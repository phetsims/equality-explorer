// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'universal operation' control (as it's referred to in the design document)
 * allows the user to apply an operation to both sides of the scale and equation.
 *
 * Since some combinations of operator and operand are not supported (specifically division by zero, and
 * multiplication or division by variable terms) the UX for this control is complex, and potentially confusing.
 * For historical discussion and specifications, see https://github.com/phetsims/equality-explorer/issues/45.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var ObjectPicker = require( 'EQUALITY_EXPLORER/common/view/ObjectPicker' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Property = require( 'AXON/Property' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var UniversalOperation = require( 'EQUALITY_EXPLORER/common/model/UniversalOperation' );
  var UniversalOperationAnimation = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationAnimation' );
  var UniversalOperationNode = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationNode' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );

  /**
   * @param {OperationsScene} scene
   * @param {Node} animationLayer
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationControl( scene, animationLayer, options ) {

    assert && assert( scene instanceof OperationsScene, 'invalid scene: ' + scene );

    var self = this;

    options = _.extend( {
      symbolFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_SYMBOL_FONT,
      integerFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT,
      fractionFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_FRACTION_FONT,

      // supertype options
      spacing: 15
    }, options );

    // items for the operator picker
    var operatorItems = [];
    for ( var i = 0; i < scene.operators.length; i++ ) {
      var operator = scene.operators[ i ];
      operatorItems.push( {
        value: operator,
        node: UniversalOperationNode.createOperatorNode( operator, {
          font: options.integerFont
        } )
      } );
    }

    /*
     * Adjusts the operand if it's not appropriate for a specified operator.
     * @param {string} operator - see EqualityExplorerConstants.OPERATORS
     */
    var adjustOperandForOperator = function( operator ) {

      var currentOperand = scene.operandProperty.value;
      var adjustedOperand;

      if ( isDivideByZero( operator, currentOperand ) ) {

        // If the operator would result in division by zero, change the operand to 1.
        adjustedOperand = _.find( scene.operands, function( operand ) {
          return ( operand instanceof ConstantTerm ) && ( operand.constantValue.getValue() === 1 );
        } );
        assert && assert( adjustedOperand, 'expected to find constant 1' );
        scene.operandProperty.value = adjustedOperand;
      }
      else if ( isUnsupportedVariableTermOperation( operator, currentOperand ) ) {

        // If the operator is not supported for a variable term operand, change the operand to
        // a constant term that has the same value as the variable term's coefficient.
        // E.g. if the operand is '5x', change the operand to '5'.
        var currentCoefficient = currentOperand.coefficient;
        adjustedOperand = _.find( scene.operands, function( operand ) {
          return ( operand instanceof ConstantTerm ) &&
                 ( operand.constantValue.getValue() === currentCoefficient.getValue() );
        } );
        assert && assert( adjustedOperand, 'expected to find constant ' + currentCoefficient );
        scene.operandProperty.value = adjustedOperand;
      }
    };

    // options common to both pickers
    var pickerOptions = {
      arrowsColor: 'black',
      gradientColor: 'rgb( 150, 150, 150 )',
      font: options.integerFont
    };

    // picker for choosing operator
    var operatorPicker = new ObjectPicker( scene.operatorProperty, operatorItems, _.extend( {}, pickerOptions, {
      wrapEnabled: true, // wrap around when min/max is reached
      xMargin: 18,

      // When the up button is pressed, change the operand if it's inappropriate for the operator
      upFunction: function( index ) {
        var nextIndex = index + 1;
        adjustOperandForOperator( scene.operators[ nextIndex ] );
        return nextIndex;
      },

      // When the down button is pressed, change the operand if it's inappropriate for the operator
      downFunction: function( index ) {
        var nextIndex = index - 1;
        adjustOperandForOperator( scene.operators[ nextIndex ] );
        return nextIndex;
      }
    } ) );

    // items for the operand picker
    var operandItems = [];
    for ( i = 0; i < scene.operands.length; i++ ) {
      var operand = scene.operands[ i ];
      operandItems.push( {
        value: operand,
        node: UniversalOperationNode.createOperandNode( operand, {
          symbolFont: options.symbolFont,
          integerFont: options.integerFont,
          fractionFont: options.fractionFont
        } )
      } );
    }

    // Take control of enabling up/down arrows for operand picker
    var upEnabledProperty = new BooleanProperty( true );
    var downEnabledProperty = new BooleanProperty( true );

    // picker for choosing operand
    var operandPicker = new ObjectPicker( scene.operandProperty, operandItems, _.extend( {}, pickerOptions, {
      xMargin: 6,

      // Providing these Properties means that we're responsible for up/down enabled state
      upEnabledProperty: upEnabledProperty,
      downEnabledProperty: downEnabledProperty,

      // When the up button is pressed, skip operands that are inappropriate for the operation
      upFunction: function( index ) {
        var nextOperandIndex = index + 1;
        var operator = scene.operatorProperty.value;
        while ( !isSupportedOperation( operator, scene.operands[ nextOperandIndex ] ) ) {
          nextOperandIndex++;
          assert && assert( nextOperandIndex < scene.operands.length, 'nextOperandIndex out of range: ' + nextOperandIndex );
        }
        return nextOperandIndex;
      },

      // When the down button is pressed, skip operands that are inappropriate for the operation
      downFunction: function( index ) {
        var nextOperandIndex = index - 1;
        var operator = scene.operatorProperty.value;
        while ( !isSupportedOperation( operator, scene.operands[ nextOperandIndex ] ) ) {
          nextOperandIndex--;
          assert && assert( nextOperandIndex >= 0, 'nextOperandIndex out of range: ' + nextOperandIndex );
        }
        return nextOperandIndex;
      }
    } ) );

    // Adjust the enabled state of the operand picker's up/down arrows.
    // dispose not needed
    Property.multilink( [ scene.operatorProperty, scene.operandProperty ],

      /**
       * @param {string} operator - see EqualityExplorerConstants.OPERATORS
       * @param {Term} operand
       */
      function( operator, operand ) {

        var operandIndex = scene.operands.indexOf( operand );
        assert && assert( operandIndex !== -1, 'operand not found: ' + operand );

        if ( ( operator === MathSymbols.TIMES || operator === MathSymbols.DIVIDE ) ) {
          assert && assert( operand instanceof ConstantTerm, 'unexpected operand type: ' + operand );

          // up arrow is enabled if there are any constant term operands about the current selection
          var upEnabled = false;
          for ( var i = operandIndex + 1; i < scene.operands.length && !upEnabled; i++ ) {
            upEnabled = ( scene.operands[ i ] instanceof ConstantTerm );
          }
          upEnabledProperty.value = upEnabled;

          // down arrow is enabled if there are any constant term operands below the current selection
          var downEnabled = false;
          for ( i = operandIndex - 1; i >= 0 && !downEnabled; i-- ) {
            downEnabled = ( scene.operands[ i ] instanceof ConstantTerm );
          }
          downEnabledProperty.value = downEnabled;
        }
        else {

          // other operators are supported for all operands
          upEnabledProperty.value = ( operandIndex < operandItems.length - 1 );
          downEnabledProperty.value = ( operandIndex > 0 );
        }
      } );

    // @private Tween animations that are running
    this.animations = [];

    // When the 'go' button is pressed, animate operations, then apply operations to terms.
    var goButtonListener = function() {

      // Go button is disabled until the animation completes, so that students don't press the button in rapid-fire.
      // See https://github.com/phetsims/equality-explorer/issues/48#issuecomment-375807008
      goButton.enabled = EqualityExplorerQueryParameters.goButtonEnabled;

      var operation = new UniversalOperation( scene.operatorProperty.value, scene.operandProperty.value );

      // start vertically aligned with the operator picker
      var startY = animationLayer.globalToLocalBounds( operatorPicker.parentToGlobalBounds( operatorPicker.bounds ) ).centerY;

      var animation = new UniversalOperationAnimation( operation, {
        symbolFont: options.symbolFont,
        integerFont: options.integerFont,
        fractionFont: options.fractionFont,
        leftX: scene.scale.leftPlate.locationProperty.value.x,
        rightX: scene.scale.rightPlate.locationProperty.value.x,
        startY: startY,
        onComplete: function() {
          scene.applyOperation( operation );
          self.animations.splice( self.animations.indexOf( animation ), 1 );
          goButton.enabled = true;
        },
        onStop: function() {
          self.animations.splice( self.animations.indexOf( animation ), 1 );
          goButton.enabled = true;
        }
      } );
      self.animations.push( animation );

      // start the animation
      animationLayer.addChild( animation );
      animation.start();
    };

    // 'go' button, applies the operation
    var goButtonIcon = new FontAwesomeNode( 'level_down', {
      scale: 0.75 * operandPicker.height / operandPicker.height // scale relative to the pickers
    } );
    var goButton = new RoundPushButton( {
      listener: goButtonListener,
      content: goButtonIcon,
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      minXMargin: 10,
      minYMargin: 10
    } );

    assert && assert( !options.children, 'UniversalOperationControl sets children' );
    options.children = [ operatorPicker, operandPicker, goButton ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'UniversalOperationControl', UniversalOperationControl );

  /**
   * Does this operation result in division by zero?
   * @param {string} operator - see EqualityExplorerConstants.OPERATORS
   * @param {Term} operand
   * @returns {boolean}
   */
  function isDivideByZero( operator, operand ) {
    return operator === MathSymbols.DIVIDE &&
           ( operand instanceof ConstantTerm && operand.constantValue.getValue() === 0 );
  }

  /**
   * Is the operation invalid an attempt to do something unsupported with a variable term operand?
   * Times and divide are unsupported for variable terms operands.
   * @param {string} operator - see EqualityExplorerConstants.OPERATORS
   * @param {Term} operand
   * @returns {boolean}
   */
  function isUnsupportedVariableTermOperation( operator, operand ) {
    return ( operator === MathSymbols.TIMES || operator === MathSymbols.DIVIDE ) &&
               operand instanceof VariableTerm;
  }

  /**
   * Are the specified operator and operand a supported combination?
   * @param {string} operator - see EqualityExplorerConstants.OPERATORS
   * @param {Term} operand - the proposed operand
   * @returns {boolean}
   */
  function isSupportedOperation( operator, operand ) {
    return !isDivideByZero( operator, operand ) && !isUnsupportedVariableTermOperation( operator, operand );
  }

  return inherit( HBox, UniversalOperationControl, {

    // @public
    reset: function() {

      // Stop all animations.
      // Operate on a copy of the array, since animations remove themselves from the array when stopped.
      var arrayCopy = this.animations.slice( 0 );
      for ( var i = 0; i < arrayCopy.length; i++ ) {
        arrayCopy[ i ].stop();
      }
    }
  } );
} );
