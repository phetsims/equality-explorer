// Copyright 2017-2018, University of Colorado Boulder

/**
 * Toolbox that contains the terms that can be dragged out onto the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const TermCreatorNode = require( 'EQUALITY_EXPLORER/common/view/TermCreatorNode' );

  // constants
  var DEFAULT_CONTENT_SIZE = new Dimension2( 250, 50 );

  /**
   * @param {TermCreator[]} termCreators - creators for terms, appear in this order left-to-right
   * @param {Plate} plate - associated plate on the scale
   * @param {Node} termsLayer - parent for TermNodes that will be created
   * @param {Object} [options]
   * @constructor
   */
  function TermsToolbox( termCreators, plate, termsLayer, options ) {

    options = _.extend( {
      hasNegativeTermsInToolbox: false, // {boolean} if true, put negative terms in the toolbox, e.g. -x
      contentSize: DEFAULT_CONTENT_SIZE,
      spacing: 45, // horizontal space between TermCreatorNodes

      // Panel options
      lineWidth: 1,
      cornerRadius: 6,
      xMargin: 5,
      yMargin: 5
    }, options );

    var backgroundNode = new Rectangle( 0, 0, options.contentSize.width, options.contentSize.height );

    var termCreatorNodes = [];
    for ( var i = 0; i < termCreators.length; i++ ) {

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
      var dx = Math.min( 5, options.spacing ); // determined empirically
      var dy = options.yMargin + ( options.contentSize.height - termCreatorNode.height ) / 2; // height of toolbox
      termCreatorNode.touchArea = termCreatorNode.localBounds.dilatedXY( dx, dy );
    } );

    var hBox = new HBox( {
      spacing: options.spacing,
      align: 'center',
      children: termCreatorNodes,
      center: backgroundNode.center,
      maxWidth: options.contentSize.width,
      maxHeight: options.contentSize.height
    } );

    var content = new Node( {
      children: [ backgroundNode, hBox ]
    } );

    Panel.call( this, content, options );
  }

  equalityExplorer.register( 'TermsToolbox', TermsToolbox );

  return inherit( Panel, TermsToolbox );
} );
