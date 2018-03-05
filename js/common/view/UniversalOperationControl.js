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
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var ObjectPicker = require( 'EQUALITY_EXPLORER/common/view/ObjectPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UniversalOperation = require( 'EQUALITY_EXPLORER/common/model/UniversalOperation' );
  var UniversalOperationAnimation = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationAnimation' );

  /**
   * @param {SolvingScene} scene TODO too much information?
   * @param {Node} animationLayer
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationControl( scene, animationLayer, options ) {

    var self = this;

    options = _.extend( {
      font: new PhetFont( 24 ),
      spacing: 15
    }, options );

    // to improve readability
    var operatorProperty = scene.operatorProperty;
    var operators = scene.operators;
    var operandProperty = scene.operandProperty;
    var operandRange = scene.operandRange;
    var leftPlate = scene.scale.leftPlate;
    var rightPlate = scene.scale.rightPlate;

    // picker for choosing operator
    var operatorTerms = [];
    for ( var i = 0; i < operators.length; i++ ) {
      operatorTerms.push( {
        value: operators[ i ],
        node: new Text( operators[ i ], { font: options.font } )
      } );
    }
    var operatorPicker = new ObjectPicker( operatorProperty, operatorTerms, {
      color: 'black',
      xMargin: 12
    } );

    // picker for choosing operand
    var operandPicker = new NumberPicker( operandProperty, new Property( operandRange ), {
      color: 'black',
      font: options.font,
      xMargin: 6,
      upFunction: function( value ) {
        if ( value === -1 && operatorProperty.value === MathSymbols.DIVIDE ) {
          return 1; // prevent divide by zero
        }
        else {
          return value + 1;
        }
      },
      downFunction: function( value ) {
        if ( value === 1 && operatorProperty.value === MathSymbols.DIVIDE ) {
          return -1; // prevent divide by zero
        }
        else {
          return value - 1;
        }
      }
    } );

    // @private Tween animations that are running
    this.animations = [];

    // When the 'go' button is pressed, animate operations, then apply operations to terms.
    var goButtonListener = function() {

      var operation = new UniversalOperation( operatorProperty.value, operandProperty.value );

      // start vertically aligned with the operator picker
      var startY = animationLayer.globalToLocalBounds( operatorPicker.parentToGlobalBounds( operatorPicker.bounds ) ).centerY;

      var animation = new UniversalOperationAnimation( operation, {
        font: options.font,
        leftX: leftPlate.locationProperty.value.x,
        rightX: rightPlate.locationProperty.value.x,
        startY: startY,
        onComplete: function() {
          //TODO apply operation to terms on scale, and/or create terms on scale
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

    assert && assert( !options.children, 'children is set by this Node' );
    options.children = [ operatorPicker, operandPicker, goButton ];

    HBox.call( this, options );

    // prevent divide by zero.
    // unlink not required.
    operatorProperty.link( function( operator ) {
      if ( operator === MathSymbols.DIVIDE && operandProperty.value === 0 ) {
        operandProperty.value = 1;
      }
    } );
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
    }
  } );
} );
