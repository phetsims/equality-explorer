// Copyright 2017-2023, University of Colorado Boulder

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
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { HBox, HBoxOptions, Node, Path } from '../../../../scenery/js/imports.js';
import levelDownAltSolidShape from '../../../../sherpa/js/fontawesome-5/levelDownAltSolidShape.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsScene from '../../operations/model/OperationsScene.js';
import ConstantTerm from '../model/ConstantTerm.js';
import Term from '../model/Term.js';
import UniversalOperation, { UniversalOperand } from '../model/UniversalOperation.js';
import VariableTerm from '../model/VariableTerm.js';
import ObjectPicker, { ObjectPickerItem } from './ObjectPicker.js';
import TranslateThenFade from './TranslateThenFade.js';
import UniversalOperationNode from './UniversalOperationNode.js';
import Range from '../../../../dot/js/Range.js';
import UniversalOperator from '../model/UniversalOperator.js';
import RectangularRadioButton from '../../../../sun/js/buttons/RectangularRadioButton.js';

type SelfOptions = {
  timesZeroEnabled?: boolean; // whether to include 'times 0' as one of the operations
};

type UniversalOperationControlOptions = SelfOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class UniversalOperationControl extends HBox {

  // Tween animations that are running
  private readonly animations: TranslateThenFade[];

  public constructor( scene: OperationsScene, animationLayer: Node, providedOptions?: UniversalOperationControlOptions ) {

    const options = optionize<UniversalOperationControlOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      timesZeroEnabled: true,

      // HBoxOptions
      isDisposable: false,
      spacing: 15
    }, providedOptions );

    // items for the radio buttons that are used to choose the operator
    const operatorItems: RectangularRadioButtonGroupItem<UniversalOperator>[] = [];
    for ( let i = 0; i < scene.operators.length; i++ ) {
      const operator = scene.operators[ i ];
      operatorItems.push( {
        value: operator,
        createNode: () => UniversalOperationNode.createOperatorNode( operator ),
        tandemName: `${operator.tandemName}${RectangularRadioButton.TANDEM_NAME_SUFFIX}`
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
      },
      tandem: options.tandem.createTandem( 'operatorRadioButtonGroup' )
    } );

    /*
     * Adjusts the operand if it's not appropriate for a specified operator.
     */
    const operatorListener = ( operator: UniversalOperator ) => {

      const currentOperand = scene.operandProperty.value;

      if ( isDivideByZero( operator, currentOperand ) ||
           ( !options.timesZeroEnabled && isTimesZero( operator, currentOperand ) ) ) {

        // If the operator would result in division or multiplication by zero, change the operand to 1.
        const adjustedOperand = _.find( scene.operands,
          operand => ( operand instanceof ConstantTerm ) && ( operand.constantValue.getValue() === 1 ) )!;
        assert && assert( adjustedOperand, 'expected to find constant 1' );
        scene.operandProperty.value = adjustedOperand;
      }
      else if ( isUnsupportedVariableTermOperation( operator, currentOperand ) ) {

        // If the operator is not supported for a variable term operand, change the operand to
        // a constant term that has the same value as the variable term's coefficient.
        // E.g. if the operand is '5x', change the operand to '5'.
        assert && assert( currentOperand instanceof VariableTerm ); // eslint-disable-line no-simple-type-checking-assertions
        const currentCoefficient = ( currentOperand as VariableTerm ).coefficient;
        const adjustedOperand = _.find( scene.operands,
          operand => ( operand instanceof ConstantTerm ) && operand.constantValue.equals( currentCoefficient ) )!;
        assert && assert( adjustedOperand, `expected to find constant ${currentCoefficient}` );
        scene.operandProperty.value = adjustedOperand;
      }
    };

    scene.operatorProperty.lazyLink( operatorListener );

    // items for the operand picker
    const operandItems: ObjectPickerItem<UniversalOperand>[] = [];
    for ( let i = 0; i < scene.operands.length; i++ ) {
      const operand = scene.operands[ i ];
      operandItems.push( {
        value: operand,
        node: UniversalOperationNode.createOperandNode( operand )
      } );
    }

    const operandPickerTandem = options.tandem.createTandem( 'operandPicker' );

    // Take control of enabling up/down arrows for operand picker
    const incrementEnabledProperty = new BooleanProperty( true, {
      tandem: operandPickerTandem.createTandem( 'incrementEnabledProperty' ),
      phetioReadOnly: true
    } );
    const decrementEnabledProperty = new BooleanProperty( true, {
      tandem: operandPickerTandem.createTandem( 'decrementEnabledProperty' ),
      phetioReadOnly: true
    } );

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
      },
      tandem: operandPickerTandem
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
      touchAreaDilation: 5,
      tandem: options.tandem.createTandem( 'goButton' )
    } );

    assert && assert( !options.children, 'UniversalOperationControl sets children' );
    options.children = [ operatorRadioButtonGroup, operandPicker, goButton ];

    super( options );

    // Adjust the enabled state of the operand picker's increment/decrement arrows.
    Multilink.multilink( [ scene.operatorProperty, scene.operandProperty ],
      ( operator, operand ) => {

        const operandIndex = scene.operands.indexOf( operand );
        assert && assert( operandIndex !== -1, `operand not found: ${operand}` );

        if ( ( operator === UniversalOperator.TIMES || operator === UniversalOperator.DIVIDE ) ) {
          assert && assert( operand instanceof ConstantTerm, `unexpected operand type: ${operand}` ); // eslint-disable-line no-simple-type-checking-assertions

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

    this.animations = [];

    // Clean up when an animation completes or is stopped.
    const animationCleanup = ( animation: TranslateThenFade, operationNode: UniversalOperationNode ) => {
      this.animations.splice( this.animations.indexOf( animation ), 1 );
      !operationNode.isDisposed && operationNode.dispose();
      goButton.enabled = true;
    };

    // When the 'go' button is pressed, animate operations, then apply operations to terms.
    const goButtonListener = () => {

      // Go button is disabled until the animation completes, so that students don't press the button rapid-fire.
      // See https://github.com/phetsims/equality-explorer/issues/48
      goButton.enabled = false;

      const operation = new UniversalOperation( scene.operatorProperty.value, scene.operandProperty.value ); //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
      phet.log && phet.log( `Go ${operation.toLogString()}` );

      // operation on left side
      const leftOperationNode = new UniversalOperationNode( operation, { //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
        centerX: scene.scale.leftPlate.positionProperty.value.x,
        centerY: this.centerY
      } );
      animationLayer.addChild( leftOperationNode );

      // operation on right side
      const rightOperationNode = new UniversalOperationNode( operation, { //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
        centerX: scene.scale.rightPlate.positionProperty.value.x,
        centerY: this.centerY
      } );
      animationLayer.addChild( rightOperationNode );

      // Apply the operation when both animations have completed.
      const numberOfAnimationsCompletedProperty = new NumberProperty( 0, { //TODO https://github.com/phetsims/equality-explorer/issues/197 stateful animation?
        numberType: 'Integer',
        range: new Range( 0, 2 )
      } );
      numberOfAnimationsCompletedProperty.lazyLink( numberOfAnimationsCompleted => {
        if ( numberOfAnimationsCompleted === 2 ) {
          scene.applyOperation( operation );
        }
      } );

      // animation on left side of the scale
      const leftAnimation = new TranslateThenFade( leftOperationNode, { //TODO https://github.com/phetsims/equality-explorer/issues/197 stateful animation?
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
      const rightAnimation = new TranslateThenFade( rightOperationNode, { //TODO https://github.com/phetsims/equality-explorer/issues/197 stateful animation?
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
      termCreator.maxIntegerExceededEmitter.addListener( maxIntegerExceededListener ) );
  }

  /**
   * Steps the animations.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    const animationsCopy = this.animations; // operate on a copy because step may modify the array
    animationsCopy.forEach( animation => animation.step( dt ) );
  }

  public reset(): void {
    this.stopAnimations();
  }

  /**
   * Stops all animations that are in progress.
   */
  public stopAnimations(): void {

    // Operate on a copy of the array, since animations remove themselves from the array when stopped.
    const arrayCopy = this.animations.slice( 0 );
    for ( let i = 0; i < arrayCopy.length; i++ ) {
      arrayCopy[ i ].stop();
    }
  }
}

/**
 * Does this operation result in division by zero?
 */
function isDivideByZero( operator: UniversalOperator, operand: Term ): boolean {
  return ( operator.symbol === MathSymbols.DIVIDE ) &&
         ( operand instanceof ConstantTerm && operand.constantValue.getValue() === 0 );
}

/**
 * Does this operation result in multiplication by zero?
 */
function isTimesZero( operator: UniversalOperator, operand: Term ): boolean {
  return ( operator.symbol === MathSymbols.TIMES ) &&
         ( operand instanceof ConstantTerm && operand.constantValue.getValue() === 0 );
}

/**
 * Is the operation an attempt to do something that is unsupported with a variable term operand?
 * Times and divide are unsupported for variable term operands.
 */
function isUnsupportedVariableTermOperation( operator: UniversalOperator, operand: Term ): boolean {
  return ( operator.symbol === MathSymbols.TIMES || operator.symbol === MathSymbols.DIVIDE ) &&
         ( operand instanceof VariableTerm );
}

/**
 * Are the specified operator and operand a supported combination?
 * @param operator
 * @param operand
 * @param timesZeroEnabled - whether 'times 0' is a supported operation
 */
function isSupportedOperation( operator: UniversalOperator, operand: Term, timesZeroEnabled: boolean ): boolean {
  return !isDivideByZero( operator, operand ) &&
         ( timesZeroEnabled || !isTimesZero( operator, operand ) ) &&
         !isUnsupportedVariableTermOperation( operator, operand );
}

equalityExplorer.register( 'UniversalOperationControl', UniversalOperationControl );