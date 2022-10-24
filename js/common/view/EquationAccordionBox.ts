// Copyright 2017-2022, University of Colorado Boulder

/**
 * Accordion box that displays the equation or inequality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { NodeTranslationOptions, Text } from '../../../../scenery/js/imports.js';
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

//TODO narrow AccordionBoxOptions to PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>
type EquationAccordionBoxOptions = SelfOptions & NodeTranslationOptions & StrictOmit<AccordionBoxOptions, 'maxWidth' | 'maxHeight' | 'titleNode'>;

export default class EquationAccordionBox extends AccordionBox {

  /**
   * @param leftTermCreators - left side of equation
   * @param rightTermCreators - right side of equation
   * @param [providedOptions]
   */
  public constructor( leftTermCreators: TermCreator[], rightTermCreators: TermCreator[], providedOptions: EquationAccordionBoxOptions ) {

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

    options.maxWidth = options.fixedWidth;
    options.maxHeight = options.fixedHeight;

    const contentNode = new EquationPanel( leftTermCreators, rightTermCreators, {
      contentWidth: options.fixedWidth - ( 2 * options.contentXMargin ),
      contentHeight: options.fixedHeight - ( 2 * options.contentYMargin ),
      xMargin: 0,
      yMargin: 0
      //TODO confirm that nothing in contentNode should be instrumented
    } );

    options.titleNode = options.titleNode || new Text( EqualityExplorerStrings.equationOrInequalityStringProperty, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentNode.width,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    super( contentNode, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'EquationAccordionBox', EquationAccordionBox );