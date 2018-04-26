// Copyright 2017-2018, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ObjectPicker = require( 'EQUALITY_EXPLORER/common/view/ObjectPicker' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Property = require( 'AXON/Property' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var TranslateThenFade = require( 'EQUALITY_EXPLORER/common/view/TranslateThenFade' );
  var UniversalOperation = require( 'EQUALITY_EXPLORER/common/model/UniversalOperation' );
  var UniversalOperationNode = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationNode' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var PICKER_OPTIONS = {
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

    var self = this;

    options = _.extend( {
      timesZeroEnabled: true, // whether to include 'times 0' as one of the operations

      // supertype options
      spacing: 15
    }, options );

    // @private
    this.timesZeroEnabled = options.timesZeroEnabled;

    // items for the operator picker
    var operatorItems = [];
    for ( var i = 0; i < scene.operators.length; i++ ) {
      var operator = scene.operators[ i ];
      operatorItems.push( {
        value: operator,
        node: UniversalOperationNode.createOperatorNode( operator )
      } );
    }

    /*
     * Adjusts the operand if it's not appropriate for a specified operator.
     * @param {string} operator - see EqualityExplorerConstants.OPERATORS
     */
    var operatorListener = function( operator ) {

      var currentOperand = scene.operandProperty.value;
      var adjustedOperand;

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
        var currentCoefficient = currentOperand.coefficient;
        adjustedOperand = _.find( scene.operands, function( operand ) {
          return ( operand instanceof ConstantTerm ) && ( operand.constantValue.equals( currentCoefficient ) );
        } );
        assert && assert( adjustedOperand, 'expected to find constant ' + currentCoefficient );
        scene.operandProperty.value = adjustedOperand;
      }
    };

    // picker for choosing operator
    var operatorPicker = new ObjectPicker( scene.operatorProperty, operatorItems, _.extend( {}, PICKER_OPTIONS, {
      wrapEnabled: true, // wrap around when min/max is reached
      xMargin: 18,

      // When the up button is pressed, change the operand if it's inappropriate for the operator
      upFunction: function( index ) {
        var nextIndex = index + 1;
        operatorListener( scene.operators[ nextIndex ] );
        return nextIndex;
      },

      // When the down button is pressed, change the operand if it's inappropriate for the operator
      downFunction: function( index ) {
        var nextIndex = index - 1;
        operatorListener( scene.operators[ nextIndex ] );
        return nextIndex;
      }
    } ) );

    // items for the operand picker
    var operandItems = [];
    for ( i = 0; i < scene.operands.length; i++ ) {
      var operand = scene.operands[ i ];
      operandItems.push( {
        value: operand,
        node: UniversalOperationNode.createOperandNode( operand )
      } );
    }

    // Take control of enabling up/down arrows for operand picker
    var upEnabledProperty = new BooleanProperty( true );
    var downEnabledProperty = new BooleanProperty( true );

    // picker for choosing operand
    var operandPicker = new ObjectPicker( scene.operandProperty, operandItems, _.extend( {}, PICKER_OPTIONS, {
      xMargin: 6,

      // Providing these Properties means that we're responsible for up/down enabled state
      upEnabledProperty: upEnabledProperty,
      downEnabledProperty: downEnabledProperty,

      // When the up button is pressed, skip operands that are inappropriate for the operation
      upFunction: function( index ) {
        var nextOperandIndex = index + 1;
        var operator = scene.operatorProperty.value;
        while ( !self.isSupportedOperation( operator, scene.operands[ nextOperandIndex ] ) ) {
          nextOperandIndex++;
          assert && assert( nextOperandIndex < scene.operands.length, 'nextOperandIndex out of range: ' + nextOperandIndex );
        }
        return nextOperandIndex;
      },

      // When the down button is pressed, skip operands that are inappropriate for the operation
      downFunction: function( index ) {
        var nextOperandIndex = index - 1;
        var operator = scene.operatorProperty.value;
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

        var operandIndex = scene.operands.indexOf( operand );
        assert && assert( operandIndex !== -1, 'operand not found: ' + operand );

        if ( ( operator === MathSymbols.TIMES || operator === MathSymbols.DIVIDE ) ) {
          assert && assert( operand instanceof ConstantTerm, 'unexpected operand type: ' + operand );

          // up arrow is enabled if there are any constant term operands above the current selection
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

    // Clean up when an animation completes or is stopped.
    var animationCleanup = function( animation, operationNode ) {
      self.animations.splice( self.animations.indexOf( animation ), 1 );
      !operationNode.disposed && operationNode.dispose();
      goButton.enabled = true;
    };

    // When the 'go' button is pressed, animate operations, then apply operations to terms.
    var goButtonListener = function() {

      // Go button is disabled until the animation completes, so that students don't press the button rapid-fire.
      // See https://github.com/phetsims/equality-explorer/issues/48
      goButton.enabled = false;

      var operation = new UniversalOperation( scene.operatorProperty.value, scene.operandProperty.value );
      phet.log && phet.log( 'Go ' + operation.toLogString() );

      // operation on left side
      var leftOperationNode = new UniversalOperationNode( operation, {
        centerX: scene.scale.leftPlate.locationProperty.value.x,
        centerY: self.centerY
      } );
      animationLayer.addChild( leftOperationNode );

      // operation on right side
      var rightOperationNode = new UniversalOperationNode( operation, {
        centerX: scene.scale.rightPlate.locationProperty.value.x,
        centerY: self.centerY
      } );
      animationLayer.addChild( rightOperationNode );

      // Apply the operation when both animations have completed.
      var numberOfAnimationsCompletedProperty = new NumberProperty( 0 );
      numberOfAnimationsCompletedProperty.lazyLink( function( numberOfAnimationsCompleted ) {
        if ( numberOfAnimationsCompleted === 2 ) {
          scene.applyOperation( operation );
        }
      } );

      // animation on left side of the scale
      var leftAnimation = new TranslateThenFade( leftOperationNode, {
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
      var rightAnimation = new TranslateThenFade( rightOperationNode, {
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
    var goButtonIcon = new FontAwesomeNode( 'level_down', {
      scale: 0.75 * operandPicker.height / operandPicker.height // scale relative to the pickers
    } );
    var goButton = new RoundPushButton( {
      listener: goButtonListener,
      content: goButtonIcon,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minXMargin: 10,
      minYMargin: 10
    } );

    assert && assert( !options.children, 'UniversalOperationControl sets children' );
    options.children = [ operatorPicker, operandPicker, goButton ];

    HBox.call( this, options );

    // If the maxInteger limit is exceeded, stop all universal operations that are in progress
    var maxIntegerExceededListener = function() {
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

  return inherit( HBox, UniversalOperationControl, {

    // @public
    reset: function() {

      // Stop all animations.
      this.stopAnimations();
    },

    /**
     * Stops all animations that are in progress.
     * @private
     */
    stopAnimations: function() {

      // Operate on a copy of the array, since animations remove themselves from the array when stopped.
      var arrayCopy = this.animations.slice( 0 );
      for ( var i = 0; i < arrayCopy.length; i++ ) {
        arrayCopy[ i ].stop();
      }
    },

    /**
     * Are the specified operator and operand a supported combination?
     * @param {string} operator - see EqualityExplorerConstants.OPERATORS
     * @param {Term} operand - the proposed operand
     * @returns {boolean}
     */
    isSupportedOperation: function( operator, operand ) {
      return !isDivideByZero( operator, operand ) &&
             ( this.timesZeroEnabled || !isTimesZero( operator, operand ) ) &&
             !isUnsupportedVariableTermOperation( operator, operand );
    }
  } );
} );
