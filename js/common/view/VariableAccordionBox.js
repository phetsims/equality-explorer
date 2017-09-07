// Copyright 2017, University of Colorado Boulder

/***
 * Accordion box that allows the student to modify the value of the variable (x).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var variableString = require( 'string!EQUALITY_EXPLORER/variable' );
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  var EQUATION_FONT = new PhetFont( 24 );
  var CONTENT_SIZE = new Dimension2( 185, 75 );

  /**
   * @param {Property.<number>} valueProperty
   * @param {Range} valueRange
   * @param {Object} [options]
   * @constructor
   */
  function VariableAccordionBox( valueProperty, valueRange, options ) {

    options = _.extend( {

      // supertype options
      fill: 'white',
      showTitleWhenExpanded: false,
      titleNode: new Text( variableString, {
        font: new PhetFont( 18 ),
        maxWidth: 0.75 * CONTENT_SIZE.width
      } ),
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      contentXMargin: 20,
      contentYMargin: 10
    }, options );

    var backgroundNode = new Rectangle( 0, 0, CONTENT_SIZE.width, CONTENT_SIZE.height );

    var xText = new Text( xString, {
      font: EQUATION_FONT,
      maxWidth: 0.75 * CONTENT_SIZE.width
    } );

    var equalsText = new Text( '=', {
      font: EQUATION_FONT
    } );

    // NumberPicker.dispose not needed, VariableAccordionBox exists for lifetime of the sim
    var valuePicker = new NumberPicker( valueProperty, new Property( valueRange ), {
      color: 'black',
      font: EQUATION_FONT,
      xMargin: 6
    } );

    var equationNode = new HBox( {
      children: [ xText, equalsText, valuePicker ],
      spacing: 5,
      center: backgroundNode.center
    } );

    var contentNode = new Node( {
      children: [ backgroundNode, equationNode ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'VariableAccordionBox', VariableAccordionBox );

  return inherit( AccordionBox, VariableAccordionBox );
} );
