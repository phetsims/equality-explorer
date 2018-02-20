// Copyright 2017-2018, University of Colorado Boulder

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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var variableString = require( 'string!EQUALITY_EXPLORER/variable' );
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {NumberProperty} valueProperty - the value of the variable 'x'
   * @param {Range} valueRange - the range of x's value
   * @param {Object} [options]
   * @constructor
   */
  function VariableAccordionBox( valueProperty, valueRange, options ) {

    options = _.extend( {

      // this accordion box is designed to be a fixed width, regardless of its content
      fixedWidth: 100,
      fontSize: 24,

      // supertype options
      resize: false,
      contentXMargin: 20,
      contentYMargin: 10,
      fill: 'white',
      showTitleWhenExpanded: false,
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5
    }, options );

    assert && assert( options.maxWidth === undefined, 'subtype defines its maxWidth' );
    options.maxWidth = options.fixedWidth;

    var contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    assert && assert( !options.titleNode, 'this type defines its titleNode' );
    options.titleNode = new Text( variableString, {
      font: new PhetFont( EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT_SIZE ),
      maxWidth: 0.85 * contentWidth
    } );

    var strut = new HStrut( contentWidth );

    var xText = new Text( xString, {
      font: new MathSymbolFont( options.fontSize ),
      maxWidth: 0.5 * contentWidth
    } );

    var equalsText = new Text( EqualityExplorerConstants.EQUALS, {
      font: new PhetFont( options.fontSize )
    } );

    // NumberPicker.dispose not needed, VariableAccordionBox exists for lifetime of the sim
    var valuePicker = new NumberPicker( valueProperty, new Property( valueRange ), {
      color: 'black',
      font: new PhetFont( options.fontSize ),
      xMargin: 6
    } );

    var equationNode = new HBox( {
      children: [ xText, equalsText, valuePicker ],
      spacing: 5,
      center: strut.center,
      maxWidth: contentWidth
    } );

    var contentNode = new Node( {
      children: [ strut, equationNode ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'VariableAccordionBox', VariableAccordionBox );

  return inherit( AccordionBox, VariableAccordionBox );
} );
