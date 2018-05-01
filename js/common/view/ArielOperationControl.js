// Copyright 2018, University of Colorado Boulder

//TODO #77 delete this if not used
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
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ObjectPicker = require( 'EQUALITY_EXPLORER/common/view/ObjectPicker' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var TranslateThenFade = require( 'EQUALITY_EXPLORER/common/view/TranslateThenFade' );
  var UniversalOperation = require( 'EQUALITY_EXPLORER/common/model/UniversalOperation' );
  var UniversalOperationNode = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {OperationsScene} scene
   * @param {Node} animationLayer
   * @param {Object} [options]
   * @constructor
   */
  function ArielOperationControl( scene, animationLayer, options ) {

    assert && assert( scene instanceof OperationsScene, 'invalid scene: ' + scene );

    var self = this;

    options = _.extend( {
      timesZeroEnabled: true, // whether to include 'times 0' as one of the operations

      // supertype options
      spacing: 15,
      align: 'center'
    }, options );

    // items for the operand picker
    var operandItems = [];
    for ( var i = 0; i < scene.operands.length; i++ ) {
      var operand = scene.operands[ i ];
      operandItems.push( {
        value: operand,
        node: UniversalOperationNode.createOperandNode( operand )
      } );
    }

    // picker for choosing operand
    var operandPicker = new ObjectPicker( scene.operandProperty, operandItems, {
      arrowsColor: 'black',
      gradientColor: 'rgb( 150, 150, 150 )',
      xMargin: 6,
      touchAreaXDilation: 0,
      touchAreaYDilation: 15
    } );

    //TODO clean this up if we use this control
    var plusButton = new RectangularPushButton( {
      content: UniversalOperationNode.createOperatorNode( MathSymbols.PLUS ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      listener: function() {
        scene.operatorProperty.value = MathSymbols.PLUS;
        applyOperation();
      }
    } );

    var minusButton = new RectangularPushButton( {
      content: UniversalOperationNode.createOperatorNode( MathSymbols.MINUS ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      listener: function() {
        scene.operatorProperty.value = MathSymbols.MINUS;
        applyOperation();
      }
    } );

    var timesButton = new RectangularPushButton( {
      content: UniversalOperationNode.createOperatorNode( MathSymbols.TIMES ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      listener: function() {
        scene.operatorProperty.value = MathSymbols.TIMES;
        applyOperation();
      }
    } );

    var divideByButton = new RectangularPushButton( {
      content: UniversalOperationNode.createOperatorNode( MathSymbols.DIVIDE ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      listener: function() {
        scene.operatorProperty.value = MathSymbols.DIVIDE;
        applyOperation();
      }
    } );

    var buttons = [ plusButton, minusButton, timesButton, divideByButton ];

    var buttonGroup = new HBox( {
      children: buttons,
      spacing: 3,
      centerX: operandPicker.centerX,
      top: operandPicker.bottom + 12
    } );

    assert && assert( !options.children, 'ArielOperationControl sets children' );
    options.children = [ operandPicker, buttonGroup ];

    Node.call( this, options );

    var updateButtons = function() {

      var operand = scene.operandProperty.value;

      // plus and minus are always enabled
      plusButton.enabled = true;
      minusButton.enabled = true;

      // add times button if the operand is a constant, and optionally non-zero
      timesButton.enabled = ( ( operand instanceof ConstantTerm ) &&
                              ( operand.constantValue.getValue() !== 0 || options.timesZeroEnabled ) );

      // add divide button if the operand is a non-zero constant
      divideByButton.enabled = ( ( operand instanceof ConstantTerm ) &&
                                 ( operand.constantValue.getValue() !== 0 ) );
    };

    // unlink not needed
    scene.operandProperty.link( updateButtons );

    // @private Tween animations that are running
    this.animations = [];

    // Clean up when an animation completes or is stopped.
    var animationCleanup = function( animation, operationNode ) {
      self.animations.splice( self.animations.indexOf( animation ), 1 );
      !operationNode.disposed && operationNode.dispose();
      updateButtons();
    };

    // When the 'go' button is pressed, animate operations, then apply operations to terms.
    var applyOperation = function() {

      // Disable buttons until the animation completes, so that students don't press the button rapid-fire.
      // See https://github.com/phetsims/equality-explorer/issues/48
      buttons.forEach( function( button ) {
        button.enabled = false;
      } );

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

    // If the maxInteger limit is exceeded, stop all universal operations that are in progress
    var maxIntegerExceededListener = function() {
      self.stopAnimations();
    };
    scene.allTermCreators.forEach( function( termCreator ) {
      termCreator.maxIntegerExceededEmitter.addListener( maxIntegerExceededListener ); // removeListener not needed
    } );
  }

  equalityExplorer.register( 'ArielOperationControl', ArielOperationControl );

  return inherit( Node, ArielOperationControl, {

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step: function( dt ) {
      this.animations.forEach( function( animation ) {
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
      var arrayCopy = this.animations.slice( 0 );
      for ( var i = 0; i < arrayCopy.length; i++ ) {
        arrayCopy[ i ].stop();
      }
    }
  } );
} );
