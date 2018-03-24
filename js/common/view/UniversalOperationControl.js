// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'universal operation' control (as it's referred to in the design document)
 * allows the user to apply an operation to both sides of the scale and equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermOperand = require( 'EQUALITY_EXPLORER/common/model/ConstantTermOperand' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var ObjectPicker = require( 'EQUALITY_EXPLORER/common/view/ObjectPicker' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var UniversalOperation = require( 'EQUALITY_EXPLORER/common/model/UniversalOperation' );
  var UniversalOperationAnimation = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationAnimation' );
  var UniversalOperationNode = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationNode' );
  var VariableTermOperand = require( 'EQUALITY_EXPLORER/common/model/VariableTermOperand' );

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

    //TODO if there are no valid operands for operator above/below current operand, then disable up/down button
    /*
     * Adjusts the operand to accommodate a proposed operator.
     * @param {string} operator - the proposed operator
     */
    var adjustOperandForOperator = function( operator ) {

      var currentOperand = scene.operandProperty.value;
      var adjustedOperand;

      if ( isDivideByZero( operator, currentOperand ) ) {

        // If the operator would result in division by zero, change the operand to 1.
        adjustedOperand = _.find( scene.operands, function( operand ) {
          return ( operand instanceof ConstantTermOperand ) && ( operand.constantValue.getValue() === 1 );
        } );
        assert && assert( adjustedOperand, 'expected to find constant 1' );
        scene.operandProperty.value = adjustedOperand;
      }
      else if ( ( operator === MathSymbols.TIMES || operator === MathSymbols.DIVIDE ) &&
           currentOperand instanceof VariableTermOperand ) {

        // If the operator is not supported for a variable term operand, change the operand to
        // a constant term that has the same value as the variable term's coefficient.
        // E.g. if the operand is '5x', change to '5'.
        var currentCoefficient = currentOperand.coefficient;
        adjustedOperand = _.find( scene.operands, function( operand ) {
          return ( operand instanceof ConstantTermOperand ) &&
                 ( operand.constantValue.getValue() === currentCoefficient.getValue() );
        } );
        assert && assert( adjustedOperand, 'expected to find constant ' + currentCoefficient );
        scene.operandProperty.value = adjustedOperand;
      }
    };

    // picker for choosing operator
    var operatorPicker = new ObjectPicker( scene.operatorProperty, operatorItems, {
      wrapEnabled: true, // wrap around when min/max is reached
      color: 'black',
      xMargin: 12,
      upFunction: function( index ) {
        var nextIndex = index + 1;
        adjustOperandForOperator( scene.operators[ nextIndex ] );
        return nextIndex;
      },
      downFunction: function( index ) {
        var nextIndex = index - 1;
        adjustOperandForOperator( scene.operators[ nextIndex ] );
        return nextIndex;
      }
    } );

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

    /*
     * Should a proposed operand be skipped for the current operator?
     * @param {ConstantTermOperand|VariableTermOperand} operand - the proposed operand
     * @returns {boolean}
     */
    var skipProposedOperand = function( operand ) {
      var operator = scene.operatorProperty.value;
      var skip = false;
      if ( isDivideByZero( operator, operand ) ) {
        skip = true;
      }
      else if ( ( operator === MathSymbols.TIMES || operator === MathSymbols.DIVIDE ) &&
                operand instanceof VariableTermOperand ) {
        skip = true;
      }
      return skip;
    };

    //TODO how to disable arrow buttons if skipProposedOperand is true at ends of index range?
    // picker for choosing operand
    var operandPicker = new ObjectPicker( scene.operandProperty, operandItems, {
      color: 'black',
      font: options.integerFont,
      xMargin: 6,
      upFunction: function( index ) {
        var nextIndex = index + 1;
        while ( skipProposedOperand( scene.operands[ nextIndex ] ) ) {
          if ( nextIndex === scene.operands.length - 1 ) {
            break;
          }
          else {
            nextIndex++;
          }
        }
        return nextIndex;
      },
      downFunction: function( index ) {
        var nextIndex = index - 1;
        while ( skipProposedOperand( scene.operands[ nextIndex ] ) ) {
          if ( nextIndex === 0 ) {
            break;
          }
          else {
            nextIndex--;
          }
        }
        return nextIndex;
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
      scale: 0.65 * operandPicker.height / operandPicker.height // scale relative to the pickers
    } );
    var goButton = new RoundPushButton( {
      listener: goButtonListener,
      content: goButtonIcon,
      baseColor: 'white',
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
   * @param {string} operator
   * @param {ConstantTermOperand|VariableTermOperand} operand
   * @returns {boolean}
   */
  function isDivideByZero( operator, operand ) {
    return operator === MathSymbols.DIVIDE &&
           ( operand instanceof ConstantTermOperand && operand.constantValue.getValue() === 0 );
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
