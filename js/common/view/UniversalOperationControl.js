// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'universal operation' control (as it's referred to in the design document)
 * allows the user to apply an operation to both sides of the scale and equation.
 *
 * Since some combinations of operator and operand are not supported (specifically division by zero, and
 * multiplication or division by variable terms) the UX for this control is complex, and potentially confusing.
 *
 * For historical discussion and specifications, see:
 * https://github.com/phetsims/equality-explorer/issues/45
 * https://github.com/phetsims/equality-explorer/issues/77
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsScene from '../../operations/model/OperationsScene.js';
import ConstantTerm from '../model/ConstantTerm.js';
import UniversalOperation from '../model/UniversalOperation.js';
import VariableTerm from '../model/VariableTerm.js';
import ObjectPicker from './ObjectPicker.js';
import TranslateThenFade from './TranslateThenFade.js';
import UniversalOperationNode from './UniversalOperationNode.js';

// constants
const PICKER_OPTIONS = {
  arrowsColor: 'black',
  gradientColor: 'rgb( 150, 150, 150 )'
};

/**
 * @param {OperationsScene} scene
 * @param {Node} animationLayer
 * @param {Object} [options]
 * @constructor
 */
function UniversalOperationControl( scene, animationLayer, options ) {

  assert && assert( scene instanceof OperationsScene, 'invalid scene: ' + scene );

  const self = this;

  options = merge( {
    timesZeroEnabled: true, // whether to include 'times 0' as one of the operations

    // HBox options
    spacing: 15
  }, options );

  // @private
  this.timesZeroEnabled = options.timesZeroEnabled;

  // items for the operator control
  const operatorItems = [];
  for ( let i = 0; i < scene.operators.length; i++ ) {
    const operator = scene.operators[ i ];
    operatorItems.push( {
      value: operator,
      node: UniversalOperationNode.createOperatorNode( operator )
    } );
  }

  // radio buttons for selecting the operator
  const operatorControl = new RadioButtonGroup( scene.operatorProperty, operatorItems, {
    orientation: 'horizontal',
    spacing: 2,
    selectedLineWidth: 2,
    buttonContentXMargin: 8,
    buttonContentYMargin: 3,
    baseColor: 'white',
    touchAreaXDilation: 0,
    touchAreaYDilation: 15
  } );

  /*
   * Adjusts the operand if it's not appropriate for a specified operator.
   * @param {string} operator - see EqualityExplorerConstants.OPERATORS
   */
  const operatorListener = function( operator ) {

    const currentOperand = scene.operandProperty.value;
    let adjustedOperand;

    if ( isDivideByZero( operator, currentOperand ) ||
         ( !options.timesZeroEnabled && isTimesZero( operator, currentOperand ) ) ) {

      // If the operator would result in division or multiplication by zero, change the operand to 1.
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
      const currentCoefficient = currentOperand.coefficient;
      adjustedOperand = _.find( scene.operands, function( operand ) {
        return ( operand instanceof ConstantTerm ) && ( operand.constantValue.equals( currentCoefficient ) );
      } );
      assert && assert( adjustedOperand, 'expected to find constant ' + currentCoefficient );
      scene.operandProperty.value = adjustedOperand;
    }
  };

  scene.operatorProperty.lazyLink( operatorListener ); // unlink not needed

  // items for the operand picker
  const operandItems = [];
  for ( let i = 0; i < scene.operands.length; i++ ) {
    const operand = scene.operands[ i ];
    operandItems.push( {
      value: operand,
      node: UniversalOperationNode.createOperandNode( operand )
    } );
  }

  // Take control of enabling up/down arrows for operand picker
  const upEnabledProperty = new BooleanProperty( true );
  const downEnabledProperty = new BooleanProperty( true );

  // picker for choosing operand
  const operandPicker = new ObjectPicker( scene.operandProperty, operandItems, merge( {}, PICKER_OPTIONS, {
    xMargin: 6,
    touchAreaXDilation: 0,
    touchAreaYDilation: 15,

    // Providing these Properties means that we're responsible for up/down enabled state
    upEnabledProperty: upEnabledProperty,
    downEnabledProperty: downEnabledProperty,

    // When the up button is pressed, skip operands that are inappropriate for the operation
    upFunction: function( index ) {
      let nextOperandIndex = index + 1;
      const operator = scene.operatorProperty.value;
      while ( !self.isSupportedOperation( operator, scene.operands[ nextOperandIndex ] ) ) {
        nextOperandIndex++;
        assert && assert( nextOperandIndex < scene.operands.length,
          'nextOperandIndex out of range: ' + nextOperandIndex );
      }
      return nextOperandIndex;
    },

    // When the down button is pressed, skip operands that are inappropriate for the operation
    downFunction: function( index ) {
      let nextOperandIndex = index - 1;
      const operator = scene.operatorProperty.value;
      while ( !self.isSupportedOperation( operator, scene.operands[ nextOperandIndex ] ) ) {
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

      const operandIndex = scene.operands.indexOf( operand );
      assert && assert( operandIndex !== -1, 'operand not found: ' + operand );

      if ( ( operator === MathSymbols.TIMES || operator === MathSymbols.DIVIDE ) ) {
        assert && assert( operand instanceof ConstantTerm, 'unexpected operand type: ' + operand );

        // up arrow is enabled if there are any constant term operands above the current selection
        let upEnabled = false;
        for ( let i = operandIndex + 1; i < scene.operands.length && !upEnabled; i++ ) {
          upEnabled = ( scene.operands[ i ] instanceof ConstantTerm );
        }
        upEnabledProperty.value = upEnabled;

        // down arrow is enabled if there are any constant term operands below the current selection
        let downEnabled = false;
        for ( let i = operandIndex - 1; i >= 0 && !downEnabled; i-- ) {
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

  // Clean up when an animation completes or is stopped.
  const animationCleanup = function( animation, operationNode ) {
    self.animations.splice( self.animations.indexOf( animation ), 1 );
    !operationNode.isDisposed && operationNode.dispose();
    goButton.enabled = true;
  };

  // When the 'go' button is pressed, animate operations, then apply operations to terms.
  const goButtonListener = function() {

    // Go button is disabled until the animation completes, so that students don't press the button rapid-fire.
    // See https://github.com/phetsims/equality-explorer/issues/48
    goButton.enabled = false;

    const operation = new UniversalOperation( scene.operatorProperty.value, scene.operandProperty.value );
    phet.log && phet.log( 'Go ' + operation.toLogString() );

    // operation on left side
    const leftOperationNode = new UniversalOperationNode( operation, {
      centerX: scene.scale.leftPlate.positionProperty.value.x,
      centerY: self.centerY
    } );
    animationLayer.addChild( leftOperationNode );

    // operation on right side
    const rightOperationNode = new UniversalOperationNode( operation, {
      centerX: scene.scale.rightPlate.positionProperty.value.x,
      centerY: self.centerY
    } );
    animationLayer.addChild( rightOperationNode );

    // Apply the operation when both animations have completed.
    const numberOfAnimationsCompletedProperty = new NumberProperty( 0 );
    numberOfAnimationsCompletedProperty.lazyLink( function( numberOfAnimationsCompleted ) {
      if ( numberOfAnimationsCompleted === 2 ) {
        scene.applyOperation( operation );
      }
    } );

    // animation on left side of the scale
    const leftAnimation = new TranslateThenFade( leftOperationNode, {
      destination: new Vector2( leftOperationNode.x, scene.scale.leftPlate.getGridTop() - leftOperationNode.height ),
      onComplete: function() {
        numberOfAnimationsCompletedProperty.value++;
        animationCleanup( leftAnimation, leftOperationNode );
      },
      onStop: function() {
        animationCleanup( leftAnimation, leftOperationNode );
      }
    } );
    self.animations.push( leftAnimation );

    // animation on right side of the scale
    const rightAnimation = new TranslateThenFade( rightOperationNode, {
      destination: new Vector2( rightOperationNode.x, scene.scale.rightPlate.getGridTop() - rightOperationNode.height ),
      onComplete: function() {
        numberOfAnimationsCompletedProperty.value++;
        animationCleanup( rightAnimation, rightOperationNode );
      },
      onStop: function() {
        animationCleanup( rightAnimation, rightOperationNode );
      }
    } );
    self.animations.push( rightAnimation );

    // start the animations
    leftAnimation.start();
    rightAnimation.start();
  };

  // 'go' button, applies the operation
  const goButtonIcon = new FontAwesomeNode( 'level_down', {
    scale: 0.75 * operandPicker.height / operandPicker.height // scale relative to the pickers
  } );
  const goButton = new RoundPushButton( {
    listener: goButtonListener,
    content: goButtonIcon,
    baseColor: PhetColorScheme.BUTTON_YELLOW,
    minXMargin: 10,
    minYMargin: 10,
    touchAreaDilation: 5
  } );

  assert && assert( !options.children, 'UniversalOperationControl sets children' );
  options.children = [ operatorControl, operandPicker, goButton ];

  HBox.call( this, options );

  // If the maxInteger limit is exceeded, stop all universal operations that are in progress
  const maxIntegerExceededListener = function() {
    self.stopAnimations();
  };
  scene.allTermCreators.forEach( function( termCreator ) {
    termCreator.maxIntegerExceededEmitter.addListener( maxIntegerExceededListener ); // removeListener not needed
  } );
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
 * Does this operation result in multiplication by zero?
 * @param {string} operator - see EqualityExplorerConstants.OPERATORS
 * @param {Term} operand
 * @returns {boolean}
 */
function isTimesZero( operator, operand ) {
  return operator === MathSymbols.TIMES &&
         ( operand instanceof ConstantTerm && operand.constantValue.getValue() === 0 );
}

/**
 * Is the operation an attempt to do something that is unsupported with a variable term operand?
 * Times and divide are unsupported for variable term operands.
 * @param {string} operator - see EqualityExplorerConstants.OPERATORS
 * @param {Term} operand
 * @returns {boolean}
 */
function isUnsupportedVariableTermOperation( operator, operand ) {
  return ( operator === MathSymbols.TIMES || operator === MathSymbols.DIVIDE ) &&
         operand instanceof VariableTerm;
}

export default inherit( HBox, UniversalOperationControl, {

  /**
   * Steps the animations.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step: function( dt ) {
    const animationsCopy = this.animations; // operate on a copy because step may modify the array
    animationsCopy.forEach( function( animation ) {
      animation.step( dt );
    } );
  },

  // @public
  reset: function() {

    // Stop all animations.
    this.stopAnimations();
  },

  /**
   * Stops all animations that are in progress.
   * @public
   */
  stopAnimations: function() {

    // Operate on a copy of the array, since animations remove themselves from the array when stopped.
    const arrayCopy = this.animations.slice( 0 );
    for ( let i = 0; i < arrayCopy.length; i++ ) {
      arrayCopy[ i ].stop();
    }
  },

  /**
   * Are the specified operator and operand a supported combination?
   * @param {string} operator - see EqualityExplorerConstants.OPERATORS
   * @param {Term} operand - the proposed operand
   * @returns {boolean}
   * @private
   */
  isSupportedOperation: function( operator, operand ) {
    return !isDivideByZero( operator, operand ) &&
           ( this.timesZeroEnabled || !isTimesZero( operator, operand ) ) &&
           !isUnsupportedVariableTermOperation( operator, operand );
  }
} );