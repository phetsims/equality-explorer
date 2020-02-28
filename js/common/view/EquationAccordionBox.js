// Copyright 2017-2020, University of Colorado Boulder

/**
 * Accordion box that displays the equation or inequality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import equalityExplorerStrings from '../../equality-explorer-strings.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import EquationPanel from './EquationPanel.js';

const equationOrInequalityString = equalityExplorerStrings.equationOrInequality;

/**
 * @param {TermCreator[]} leftTermCreators - left side of equation
 * @param {TermCreator[]} rightTermCreators - right side of equation
 * @param {Object} [options]
 * @constructor
 */
function EquationAccordionBox( leftTermCreators, rightTermCreators, options ) {

  options = merge( {}, EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {

    // this accordion box is designed to be a fixed size, regardless of its content
    fixedWidth: 100,
    fixedHeight: 75,

    // AccordionBox options
    showTitleWhenExpanded: false,
    contentXMargin: 8,
    contentYMargin: 4

  }, options );

  assert && assert( options.maxWidth === undefined, 'EquationAccordionBox sets maxWidth' );
  options.maxWidth = options.fixedWidth;
  assert && assert( options.maxHeight === undefined, 'EquationAccordionBox sets maxHeight' );
  options.maxHeight = options.fixedHeight;

  const contentNode = new EquationPanel( leftTermCreators, rightTermCreators, {
    contentWidth: options.fixedWidth - ( 2 * options.contentXMargin ),
    contentHeight: options.fixedHeight - ( 2 * options.contentYMargin ),
    xMargin: 0,
    yMargin: 0
  } );

  assert && assert( !options.titleNode, 'EquationAccordionBox sets titleNode' );
  options.titleNode = options.titleNode || new Text( equationOrInequalityString, {
    font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
    maxWidth: 0.85 * contentNode.width
  } );

  AccordionBox.call( this, contentNode, options );
}

equalityExplorer.register( 'EquationAccordionBox', EquationAccordionBox );

inherit( AccordionBox, EquationAccordionBox );
export default EquationAccordionBox;