// Copyright 2017-2018, University of Colorado Boulder

/**
 * Accordion box that allows the student to modify the value of one or more variables.
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
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  // strings
  var variablesString = require( 'string!EQUALITY_EXPLORER/variables' );
  var variableString = require( 'string!EQUALITY_EXPLORER/variable' );

  /**
   * @param {Variable[]} variables - the variables that appear in this accordion box
   * @param {Object} [options]
   * @constructor
   */
  function VariablesAccordionBox( variables, options ) {

    options = _.extend( {}, EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {

      // this accordion box is designed to be a fixed size, regardless of its content
      titleString: ( variables.length > 1 ) ? variablesString : variableString,
      fixedWidth: 100,
      fixedHeight: 75,
      fontSize: 24,

      // AccordionBox options
      showTitleWhenExpanded: false,
      contentXMargin: 20,
      contentYMargin: 4

    }, options );

    assert && assert( options.maxWidth === undefined, 'VariablesAccordionBox sets maxWidth' );
    options.maxWidth = options.fixedWidth;
    assert && assert( options.maxHeight === undefined, 'VariablesAccordionBox sets maxHeight' );
    options.maxHeight = options.fixedHeight;

    var contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );
    var contentHeight = options.fixedHeight - ( 2 * options.contentYMargin );

    assert && assert( !options.titleNode, 'VariablesAccordionBox sets titleNode' );
    options.titleNode = new Text( options.titleString, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentWidth
    } );

    var backgroundNode = new Rectangle( 0, 0, contentWidth, contentHeight );

    // Create a picker for each variable
    var children = [];
    variables.forEach( function( variable ) {

      var variableNode = new VariableNode( variable, {
        iconScale: 0.55,
        fontSize: options.fontSize
      } );

      var equalsText = new Text( MathSymbols.EQUAL_TO, {
        font: new PhetFont( options.fontSize )
      } );

      // NumberPicker.dispose not needed, VariablesAccordionBox exists for lifetime of the sim
      var valuePicker = new NumberPicker( variable.valueProperty, new Property( variable.range ), {
        color: 'black',
        font: new PhetFont( options.fontSize ),
        xMargin: 6,
        touchAreaYDilation: 15
      } );

      children.push( new HBox( {
        children: [ variableNode, equalsText, valuePicker ],
        spacing: 5,
        maxWidth: contentWidth,
        maxHeight: contentHeight
      } ) );
    } );

    var hBox = new HBox( {
      children: children,
      spacing: 25,
      maxWidth: contentWidth,
      center: backgroundNode.center
    } );

    var contentNode = new Node( {
      children: [ backgroundNode, hBox ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'VariablesAccordionBox', VariablesAccordionBox );

  return inherit( AccordionBox, VariablesAccordionBox );
} );
