// Copyright 2017, University of Colorado Boulder

/**
 * Control for specifying and applying an operation to both sides of the scale.
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
  var Range = require( 'DOT/Range' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Property.<string>} operatorProperty
   * @param {Property.<number>} operandProperty
   * @param {Object} [options]
   * @constructor
   */
  function OperationNode( operatorProperty, operandProperty, options ) {

    options = _.extend( {
      operatorFont: new PhetFont( 24 ),
      operandFont: new PhetFont( 24 ),
      operandRange: new Range( -10, 10 ),
      spacing: 15
    }, options );

    // picker for choosing operator
    var operators = [
      EqualityExplorerConstants.PLUS,
      EqualityExplorerConstants.MINUS,
      EqualityExplorerConstants.TIMES,
      EqualityExplorerConstants.DIVIDE
    ];
    var operatorItems = [];
    for ( var i = 0; i < operators.length; i++ ) {
      operatorItems.push( {
        value: operators[ i ],
        node: new Text( operators[ i ], { font: options.operatorFont } )
      } );
    }
    var operatorPicker = new ObjectPicker( operatorProperty, operatorItems, {
      color: 'black',
      xMargin: 12
    } );

    // picker for choosing operand
    var operandPicker = new NumberPicker( operandProperty, new Property( options.operandRange ), {
      color: 'black',
      font: options.operandFont,
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

    // Go button to apply the operation
    var goButtonIcon = new FontAwesomeNode( 'level_down', {
      scale: 0.65
    } );
    var goButton = new RoundPushButton( {
      //TODO add goButton listener
      content: goButtonIcon,
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      minXMargin: 10,
      minYMargin: 10
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ operatorPicker, operandPicker, goButton ];

    HBox.call( this, options );

    // prevent divide by zero, unlink unnecessary
    operatorProperty.link( function( operator ) {
      if ( operator === EqualityExplorerConstants.DIVIDE && operandProperty.value === 0 ) {
        operandProperty.value = 1;
      }
    } );
  }

  equalityExplorer.register( 'OperationNode', OperationNode );

  return inherit( HBox, OperationNode );
} );
