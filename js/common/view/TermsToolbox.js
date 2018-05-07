// Copyright 2017-2018, University of Colorado Boulder

/**
 * Toolbox that contains the terms that can be dragged out onto the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TermCreatorNode = require( 'EQUALITY_EXPLORER/common/view/TermCreatorNode' );

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

      // supertype options
      lineWidth: 1,
      cornerRadius: 6
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
