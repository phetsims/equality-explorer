// Copyright 2017-2022, University of Colorado Boulder

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
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { HBox, Path } from '../../../../scenery/js/imports.js';
import levelDownAltSolidShape from '../../../../sherpa/js/fontawesome-5/levelDownAltSolidShape.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsScene from '../../operations/model/OperationsScene.js';
import ConstantTerm from '../model/ConstantTerm.js';
import UniversalOperation from '../model/UniversalOperation.js';
import VariableTerm from '../model/VariableTerm.js';
import ObjectPicker from './ObjectPicker.js';
import TranslateThenFade from './TranslateThenFade.js';
import UniversalOperationNode from './UniversalOperationNode.js';

export default class UniversalOperationControl extends HBox {

  /**
   * @param {OperationsScene} scene
   * @param {scenery.Node} animationLayer
   * @param {Object} [options]
   */
  constructor( scene, animationLayer, options ) {

    assert && assert( scene instanceof OperationsScene, `invalid scene: ${scene}` );

    options = merge( {
      timesZeroEnabled: true, // whether to include 'times 0' as one of the operations

      // HBox options
      spacing: 15
    }, options );

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
    const operatorRadioButtonGroup = new RectangularRadioButtonGroup( scene.operatorProperty, operatorItems, {
      orientation: 'horizontal',
      spacing: 2,
      touchAreaXDilation: 0,
      touchAreaYDilation: 15,
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 8,
        yMargin: 3,
        buttonAppearanceStrategyOptions: {
          selectedLineWidth: 2
        }
      }
    } );

    /*
     * Adjusts the operand if it's not appropriate for a specified operator.
     * @param {string} operator - see EqualityExplorerConstants.OPERATORS
     */
    const operatorListener = operator => {

      const currentOperand = scene.operandProperty.value;
      let adjustedOperand;

      if ( isDivideByZero( operator, currentOperand ) ||
           ( !options.timesZeroEnabled && isTimesZero( operator, currentOperand ) ) ) {

        // If the operator would result in division or multiplication by zero, change the operand to 1.
        adjustedOperand = _.find( scene.operands,
          operand => ( operand instanceof ConstantTerm ) && ( operand.constantValue.getValue() === 1 ) );
        assert && assert( adjustedOperand, 'expected to find constant 1' );
        scene.operandProperty.value = adjustedOperand;
      }
      else if ( isUnsupportedVariableTermOperation( operator, currentOperand ) ) {

        // If the operator is not supported for a variable term operand, change the operand to
        // a constant term that has the same value as the variable term's coefficient.
        // E.g. if the operand is '5x', change the operand to '5'.
        const currentCoefficient = currentOperand.coefficient;
        adjustedOperand = _.find( scene.operands,
          operand => ( operand instanceof ConstantTerm ) && operand.constantValue.equals( currentCoefficient ) );
        assert && assert( adjustedOperand, `expected to find constant ${currentCoefficient}` );
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
    const incrementEnabledProperty = new BooleanProperty( true );
    const decrementEnabledProperty = new BooleanProperty( true );

    // picker for choosing operand
    const operandPicker = new ObjectPicker( scene.operandProperty, operandItems, {
      arrowsColor: 'black',
      gradientColor: 'rgb( 150, 150, 150 )',
      xMargin: 6,
      touchAreaXDilation: 0,
      touchAreaYDilation: 15,

      // Providing these Properties means that we're responsible for up/down enabled state
      incrementEnabledProperty: incrementEnabledProperty,
      decrementEnabledProperty: decrementEnabledProperty,

      // When the increment button is pressed, skip operands that are inappropriate for the operation
      incrementFunction: index => {
        let nextOperandIndex = index + 1;
        const operator = scene.operatorProperty.value;
        while ( !isSupportedOperation( operator, scene.operands[ nextOperandIndex ], options.timesZeroEnabled ) ) {
          nextOperandIndex++;
          assert && assert( nextOperandIndex < scene.operands.length,
            `nextOperandIndex out of range: ${nextOperandIndex}` );
        }
        return nextOperandIndex;
      },

      // When the decrement button is pressed, skip operands that are inappropriate for the operation
      decrementFunction: index => {
        let nextOperandIndex = index - 1;
        const operator = scene.operatorProperty.value;
        while ( !isSupportedOperation( operator, scene.operands[ nextOperandIndex ], options.timesZeroEnabled ) ) {
          nextOperandIndex--;
          assert && assert( nextOperandIndex >= 0, `nextOperandIndex out of range: ${nextOperandIndex}` );
        }
        return nextOperandIndex;
      }
    } );

    // 'go' button, applies the operation
    const goButtonIcon = new Path( levelDownAltSolidShape, {
      fill: 'black',
      maxHeight: 0.5 * operandPicker.height // scale relative to the pickers
    } );
    const goButton = new RoundPushButton( {
      content: goButtonIcon,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 10,
      yMargin: 10,
      touchAreaDilation: 5
    } );

    assert && assert( !options.children, 'UniversalOperationControl sets children' );
    options.children = [ operatorRadioButtonGroup, operandPicker, goButton ];

    super( options );

    // Adjust the enabled state of the operand picker's increment/decrement arrows.
    // dispose not needed
    Multilink.multilink( [ scene.operatorProperty, scene.operandProperty ],

      /**
       * @param {string} operator - see EqualityExplorerConstants.OPERATORS
       * @param {Term} operand
       */
      ( operator, operand ) => {

        const operandIndex = scene.operands.indexOf( operand );
        assert && assert( operandIndex !== -1, `operand not found: ${operand}` );

        if ( ( operator === MathSymbols.TIMES || operator === MathSymbols.DIVIDE ) ) {
          assert && assert( operand instanceof ConstantTerm, `unexpected operand type: ${operand}` );

          // increment arrow is enabled if there are any constant term operands above the current selection
          let incrementEnabled = false;
          for ( let i = operandIndex + 1; i < scene.operands.length && !incrementEnabled; i++ ) {
            incrementEnabled = ( scene.operands[ i ] instanceof ConstantTerm );
          }
          incrementEnabledProperty.value = incrementEnabled;

          // down arrow is enabled if there are any constant term operands below the current selection
          let decrementEnabled = false;
          for ( let i = operandIndex - 1; i >= 0 && !decrementEnabled; i-- ) {
            decrementEnabled = ( scene.operands[ i ] instanceof ConstantTerm );
          }
          decrementEnabledProperty.value = decrementEnabled;
        }
        else {

          // other operators are supported for all operands
          incrementEnabledProperty.value = ( operandIndex < operandItems.length - 1 );
          decrementEnabledProperty.value = ( operandIndex > 0 );
        }
      } );

    // @private Tween animations that are running
    this.animations = [];

    // Clean up when an animation completes or is stopped.
    const animationCleanup = ( animation, operationNode ) => {
      this.animations.splice( this.animations.indexOf( animation ), 1 );
      !operationNode.isDisposed && operationNode.dispose();
      goButton.enabled = true;
    };

    // When the 'go' button is pressed, animate operations, then apply operations to terms.
    const goButtonListener = () => {

      // Go button is disabled until the animation completes, so that students don't press the button rapid-fire.
      // See https://github.com/phetsims/equality-explorer/issues/48
      goButton.enabled = false;

      const operation = new UniversalOperation( scene.operatorProperty.value, scene.operandProperty.value );
      phet.log && phet.log( `Go ${operation.toLogString()}` );

      // operation on left side
      const leftOperationNode = new UniversalOperationNode( operation, {
        centerX: scene.scale.leftPlate.positionProperty.value.x,
        centerY: this.centerY
      } );
      animationLayer.addChild( leftOperationNode );

      // operation on right side
      const rightOperationNode = new UniversalOperationNode( operation, {
        centerX: scene.scale.rightPlate.positionProperty.value.x,
        centerY: this.centerY
      } );
      animationLayer.addChild( rightOperationNode );

      // Apply the operation when both animations have completed.
      const numberOfAnimationsCompletedProperty = new NumberProperty( 0 );
      numberOfAnimationsCompletedProperty.lazyLink( numberOfAnimationsCompleted => {
        if ( numberOfAnimationsCompleted === 2 ) {
          scene.applyOperation( operation );
        }
      } );

      // animation on left side of the scale
      const leftAnimation = new TranslateThenFade( leftOperationNode, {
        destination: new Vector2( leftOperationNode.x, scene.scale.leftPlate.getGridTop() - leftOperationNode.height ),
        onComplete: () => {
          numberOfAnimationsCompletedProperty.value++;
          animationCleanup( leftAnimation, leftOperationNode );
        },
        onStop: () => {
          animationCleanup( leftAnimation, leftOperationNode );
        }
      } );
      this.animations.push( leftAnimation );

      // animation on right side of the scale
      const rightAnimation = new TranslateThenFade( rightOperationNode, {
        destination: new Vector2( rightOperationNode.x, scene.scale.rightPlate.getGridTop() - rightOperationNode.height ),
        onComplete: () => {
          numberOfAnimationsCompletedProperty.value++;
          animationCleanup( rightAnimation, rightOperationNode );
        },
        onStop: () => {
          animationCleanup( rightAnimation, rightOperationNode );
        }
      } );
      this.animations.push( rightAnimation );

      // start the animations
      leftAnimation.start();
      rightAnimation.start();
    };
    goButton.addListener( goButtonListener );

    // If the maxInteger limit is exceeded, stop all universal operations that are in progress
    const maxIntegerExceededListener = () => this.stopAnimations();
    scene.allTermCreators.forEach( termCreator =>
      termCreator.maxIntegerExceededEmitter.addListener( maxIntegerExceededListener ) ); // removeListener not needed
  }

  // @public
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Steps the animations.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    const animationsCopy = this.animations; // operate on a copy because step may modify the array
    animationsCopy.forEach( animation => animation.step( dt ) );
  }

  // @public
  reset() {

    // Stop all animations.
    this.stopAnimations();
  }

  /**
   * Stops all animations that are in progress.
   * @public
   */
  stopAnimations() {

    // Operate on a copy of the array, since animations remove themselves from the array when stopped.
    const arrayCopy = this.animations.slice( 0 );
    for ( let i = 0; i < arrayCopy.length; i++ ) {
      arrayCopy[ i ].stop();
    }
  }
}

/**
 * Does this operation result in division by zero?
 * @param {string} operator - see EqualityExplorerConstants.OPERATORS
 * @param {Term} operand
 * @returns {boolean}
 */
function isDivideByZero( operator, operand ) {
  return ( operator === MathSymbols.DIVIDE ) &&
         ( operand instanceof ConstantTerm && operand.constantValue.getValue() === 0 );
}

/**
 * Does this operation result in multiplication by zero?
 * @param {string} operator - see EqualityExplorerConstants.OPERATORS
 * @param {Term} operand
 * @returns {boolean}
 */
function isTimesZero( operator, operand ) {
  return ( operator === MathSymbols.TIMES ) &&
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
         ( operand instanceof VariableTerm );
}

/**
 * Are the specified operator and operand a supported combination?
 * @param {string} operator - see EqualityExplorerConstants.OPERATORS
 * @param {Term} operand - the proposed operand
 * @param {boolean} timesZeroEnabled - whether 'times 0' is a supported operation
 * @returns {boolean}
 * @private
 */
function isSupportedOperation( operator, operand, timesZeroEnabled ) {
  return !isDivideByZero( operator, operand ) &&
         ( timesZeroEnabled || !isTimesZero( operator, operand ) ) &&
         !isUnsupportedVariableTermOperation( operator, operand );
}

equalityExplorer.register( 'UniversalOperationControl', UniversalOperationControl );