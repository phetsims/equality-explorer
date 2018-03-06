// Copyright 2018, University of Colorado Boulder

/**
 * Displays a mystery term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );

  /**
   * @param {MysteryTermCreator} termCreator
   * @param {MysteryTerm} term
   * @param {Plate} plate
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTermNode( termCreator, term, plate, options ) {

    var contentNode = MysteryTermNode.createIcon( term.mysteryObject.image, {
      maxHeight: term.diameter
    } );

    var shadowNode = new Image( term.mysteryObject.shadow, {
      maxHeight: term.diameter,
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );
  }

  equalityExplorer.register( 'MysteryTermNode', MysteryTermNode );

  return inherit( TermNode, MysteryTermNode, {}, {

    /**
     * Creates an icon for mystery terms.
     * @param {HTMLImageElement} image
     * @param {Object} [options] - see MysteryTermNode
     * @public
     * @static
     */
    createIcon: function( image, options ) {

      options = _.extend( {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      }, options );

      return new Image( image, options );
    }
  } );
} );