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
    this.scale = scene.scale;
    this.leftPlateSnapshot = new PlateSnapshot( scene.scale.leftPlate );
    this.rightPlateSnapshot = new PlateSnapshot( scene.scale.rightPlate );
  }

  equalityExplorer.register( 'Snapshot', Snapshot );

  inherit( Object, Snapshot, {

    /**
     * Restores this snapshot.
     * @public
     */
    restore: function() {
      this.scale.clear();
      this.leftPlateSnapshot.restore();
      this.rightPlateSnapshot.restore();
    }
  } );

  /**
   * Snapshot of a plate's state.
   * This is an ad hoc map: itemCreator -> occupiedCells
   *
   * @param {Plate} plate
   * @constructor
   * @private
   */
  function PlateSnapshot( plate ) {

    // @private
    this.plate = plate;
    this.itemCreators = []; // {AbstractItemCreator[]}
    this.occupiedCells = []; // {number[][]} the occupied cells (in the plate's 2D grid) for each item creator

    var itemCreators = plate.itemCreators;

    // ad hoc map, using parallel arrays
    for ( var i = 0; i < itemCreators.length; i++ ) {

      var itemCreator = itemCreators[ i ];
      var items = itemCreator.getItemsOnScale();

      this.itemCreators[ i ] = itemCreator;

      var indices = []; // {number[]} cell indices
      for ( var j = 0; j < items.length; j++ ) {
        indices.push( plate.getCellForItem( items[ j ] ) );
      }
      this.occupiedCells.push( indices );
    }
    assert && assert( this.itemCreators.length === this.occupiedCells.length,
      'arrays must have the same length' );
  }

  equalityExplorer.register( 'Snapshot.PlateSnapshot', PlateSnapshot );

  inherit( Object, PlateSnapshot, {

    /**
     * Restores the snapshot for this plate.
     * @public
     */
    restore: function() {

      // for each type of item ...
      for ( var i = 0; i < this.itemCreators.length; i++ ) {

        var itemCreator = this.itemCreators[ i ];
        var occupiedCells = this.occupiedCells[ i ];

        // for each cell that was occupied by this type of item, create an item and put it on the scale in the cell
        for ( var j = 0; j < occupiedCells.length; j++ ) {
          itemCreator.createItemOnScale( occupiedCells[ j ] );
        }
      }
    }
  } );

  return Snapshot;
} );
 