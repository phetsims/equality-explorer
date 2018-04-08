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

  // constants
  var DIAMETER = 40;
  var STAR_NODE = new StarNode( {
    innerRadius: DIAMETER / 4,
    outerRadius: DIAMETER / 2
  } );
  var FACE_NODE = new FaceNode( DIAMETER, {
    headStroke: 'black'
  } );

  /**
   * @param {number} level - the game level
   * @constructor
   */
  function EqualityExplorerRewardNode( level ) {
    RewardNode.call( this, {
      nodes: RewardNode.createRandomNodes( [
        STAR_NODE,
        FACE_NODE,

        // 'x' term with level number as coefficient
        VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( level + 1 ), xString, {
          diameter: DIAMETER,
          showOne: true // show coefficient for '1x'
        } )
      ], 150 /* count */ )
    } );
  }

  equalityExplorer.register( 'EqualityExplorerRewardNode', EqualityExplorerRewardNode );

  return inherit( RewardNode, EqualityExplorerRewardNode );
} );
