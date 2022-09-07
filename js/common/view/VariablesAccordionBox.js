// Copyright 2017-2022, University of Colorado Boulder

/**
 * Accordion box that allows the student to modify the value of one or more variables.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import VariableNode from './VariableNode.js';

class VariablesAccordionBox extends AccordionBox {

  /**
   * @param {Variable[]} variables - the variables that appear in this accordion box
   * @param {Object} [options]
   */
  constructor( variables, options ) {

    options = merge( {}, EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {

      // this accordion box is designed to be a fixed size, regardless of its content
      titleString: ( variables.length > 1 ) ? EqualityExplorerStrings.variables : EqualityExplorerStrings.variable,
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
    variables.forEach( variable => {

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

    super( contentNode, options );
  }
}

equalityExplorer.register( 'VariablesAccordionBox', VariablesAccordionBox );

export default VariablesAccordionBox;