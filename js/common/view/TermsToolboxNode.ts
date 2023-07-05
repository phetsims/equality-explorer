// Copyright 2017-2023, University of Colorado Boulder

/**
 * Toolbox that contains the terms that can be dragged out onto the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { HBox, Node, NodeTranslationOptions, Rectangle } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import equalityExplorer from '../../equalityExplorer.js';
import Plate from '../model/Plate.js';
import TermCreator from '../model/TermCreator.js';
import TermCreatorNode from './TermCreatorNode.js';

// constants
const DEFAULT_CONTENT_SIZE = new Dimension2( 250, 50 );

type SelfOptions = {
  hasNegativeTermsInToolbox?: boolean; // if true, put negative terms in the toolbox, e.g. -x
  contentSize?: Dimension2;
  spacing?: number; // horizontal space between TermCreatorNodes
};

type TermsToolboxOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class TermsToolboxNode extends Panel {

  /**
   * @param termCreators - creators for terms, appear in this order left-to-right
   * @param plate - associated plate on the scale
   * @param termsLayer - parent for TermNodes that will be created
   * @param [providedOptions]
   */
  public constructor( termCreators: TermCreator[], plate: Plate, termsLayer: Node, providedOptions?: TermsToolboxOptions ) {

    const options = optionize<TermsToolboxOptions, SelfOptions, PanelOptions>()( {

      // SelfOptions
      hasNegativeTermsInToolbox: false, // {boolean} if true, put negative terms in the toolbox, e.g. -x
      contentSize: DEFAULT_CONTENT_SIZE,
      spacing: 45, // horizontal space between TermCreatorNodes

      // PanelOptions
      isDisposable: false,
      lineWidth: 1,
      cornerRadius: 6,
      xMargin: 5,
      yMargin: 5,
      phetioVisiblePropertyInstrumented: false // because both toolboxes must remain visible for lock feature
    }, providedOptions );

    const backgroundNode = new Rectangle( 0, 0, options.contentSize.width, options.contentSize.height );

    const termCreatorNodes = [];
    for ( let i = 0; i < termCreators.length; i++ ) {

      const termCreator = termCreators[ i ];
      const termCreatorTandemName = termCreator.tandem.name;

      //TODO https://github.com/phetsims/equality-explorer/issues/191 confirm that TermCreatorNodes should be instrumented, and that these tandem names are appropriate

      // creator for positive terms
      termCreatorNodes.push( new TermCreatorNode( termCreator, plate, termsLayer, {
        tandem: options.hasNegativeTermsInToolbox ?
                options.tandem.createTandem( `${termCreatorTandemName}PositiveNode` ) :
                options.tandem.createTandem( `${termCreatorTandemName}Node` )
      } ) );

      // optional creator for negative terms
      if ( options.hasNegativeTermsInToolbox ) {
        termCreatorNodes.push( new TermCreatorNode( termCreator, plate, termsLayer, {
          sign: -1,
          tandem: options.tandem.createTandem( `${termCreatorTandemName}NegativeNode` )
        } ) );
      }
    }

    // touchAreas
    termCreatorNodes.forEach( termCreatorNode => {
      const dx = Math.min( 5, options.spacing ); // determined empirically
      const dy = options.yMargin + ( options.contentSize.height - termCreatorNode.height ) / 2; // height of toolbox
      termCreatorNode.touchArea = termCreatorNode.localBounds.dilatedXY( dx, dy );
    } );

    const hBox = new HBox( {
      spacing: options.spacing,
      align: 'center',
      children: termCreatorNodes,
      center: backgroundNode.center,
      maxWidth: options.contentSize.width,
      maxHeight: options.contentSize.height
    } );

    const content = new Node( {
      children: [ backgroundNode, hBox ]
    } );

    super( content, options );
  }
}

equalityExplorer.register( 'TermsToolboxNode', TermsToolboxNode );