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
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
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

  /**
   * @param {Property.<number>} valueProperty
   * @param {Range} valueRange
   * @param {Object} [options]
   * @constructor
   */
  function VariableAccordionBox( valueProperty, valueRange, options ) {

    options = _.extend( {
      fill: 'white',
      showTitleWhenExpanded: false,
      titleNode: new Text( variableString, {
        font: new PhetFont( 18 )
        //TODO maxWidth
      } ),
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      contentXMargin: 0,
      contentYMargin: 0
    }, options );

    var backgroundNode = new Rectangle( 0, 0, 185, 75 );

    var xEqualsText = new Text( xString + ' =', {
      font: EQUATION_FONT
    } );

    var valuePicker = new NumberPicker( valueProperty, new Property( valueRange ), {
      color: 'black',
      font: EQUATION_FONT,
      xMargin: 6,
      left: xEqualsText.right + 5,
      centerY: xEqualsText.centerY
    } );

    var equationNode = new Node( {
      children: [ xEqualsText, valuePicker ],
      center: backgroundNode.center,
      maxWidth: backgroundNode.width - 20,
      maxHeight: backgroundNode.height - 10
    } );

    var contentNode = new Node( {
      children: [ backgroundNode, equationNode ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'VariableAccordionBox', VariableAccordionBox );

  return inherit( AccordionBox, VariableAccordionBox );
} );
