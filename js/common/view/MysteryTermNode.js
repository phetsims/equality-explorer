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

    options = _.extend( {
      xSpacing: 8 //TODO make this a function of icon size
    }, options );

    // All mystery terms are assumed to have a coefficient of 1, so we can show only the icon.
    // We can make this simplification because mystery terms appear only in the 'Basics' screen,
    // where like terms are not combined.
    assert && assert( term.coefficientProperty.value.toDecimal() === 1, 'invalid coefficient' );

    var contentNode = new Image( term.image, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    } );

    var shadowNode = new Image( term.shadow, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER,
      opacity: 0.4
    } );

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );
  }

  equalityExplorer.register( 'MysteryTermNode', MysteryTermNode );

  return inherit( TermNode, MysteryTermNode );
} );