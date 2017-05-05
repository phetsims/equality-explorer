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
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var RectangularToggleButton = require( 'SUN/buttons/RectangularToggleButton' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {Property.<string>} operatorProperty
   * @param {Property.<number>} operandProperty
   * @param {Object} [options]
   * @constructor
   */
  function OperationNode( operatorProperty, operandProperty, options ) {

    options = _.extend( {
      operatorFont: new PhetFont( 16 ),
      operandFont: new PhetFont( 24 ),
      operandRange: new Range( -10, 10 ),
      spacing: 15
    }, options );

    //TODO mockup for operator control
    var plusToggleButton = new RectangularToggleButton( true, false, new Property( true ), {
      content: new Text( EqualityExplorerConstants.PLUS, { font: options.operatorFont } ),
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW
    } );
    var minusToggleButton = new RectangularToggleButton( true, false, new Property( false ), {
      content: new Text( EqualityExplorerConstants.MINUS, { font: options.operatorFont } ),
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW
    } );
    var timesToggleButton = new RectangularToggleButton( true, false, new Property( false ), {
      content: new Text( EqualityExplorerConstants.TIMES, { font: options.operatorFont } ),
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW
    } );
    var divideToggleButton = new RectangularToggleButton( true, false, new Property( false ), {
      content: new Text( EqualityExplorerConstants.DIVIDE, { font: options.operatorFont } ),
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW
    } );
    var operatorButtons = new VBox( {
      children: [
        new HBox( { children: [ plusToggleButton, minusToggleButton ] } ),
        new HBox( { children: [ timesToggleButton, divideToggleButton ] } )
      ]
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
      //TODO add listener to Go button
      content: goButtonIcon,
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      minXMargin: 10,
      minYMargin: 10
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ operatorButtons, operandPicker, goButton ];

    HBox.call( this, options );

    // prevent divide by zero
    operatorProperty.link( function( operator ) {
      if ( operator === EqualityExplorerConstants.DIVIDE && operandProperty.value === 0 ) {
        operandProperty.value = 1;
      }
    } );
  }

  equalityExplorer.register( 'OperationNode', OperationNode );

  return inherit( HBox, OperationNode );
} );
