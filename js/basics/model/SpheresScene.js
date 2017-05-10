// Copyright 2017, University of Colorado Boulder

/**
 * The 'Spheres' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsScene = require( 'EQUALITY_EXPLORER/basics/model/BasicsScene' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  // constants
  var ITEM_RADIUS = 22;

  /**
   * @constructor
   */
  function SpheresScene() {

    // icons for each Item type
    var greenNode = new ShadedSphereNode( 2 * ITEM_RADIUS, { mainColor: 'green' } );
    var orangeNode = new ShadedSphereNode( 2 * ITEM_RADIUS, { mainColor: 'orange' } );
    var magentaNode = new ShadedSphereNode( 2 * ITEM_RADIUS, { mainColor: 'magenta' } );

    var itemCreators = [
      new ItemCreator( 3, greenNode ),
      new ItemCreator( 2, orangeNode ),
      new ItemCreator( 1, magentaNode )
    ];

    BasicsScene.call( this, greenNode, itemCreators );
  }

  equalityExplorer.register( 'SpheresScene', SpheresScene );

  return inherit( BasicsScene, SpheresScene );
} );
