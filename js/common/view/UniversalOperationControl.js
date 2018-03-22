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

    /*
     * If the next operator would result in divide by zero, change the operand to 1.
     * @param {number} index - index into operators array
     */
    var updateDivideByZero = function( nextIndex ) {

      var nextOperator = scene.operators[ nextIndex ];
      var currentOperand = scene.operandProperty.value;

      if ( nextOperator === MathSymbols.DIVIDE &&
           ( currentOperand instanceof ConstantTermOperand && currentOperand.constantValue.getValue() === 0 ) ) {
        var operand = _.find( scene.operands, function( operand ) {
          return ( operand instanceof ConstantTermOperand ) && ( operand.constantValue.getValue() === 1 );
        } );
        assert && assert( operand, 'expected to find constant 1' );
        scene.operandProperty.value = operand;
      }
    };

    /**
     * If the next operator would be invalid for a variable term, change the operand to
     * a constant that has the same value as the variable term's coefficient.
     * E.g. if the variable term is '5x', change to constant term '5'.
     * @param nextIndex
     */
    var updateInvalidVariableTerm = function( nextIndex ) {

      var nextOperator = scene.operators[ nextIndex ];
      var currentOperand = scene.operandProperty.value;
      
      if ( ( nextOperator === MathSymbols.TIMES || nextOperator === MathSymbols.DIVIDE ) &&
           currentOperand instanceof VariableTermOperand ) {
        var currentCoefficient = currentOperand.coefficient;
        var operand = _.find( scene.operands, function( operand ) {
          return ( operand instanceof ConstantTermOperand ) &&
                 ( operand.constantValue.getValue() === currentCoefficient.getValue() );
        } );
        assert && assert( operand, 'expected to find constant ' + currentCoefficient );
        scene.operandProperty.value = operand;
      }
    };

    //TODO operator picker: change 0 operand to 1 when operator becomes DIVIDE
    //TODO operator picker: change Nx operand to N when operator becomes TIMES or DIVIDE
    // picker for choosing operator
    var operatorPicker = new ObjectPicker( scene.operatorProperty, operatorItems, {
      wrapEnabled: true, // wrap around when min/max is reached
      color: 'black',
      xMargin: 12,
      upFunction: function( index ) {
        var nextIndex = index + 1;
        updateDivideByZero( nextIndex );
        updateInvalidVariableTerm( nextIndex );
        return nextIndex;
      },
      downFunction: function( index ) {
        var nextIndex = index - 1;
        updateDivideByZero( nextIndex );
        updateInvalidVariableTerm( nextIndex );
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

    //TODO operand picker: skip 0 operand when operator is DIVIDE
    //TODO operand picker: skip variable operands when operator is TIMES or DIVIDE
    // picker for choosing operand
    var operandPicker = new ObjectPicker( scene.operandProperty, operandItems, {
      color: 'black',
      font: options.integerFont,
      xMargin: 6
    } );

    // @private Tween animations that are running
    this.animations = [];

    // When the 'go' button is pressed, animate operations, then apply operations to terms.
    var goButtonListener = function() {

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
        },
        onStop: function() {
          self.animations.splice( self.animations.indexOf( animation ), 1 );
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
