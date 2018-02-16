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
   * This is an ad hoc map: termCreator -> occupiedCells
   *
   * @param {Plate} plate
   * @constructor
   * @private
   */
  function PlateSnapshot( plate ) {

    // @private
    this.plate = plate;
    this.termCreators = []; // {AbstractTermCreator[]}
    this.occupiedCells = []; // {number[][]} the occupied cells (in the plate's 2D grid) for each term creator

    var termCreators = plate.termCreators;

    // ad hoc map, using parallel arrays
    for ( var i = 0; i < termCreators.length; i++ ) {

      var termCreator = termCreators[ i ];
      var terms = termCreator.getTermsOnScale();

      this.termCreators[ i ] = termCreator;

      var indices = []; // {number[]} cell indices
      for ( var j = 0; j < terms.length; j++ ) {
        indices.push( plate.getCellForTerm( terms[ j ] ) );
      }
      this.occupiedCells.push( indices );
    }
    assert && assert( this.termCreators.length === this.occupiedCells.length,
      'arrays must have the same length' );
  }

  equalityExplorer.register( 'Snapshot.PlateSnapshot', PlateSnapshot );

  inherit( Object, PlateSnapshot, {

    /**
     * Restores the snapshot for this plate.
     * @public
     */
    restore: function() {

      // for each type of term ...
      for ( var i = 0; i < this.termCreators.length; i++ ) {

        var termCreator = this.termCreators[ i ];
        var occupiedCells = this.occupiedCells[ i ];

        // for each cell that was occupied by this type of term, create a term and put it on the scale in the cell
        for ( var j = 0; j < occupiedCells.length; j++ ) {
          termCreator.createTermOnScale( occupiedCells[ j ] );
        }
      }
    }
  } );

  return Snapshot;
} );
 