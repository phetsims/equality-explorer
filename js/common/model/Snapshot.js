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
    this.leftPlateSnapshot = new PlateSnapshot( scene.scale.leftPlate );
    this.rightPlateSnapshot = new PlateSnapshot( scene.scale.rightPlate );
  }

  equalityExplorer.register( 'Snapshot', Snapshot );

  inherit( Object, Snapshot, {

    // @public
    dispose: function() {
      //TODO implement dispose, if needed
    },

    /**
     * Gets the indices of occupied cells for the left plate.
     * @param {constructor} itemCreatorConstructor - the item creator type, identified by its constructor
     * @returns {number[]}
     */
    getLeftCells: function( itemCreatorConstructor ) {
      return this.leftPlateSnapshot.getOccupiedCells( itemCreatorConstructor );
    },

    /**
     * Gets the indices of occupied cells for the right plate.
     * @param {constructor} itemCreatorConstructor - the item creator type, identified by its constructor
     * @returns {number[]}
     */
    getRightCells: function( itemCreatorConstructor ) {
      return this.rightPlateSnapshot.getOccupiedCells( itemCreatorConstructor );
    }
  } );

  /**
   * Snapshot of a plate's state.
   * This is an ad hoc map: itemCreatorConstructor -> occupiedCells
   *
   * @param {Plate} plate
   * @constructor
   * @private
   */
  function PlateSnapshot( plate ) {

    // @private 
    this.itemCreatorConstructors = []; // {constructor[]} the item creator types, identified by their constructors
    this.occupiedCells = []; // {number[][]} the occupied cells (in the plate's 2D grid) for each item creator type

    var itemCreators = plate.itemCreators;

    // ad hoc map, using parallel arrays
    for ( var i = 0; i < itemCreators.length; i++ ) {

      var itemCreator = itemCreators[ i ];
      var items = itemCreator.getItemsOnScale();

      this.itemCreatorConstructors[ i ] = itemCreator.constructor;

      var indices = []; // {number[]} cell indices
      for ( var j = 0; j < items.length; j++ ) {
        indices.push( plate.getCellForItem( items[ j ] ) );
      }
      this.occupiedCells.push( indices );
    }
    assert && assert( this.itemCreatorConstructors.length === this.occupiedCells.length,
      'arrays must have the same length' );
  }

  equalityExplorer.register( 'Snapshot.PlateSnapshot', PlateSnapshot );

  inherit( Object, PlateSnapshot, {

    /**
     * Gets indices of the occupied cells (in the plate's 2D grid) for a specified type of item creator.
     * @param {AbstractItemCreator} itemCreatorConstructor - the item creator type, identified by its constructor
     * @returns {number[]}
     * @private
     */
    getOccupiedCells: function( itemCreatorConstructor ) {
      var index = this.itemCreatorConstructors.indexOf( itemCreatorConstructor );
      assert && assert( index !== -1, 'item creator type not found' );
      return this.occupiedCells[ index ];
    }
  } );

  return Snapshot;
} );
 