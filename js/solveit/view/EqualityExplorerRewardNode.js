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
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RewardNode = require( 'VEGAS/RewardNode' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {number} level - the game level
   * @constructor
   */
  function EqualityExplorerRewardNode( level ) {

    //TODO different objects for different levels?

    RewardNode.call( this, {
      nodes: RewardNode.createRandomNodes( [
        new StarNode(),
        new FaceNode( 40, { headStroke: 'black' } ),
        createVariableIcon( level + 1 )
      ], 150 /* count */ )
    } );
  }

  equalityExplorer.register( 'EqualityExplorerRewardNode', EqualityExplorerRewardNode );

  /**
   * Creates an icon for a variable with a specific coefficient.
   * @param {number} coefficient
   * @returns {Node}
   */
  function createVariableIcon( coefficient ) {
    return VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( coefficient ), xString, {
      diameter: 35,
      showOne: true
    } );
  }

  return inherit( RewardNode, EqualityExplorerRewardNode );
} );
