// Copyright 2017-2023, University of Colorado Boulder

/**
 * Accordion box that displays the equation or inequality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
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

type EquationAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>;

export default class EquationAccordionBox extends AccordionBox {

  /**
   * @param leftTermCreators - left side of equation
   * @param rightTermCreators - right side of equation
   * @param [providedOptions]
   */
  public constructor( leftTermCreators: TermCreator[], rightTermCreators: TermCreator[], providedOptions: EquationAccordionBoxOptions ) {

    const options = optionize4<EquationAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {},
      EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,
        fixedHeight: 75,

        // AccordionBoxOptions
        showTitleWhenExpanded: false,
        contentXMargin: 8,
        contentYMargin: 4
      }, providedOptions );

    options.maxWidth = options.fixedWidth;
    options.maxHeight = options.fixedHeight;

    const contentNode = new EquationPanel( leftTermCreators, rightTermCreators, {
      contentWidth: options.fixedWidth - ( 2 * options.contentXMargin ),
      contentHeight: options.fixedHeight - ( 2 * options.contentYMargin ),
      xMargin: 0,
      yMargin: 0,
      tandem: options.tandem.createTandem( 'contentNode' ),
      phetioVisiblePropertyInstrumented: false
    } );

    options.titleNode = options.titleNode || new Text( EqualityExplorerStrings.equationOrInequalityStringProperty, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentNode.width,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    super( contentNode, options );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

equalityExplorer.register( 'EquationAccordionBox', EquationAccordionBox );