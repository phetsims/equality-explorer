// Copyright 2017-2022, University of Colorado Boulder

/**
 * Accordion box that displays the equation or inequality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import { Text } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import TermCreator from '../model/TermCreator.js';
import EquationPanel from './EquationPanel.js';

type SelfOptions = {

  // this accordion box is designed to be a fixed size, regardless of its content
  fixedWidth?: number;
  fixedHeight?: number;
};

type EquationAccordionBoxOptions = SelfOptions & AccordionBoxOptions;

export default class EquationAccordionBox extends AccordionBox {

  /**
   * @param leftTermCreators - left side of equation
   * @param rightTermCreators - right side of equation
   * @param [providedOptions]
   */
  public constructor( leftTermCreators: TermCreator[], rightTermCreators: TermCreator[], providedOptions?: EquationAccordionBoxOptions ) {

    const accordionBoxOptions = combineOptions<AccordionBoxOptions>( {}, EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {
      showTitleWhenExpanded: false,
      contentXMargin: 8,
      contentYMargin: 4
    } );

    const defaultOptions = optionize<EquationAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {

      // SelfOptions
      fixedWidth: 100,
      fixedHeight: 75
    }, accordionBoxOptions );

    const options = optionize<EquationAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( defaultOptions, providedOptions );

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
    options.titleNode = options.titleNode || new Text( EqualityExplorerStrings.equationOrInequalityStringProperty, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentNode.width
    } );

    super( contentNode, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'EquationAccordionBox', EquationAccordionBox );