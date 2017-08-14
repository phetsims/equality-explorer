// Copyright 2017, University of Colorado Boulder

/**
 * Panel that contains the items that can be dragged out onto the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreatorNode = require( 'EQUALITY_EXPLORER/common/view/ItemCreatorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {ItemCreator[]} itemCreators
   * @param {WeighingPlatform} weighingPlatform
   * @param {Node} dragLayer
   * @param {Object} [options]
   * @constructor
   */
  function ItemsPanel( itemCreators, weighingPlatform, dragLayer, options ) {

    options = _.extend( {
      lineWidth: 2,
      cornerRadius: 6
    }, options );

    var backgroundNode = new Rectangle( 0, 0, 275, 50 );

    var hBoxChildren = [];
    for ( var i = 0; i < itemCreators.length; i++ ) {
      hBoxChildren.push( new ItemCreatorNode( itemCreators[ i ], weighingPlatform, dragLayer ) );
    }

    var hBox = new HBox( {
      spacing: 50,
      align: 'center',
      children: hBoxChildren,
      center: backgroundNode.center
    } );
    
    var content = new Node( {
      children: [ backgroundNode, hBox ]
    } );

    Panel.call( this, content, options );
  }

  equalityExplorer.register( 'ItemsPanel', ItemsPanel );

  return inherit( Panel, ItemsPanel );
} );
