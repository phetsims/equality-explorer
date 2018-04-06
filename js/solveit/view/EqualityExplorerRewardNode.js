// Copyright 2018, University of Colorado Boulder

/**
 * Shows a bunch of objects related to this sim falling.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RewardNode = require( 'VEGAS/RewardNode' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );

  /**
   * @param {number} level - the game level
   * @constructor
   */
  function EqualityExplorerRewardNode( level ) {

    //TODO different objects for different levels?

    RewardNode.call( this, {
      nodes: RewardNode.createRandomNodes( [
        new StarNode(),
        new FaceNode( 40, { headStroke: 'black' } )
      ], 150 /* count */ )
    } );
  }

  equalityExplorer.register( 'EqualityExplorerRewardNode', EqualityExplorerRewardNode );

  return inherit( RewardNode, EqualityExplorerRewardNode );
} );
