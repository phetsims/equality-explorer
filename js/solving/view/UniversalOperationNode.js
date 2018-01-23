// Copyright 2018, University of Colorado Boulder

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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoveTo = require( 'TWIXT/MoveTo' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var ObjectPicker = require( 'EQUALITY_EXPLORER/common/view/ObjectPicker' );
  var OpacityTo = require( 'TWIXT/OpacityTo' );
  var OperationNode = require( 'EQUALITY_EXPLORER/solving/view/OperationNode' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var MOTION_Y_OFFSET = 65;
  var MOTION_DURATION = 500 / EqualityExplorerQueryParameters.speed;
  var OPACITY_DURATION = 250 / EqualityExplorerQueryParameters.speed;

  /**
   * @param {SolvingScene} scene TODO too much information?
   * @param {Node} animationLayer
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationNode( scene, animationLayer, options ) {

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
    var operatorItems = [];
    for ( var i = 0; i < scene.operators.length; i++ ) {
      operatorItems.push( {
        value: operators[ i ],
        node: new Text( operators[ i ], { font: options.font } )
      } );
    }
    var operatorPicker = new ObjectPicker( operatorProperty, operatorItems, {
      color: 'black',
      xMargin: 12
    } );

    // picker for choosing operand
    var operandPicker = new NumberPicker( operandProperty, new Property( operandRange ), {
      color: 'black',
      font: options.font,
      xMargin: 6,
      upFunction: function( value ) {
        if ( value === -1 && operatorProperty.value === EqualityExplorerConstants.DIVIDE ) {
          return 1; // prevent divide by zero
        }
        else {
          return value + 1;
        }
      },
      downFunction: function( value ) {
        if ( value === 1 && operatorProperty.value === EqualityExplorerConstants.DIVIDE ) {
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

      // IIFE so that the 'go' button can be pressed repeatedly, before the current operation has completed.
      ( function() {

        var operator = operatorProperty.value;
        var operand = scene.operandProperty.value;

        // Function that applies the operation to terms
        var applyOperation = null;
        if ( operator === EqualityExplorerConstants.PLUS ) {
          applyOperation = function() {
            scene.leftConstantTerm.plus( operand );
            scene.rightConstantTerm.plus( operand );
          };
        }
        else if ( operator === EqualityExplorerConstants.MINUS ) {
          applyOperation = function() {
            scene.rightConstantTerm.minus( operand );
            scene.rightConstantTerm.minus( operand );
          };
        }
        else if ( operator === EqualityExplorerConstants.TIMES ) {
          applyOperation = function() {
            scene.leftConstantTerm.times( operand );
            scene.leftVariableTerm.times( operand );
            scene.rightConstantTerm.times( operand );
            scene.rightVariableTerm.times( operand );
          };
        }
        else if ( operator === EqualityExplorerConstants.DIVIDE ) {
          applyOperation = function() {
            scene.leftConstantTerm.divide( operand );
            scene.leftVariableTerm.divide( operand );
            scene.rightConstantTerm.divide( operand );
            scene.rightVariableTerm.divide( operand );
          };
        }
        else {
          throw new Error( 'unsupported operator: ' + operator );
        }

        // start the animation vertically centered on the pickers
        var yStart = animationLayer.globalToLocalBounds( operatorPicker.parentToGlobalBounds( operatorPicker.bounds ) ).centerY;

        // Nodes for the operation
        var leftOperationNode = new OperationNode( operator, operand, {
          font: options.font,
          centerX: leftPlate.locationProperty.value.x,
          centerY: yStart
        } );
        var rightOperationNode = new OperationNode( operator, operand, {
          font: options.font,
          centerX: rightPlate.locationProperty.value.x,
          centerY: yStart
        } );

        // Animate both operation nodes together, so that the operation is applied to both sides simultaneously.
        var parentNode = new Node( {
          children: [ leftOperationNode, rightOperationNode ]
        } );

        // opacity animation
        var opacityTo = new OpacityTo( parentNode, {
          duration: OPACITY_DURATION,
          endOpacity: 0,
          easing: TWEEN.Easing.Linear.None,
          onStart: function() {
            self.addAnimation( opacityTo );
          },
          onComplete: function() {
            animationLayer.removeChild( parentNode );
            applyOperation();
            self.removeAnimation( opacityTo );
          },
          onStop: function() {
            phet.log && phet.log( 'UniversalOperationNode opacityTo.onStop' );
            if ( animationLayer.hasChild( parentNode ) ) {
              animationLayer.removeChild( parentNode );
            }
            self.removeAnimation( opacityTo );
          }
        } );

        // motion animation
        var endPoint = new Vector2( parentNode.x, parentNode.y + MOTION_Y_OFFSET );
        var moveTo = new MoveTo( parentNode, endPoint, {
          duration: MOTION_DURATION,
          constantSpeed: false,
          easing: TWEEN.Easing.Quadratic.In,
          onStart: function() {
            self.addAnimation( moveTo );
            animationLayer.addChild( parentNode );
          },
          onComplete: function() {
            opacityTo.start();
            self.removeAnimation( moveTo );
          },
          onStop: function() {
            phet.log && phet.log( 'UniversalOperationNode moveTo.onStop' );
            opacityTo.stop();
            if ( animationLayer.hasChild( parentNode ) ) {
              animationLayer.removeChild( parentNode );
            }
            self.removeAnimation( moveTo );
          }
        } );

        // start the animation
        moveTo.start();

      } )();
    };

    // 'go' button, applies the operation
    var goButtonIcon = new FontAwesomeNode( 'level_down', {
      scale: 0.65 * operandPicker.height / operandPicker.height // scale relative to the pickers
    } );
    var goButton = new RoundPushButton( {
      listener: goButtonListener,
      content: goButtonIcon,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minXMargin: 10,
      minYMargin: 10
    } );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [ operatorPicker, operandPicker, goButton ];

    HBox.call( this, options );

    // prevent divide by zero, unlink unnecessary
    operatorProperty.link( function( operator ) {
      if ( operator === EqualityExplorerConstants.DIVIDE && operandProperty.value === 0 ) {
        operandProperty.value = 1;
      }
    } );
  }

  equalityExplorer.register( 'UniversalOperationNode', UniversalOperationNode );

  return inherit( HBox, UniversalOperationNode, {

    // @public
    reset: function() {

      // stop all animations and clear the list
      for ( var i = 0; i < this.animations.length; i++ ) {
        this.animations[ i ].stop();
      }
      this.animations = [];
    },

    /**
     * Adds an animation if it hasn't already been added.
     * @param {Object} animation - wrapper for a Tween animation, see twixt
     */
    addAnimation: function( animation ) {
      if ( this.animations.indexOf( animation ) === -1 ) {
        this.animations.push( animation );
      }
    },

    /**
     * Removes an animation if it hasn't already been removed.
     * @param {Object} animation - wrapper for a Tween animation, see twixt
     */
    removeAnimation: function( animation ) {
      var index = this.animations.indexOf( animation );
      if ( index !== -1 ) {
        this.animations.splice( index, 1 );
      }
    }
  } );
} );
