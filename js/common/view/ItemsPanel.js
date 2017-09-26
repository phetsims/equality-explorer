// Copyright 2017, University of Colorado Boulder

/**
 * Panel that contains the items that can be dragged out onto the scale.
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
  var ItemCreatorNode = require( 'EQUALITY_EXPLORER/common/view/ItemCreatorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var CONTENT_SIZE = new Dimension2( 250, 50 );

  /**
   * @param {ItemCreator[]} itemCreators
   * @param {Plate} plate
   * @param {Node} itemsLayer
   * @param {Object} [options]
   * @constructor
   */
  function ItemsPanel( itemCreators, plate, itemsLayer, options ) {

    options = _.extend( {
      
      spacing: 45, // horizontal space between ItemCreatorNodes

      // supertype options
      lineWidth: 2,
      cornerRadius: 6
    }, options );

    var backgroundNode = new Rectangle( 0, 0, CONTENT_SIZE.width, CONTENT_SIZE.height );

    var itemCreatorNodes = [];
    for ( var i = 0; i < itemCreators.length; i++ ) {
      itemCreatorNodes.push( new ItemCreatorNode( itemCreators[ i ], plate, itemsLayer ) );
    }

    var hBox = new HBox( {
      spacing: options.spacing,
      align: 'center',
      children: itemCreatorNodes,
      center: backgroundNode.center,
      maxWidth: CONTENT_SIZE.width,
      maxHeight: CONTENT_SIZE.height
    } );

    var content = new Node( {
      children: [ backgroundNode, hBox ]
    } );

    Panel.call( this, content, options );
  }

  equalityExplorer.register( 'ItemsPanel', ItemsPanel );

  return inherit( Panel, ItemsPanel );
} );
