// Copyright 2017-2019, University of Colorado Boulder

/**
 * Accordion box that allows the student to modify the value of one or more variables.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  // strings
  const variablesString = require( 'string!EQUALITY_EXPLORER/variables' );
  const variableString = require( 'string!EQUALITY_EXPLORER/variable' );

  /**
   * @param {Variable[]} variables - the variables that appear in this accordion box
   * @param {Object} [options]
   * @constructor
   */
  function VariablesAccordionBox( variables, options ) {

    options = merge( {}, EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {

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

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );
    const contentHeight = options.fixedHeight - ( 2 * options.contentYMargin );

    assert && assert( !options.titleNode, 'VariablesAccordionBox sets titleNode' );
    options.titleNode = new Text( options.titleString, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentWidth
    } );

    const backgroundNode = new Rectangle( 0, 0, contentWidth, contentHeight );

    // Create a picker for each variable
    const children = [];
    variables.forEach( function( variable ) {

      const variableNode = new VariableNode( variable, {
        iconScale: 0.55,
        fontSize: options.fontSize
      } );

      const equalsText = new Text( MathSymbols.EQUAL_TO, {
        font: new PhetFont( options.fontSize )
      } );

      // NumberPicker.dispose not needed, VariablesAccordionBox exists for lifetime of the sim
      assert && assert( variable.range, 'Variable must have range' );
      const valuePicker = new NumberPicker( variable.valueProperty, new Property( variable.range ), {
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

    const hBox = new HBox( {
      children: children,
      spacing: 25,
      maxWidth: contentWidth,
      center: backgroundNode.center
    } );

    const contentNode = new Node( {
      children: [ backgroundNode, hBox ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'VariablesAccordionBox', VariablesAccordionBox );

  return inherit( AccordionBox, VariablesAccordionBox );
} );
