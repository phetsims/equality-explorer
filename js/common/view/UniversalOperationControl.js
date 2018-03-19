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
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var ObjectPicker = require( 'EQUALITY_EXPLORER/common/view/ObjectPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var StringProperty = require( 'AXON/StringProperty' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UniversalOperation = require( 'EQUALITY_EXPLORER/common/model/UniversalOperation' );
  var UniversalOperationAnimation = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationAnimation' );
  var VariableTermOperand = require( 'EQUALITY_EXPLORER/common/model/VariableTermOperand' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {SolvingScene} scene
   * @param {Node} animationLayer
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationControl( scene, animationLayer, options ) {

    var self = this;

    options = _.extend( {
      fontSize: EqualityExplorerConstants.UNIVERSAL_OPERATION_FONT_SIZE,
      operandRange: new Range( -10, 10 ),

      // supertype options
      spacing: 15
    }, options );

    var normalFont = new PhetFont( options.fontSize );
    var mathFont = new MathSymbolFont( options.fontSize );

    //TODO move value component to model?
    // operator choices
    var operatorTerms = [];
    var operators = EqualityExplorerConstants.OPERATORS;
    for ( var i = 0; i < operators.length; i++ ) {
      operatorTerms.push( {
        value: operators[ i ],
        node: new Text( operators[ i ], { font: normalFont } )
      } );
    }

    //TODO move to model?
    // @private
    this.operatorProperty = new StringProperty( operators[ 0 ], {
      validValues: operators
    } );

    // picker for choosing operator
    var operatorPicker = new ObjectPicker( this.operatorProperty, operatorTerms, {
      wrapEnabled: true, // wrap around when min/max is reached
      color: 'black',
      xMargin: 12
    } );

    //TODO move value component to model?
    //TODO this is a wonky way to specify order and interleaving of variable term operands
    // operand choices - constant and variable terms
    // For the format of values, see UniversalOperator createConstantTermOperand and createVariableTermOperand.
    var operands = [];
    var operandTerms = [];
    for ( i = options.operandRange.min; i <= options.operandRange.max; i++ ) {

      // constant term
      var constantTermOperand = new ConstantTermOperand( i );
      operands.push( constantTermOperand );
      operandTerms.push( {
        value: constantTermOperand,
        node: new Text( i, { font: normalFont } )
      } );

      // variable term
      var variableTermOperand = new VariableTermOperand( i, xString );
      operands.push( variableTermOperand );
      if ( i === 1 ) {

        // x
        operandTerms.push( {
          value: variableTermOperand,
          node: new Text( xString, { font: mathFont } )
        } );
      }
      else if ( i === -1 ) {

        // -x
        operandTerms.push( {
          value: variableTermOperand,
          node: new Text( MathSymbols.UNARY_MINUS + xString, { font: mathFont } )
        } );
      }
      else if ( i !== 0 ) {

        // Nx
        operandTerms.push( {
          value: variableTermOperand,
          node: new HBox( {
            spacing: 2,
            children: [
              new Text( i, { font: normalFont } ),
              new Text( xString, { font: mathFont } )
            ]
          } )
        } );
      }
    }

    //TODO move to model?
    // @private {Property.<Object>}
    this.operandProperty = new Property( operandTerms[ 0 ].value );

    // picker for choosing operand
    var operandPicker = new ObjectPicker( this.operandProperty, operandTerms, {
      wrapEnabled: true, // wrap around when min/max is reached
      color: 'black',
      font: options.font,
      xMargin: 6
    } );

    // @private Tween animations that are running
    this.animations = [];

    // When the 'go' button is pressed, animate operations, then apply operations to terms.
    var goButtonListener = function() {

      var operation = new UniversalOperation( self.operatorProperty.value, self.operandProperty.value );

      // start vertically aligned with the operator picker
      var startY = animationLayer.globalToLocalBounds( operatorPicker.parentToGlobalBounds( operatorPicker.bounds ) ).centerY;

      var animation = new UniversalOperationAnimation( operation, {
        font: options.font,
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

    //TODO skip 0 operand when operator is DIVIDE
    //TODO change 0 operand to 1 when operator becomes DIVIDE
    //TODO change Nx operand to N when operator becomes TIMES or DIVIDE
    
    //TODO disable goButton when operation would cause any numerator or denominator would exceed 1M
  }

  equalityExplorer.register( 'UniversalOperationControl', UniversalOperationControl );

  return inherit( HBox, UniversalOperationControl, {

    // @public
    reset: function() {

      // Stop all animations.
      // Operate on a copy of the array, since animations remove themselves when stopped.
      var arrayCopy = this.animations.slice( 0 );
      for ( var i = 0; i < arrayCopy.length; i++ ) {
        arrayCopy[ i ].stop();
      }

      this.operatorProperty.reset();
      this.operandProperty.reset();
    }
  } );
} );
