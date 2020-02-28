// Copyright 2017-2020, University of Colorado Boulder

/**
 * Toolbox that contains the terms that can be dragged out onto the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Panel from '../../../../sun/js/Panel.js';
import equalityExplorer from '../../equalityExplorer.js';
import TermCreatorNode from './TermCreatorNode.js';

// constants
const DEFAULT_CONTENT_SIZE = new Dimension2( 250, 50 );

/**
 * @param {TermCreator[]} termCreators - creators for terms, appear in this order left-to-right
 * @param {Plate} plate - associated plate on the scale
 * @param {Node} termsLayer - parent for TermNodes that will be created
 * @param {Object} [options]
 * @constructor
 */
function TermsToolbox( termCreators, plate, termsLayer, options ) {

  options = merge( {
    hasNegativeTermsInToolbox: false, // {boolean} if true, put negative terms in the toolbox, e.g. -x
    contentSize: DEFAULT_CONTENT_SIZE,
    spacing: 45, // horizontal space between TermCreatorNodes

    // Panel options
    lineWidth: 1,
    cornerRadius: 6,
    xMargin: 5,
    yMargin: 5
  }, options );

  const backgroundNode = new Rectangle( 0, 0, options.contentSize.width, options.contentSize.height );

  const termCreatorNodes = [];
  for ( let i = 0; i < termCreators.length; i++ ) {

    // creator for positive terms
    termCreatorNodes.push( new TermCreatorNode( termCreators[ i ], plate, termsLayer ) );

    // optional creator for negative terms
    if ( options.hasNegativeTermsInToolbox ) {
      termCreatorNodes.push( new TermCreatorNode( termCreators[ i ], plate, termsLayer, {
        sign: -1
      } ) );
    }
  }

  // touchAreas
  termCreatorNodes.forEach( function( termCreatorNode ) {
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

  Panel.call( this, content, options );
}

equalityExplorer.register( 'TermsToolbox', TermsToolbox );

inherit( Panel, TermsToolbox );
export default TermsToolbox;