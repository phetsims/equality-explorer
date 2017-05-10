// Copyright 2017, University of Colorado Boulder

/**
 * Creates the model and view for a type of Item.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Item = require( 'EQUALITY_EXPLORER/common/model/Item' );
  var ItemNode = require( 'EQUALITY_EXPLORER/common/view/ItemNode' );

  /**
   * @param {number} value
   * @param {Node} icon
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreator( value, icon, options ) {

    options = _.extend( {
      createItem: defaultCreateItem,
      createItemNode: defaultCreateItemNode
    }, options );

    // @public (read-only)
    this.value = value;
    this.icon = icon;
    this.createItem = options.createItem;
    this.createItemNode = options.createItemNode;
  }

  equalityExplorer.register( 'ItemCreator', ItemCreator );

  /**
   * Creates an Item.
   * @param {number} value
   * @param {Object} [options] - same as Item constructor options
   * @returns {ItemNode}
   */
  var defaultCreateItem = function( value, options ) {
    return new Item( value, options );
  };

  /**
   * Creates an ItemNode for an Item.
   * @param {Item} item
   * @param {Object} [options] - same as ItemNode constructor options
   * @returns {ItemNode}
   */
  var defaultCreateItemNode = function( item, options ) {
    return new ItemNode( item, options );
  };

  return inherit( Object, ItemCreator );
} );
