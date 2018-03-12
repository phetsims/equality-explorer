// Copyright 2017-2018, University of Colorado Boulder

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
   *
   * @param {Plate} plate
   * @constructor
   * @private
   */
  function PlateSnapshot( plate ) {

    // @private
    this.termCreators = plate.termCreators;

    // @private {*[]} data structure that describes the terms for each termCreator.
    // Format is specific to TermCreator subtype. See createSnapshot for each TermCreator subtype.
    this.snapshotDataStructures = [];

    // Create a snapshot data structure for each termCreator
    for ( var i = 0; i < this.termCreators.length; i++ ) {
      this.snapshotDataStructures[ i ] = this.termCreators[ i ].createSnapshot();
    }
  }

  equalityExplorer.register( 'Snapshot.PlateSnapshot', PlateSnapshot );

  inherit( Object, PlateSnapshot, {

    /**
     * Restores the snapshot for this plate.
     * @public
     */
    restore: function() {
      assert && assert( this.termCreators.length === this.snapshotDataStructures.length,
        'arrays should have same length' );
      for ( var i = 0; i < this.termCreators.length; i++ ) {
        this.termCreators[ i ].restoreSnapshot( this.snapshotDataStructures[ i ] );
      }
    }
  } );

  return Snapshot;
} );
 