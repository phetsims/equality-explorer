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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  // constants
  var ITEM_DIAMETER = 2 * EqualityExplorerConstants.ITEM_HEIGHT;

  /**
   * @constructor
   */
  function SpheresScene() {

    // icons for each Item type
    var greenNode = new ShadedSphereNode( ITEM_DIAMETER, { mainColor: 'green' } );
    var orangeNode = new ShadedSphereNode( ITEM_DIAMETER, { mainColor: 'orange' } );
    var magentaNode = new ShadedSphereNode( ITEM_DIAMETER, { mainColor: 'magenta' } );

    var leftItemCreators = [
      new ItemCreator( 'greenSphere', 3, greenNode ),
      new ItemCreator( 'orangeSphere', 2, orangeNode ),
      new ItemCreator( 'magentaSphere', 1, magentaNode )
    ];

    var rightItemCreators = [
      new ItemCreator( 'greenSphere', 3, greenNode ),
      new ItemCreator( 'orangeSphere', 2, orangeNode ),
      new ItemCreator( 'magentaSphere', 1, magentaNode )
    ];

    BasicsScene.call( this, greenNode, leftItemCreators, rightItemCreators );
  }

  equalityExplorer.register( 'SpheresScene', SpheresScene );

  return inherit( BasicsScene, SpheresScene );
} );
