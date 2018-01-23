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
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var ObjectPicker = require( 'EQUALITY_EXPLORER/common/view/ObjectPicker' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {SolvingScene} scene
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationNode( scene, options ) {

    options = _.extend( {
      font: new PhetFont( 24 ),
      spacing: 15
    }, options );

    // to improve readability
    var operatorProperty = scene.operatorProperty;
    var operators = scene.operators;
    var operandProperty = scene.operandProperty;
    var operandRange = scene.operandRange;

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

    // When the 'go' button is pressed, apply the operation to terms.
    var goButtonListener = function() {
      var operand = scene.operandProperty.value;
      if ( operatorProperty.value === EqualityExplorerConstants.PLUS ) {
        scene.leftConstantTerm.plus( operand );
        scene.rightConstantTerm.plus( operand );
      }
      else if ( operatorProperty.value === EqualityExplorerConstants.MINUS ) {
        scene.leftConstantTerm.minus( operand );
        scene.rightConstantTerm.minus( operand );
      }
      else if ( operatorProperty.value === EqualityExplorerConstants.TIMES ) {
        scene.leftConstantTerm.times( operand );
        scene.rightConstantTerm.times( operand );
        scene.leftVariableTerm.times( operand );
        scene.rightVariableTerm.times( operand );
      }
      else if ( operatorProperty.value === EqualityExplorerConstants.DIVIDE ) {
        scene.leftConstantTerm.divide( operand );
        scene.rightConstantTerm.divide( operand );
        scene.leftVariableTerm.divide( operand );
        scene.rightVariableTerm.divide( operand );
      }
      else {
        throw new Error( 'unsupported operator: ' + operatorProperty.value );
      }
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

  return inherit( HBox, UniversalOperationNode );
} );
