// Copyright 2017, University of Colorado Boulder

/**
 * Base type for snapshot of a scene, saves state needed to restore the scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Scene} scene
   * @constructor
   */
  function Snapshot( scene ) {

    // @private
    this.leftData = new PlateSnapshot( scene.scale.leftPlate );
    this.rightData = new PlateSnapshot( scene.scale.rightPlate );
  }

  equalityExplorer.register( 'Snapshot', Snapshot );

  inherit( Object, Snapshot, {

    // @public
    dispose: function() {
      //TODO implement dispose
    },

    // @public
    getLeftNumberOfItems: function( itemCreatorConstructor ) {
      return this.leftData.getNumberOfItems( itemCreatorConstructor );
    },

    // @public
    getRightNumberOfItems: function( itemCreatorConstructor ) {
      return this.rightData.getNumberOfItems( itemCreatorConstructor );
    },

    // @public
    getLeftCells: function( itemCreatorConstructor ) {
      return this.leftData.getCells( itemCreatorConstructor );
    },

    // @public
    getRightCells: function( itemCreatorConstructor ) {
      return this.rightData.getCells( itemCreatorConstructor );
    }
  } );

  /**
   * Snapshot data for a plate.
   * @param {Plate} plate
   * @constructor
   * @private
   */
  function PlateSnapshot( plate ) {

    // @private 
    this.itemCreatorConstructors = []; // {constructor[]} the item types
    this.counts = []; // {number[]} the number of items for each item type
    this.cells = []; // {number[][]} the occupied cells for each item type

    var itemCreators = plate.itemCreators;
    
    for ( var i = 0; i < itemCreators.length; i++ ) {

      var itemCreator = itemCreators[ i ];
      var items = itemCreator.getItemsOnScale();

      this.itemCreatorConstructors[ i ] = itemCreator.constructor;
      this.counts[ i ] = itemCreator.getNumberOfItemsOnScale();

      var indices = []; // {number[]}
      for ( var j = 0; j < items.length; j++ ) {
        indices.push( plate.getCellForItem( items[ j ] ) );
      }
      this.cells.push( indices );
    }
    assert && assert( this.itemCreatorConstructors.length === this.counts.length && this.counts.length === this.cells.length,
      'all arrays must have the same length' );
  }

  equalityExplorer.register( 'Snapshot.PlateSnapshot', PlateSnapshot );

  inherit( Object, PlateSnapshot, {

    /**
     * Gets the number of items for a specified type of item creator.
     * @param {AbstractItemCreator} itemCreatorConstructor
     * @returns {number}
     * @private
     */
    getNumberOfItems: function( itemCreatorConstructor ) {
      var index = this.itemCreatorConstructors.indexOf( itemCreatorConstructor );
      assert && assert( index !== -1, 'item creator type not found' );
      return this.counts[ index ];
    },

    /**
     * Gets the occupied cell indices for a specified type of item creator.
     * @param {AbstractItemCreator} itemCreatorConstructor
     * @returns {number[]}
     * @private
     */
    getCells: function( itemCreatorConstructor ) {
      var index = this.itemCreatorConstructors.indexOf( itemCreatorConstructor );
      assert && assert( index !== -1, 'item creator type not found' );
      return this.cells[ index ];
    }
  } );

  return Snapshot;
} );
 