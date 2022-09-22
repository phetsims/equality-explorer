// Copyright 2017-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Snapshot of a scene, saves state needed to restore the scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import equalityExplorer from '../../equalityExplorer.js';

export default class Snapshot {

  /**
   * @param {EqualityExplorerScene} scene
   */
  constructor( scene ) {

    // @private
    this.scene = scene;
    this.leftPlateSnapshot = new PlateSnapshot( scene.scale.leftPlate );
    this.rightPlateSnapshot = new PlateSnapshot( scene.scale.rightPlate );

    // If the scene has variables, save their values.
    if ( scene.variables ) {

      // @private {number[]} save the current value of each variable
      this.variableValues = _.map( scene.variables, variable => variable.valueProperty.value );
    }
  }

  /**
   * Restores this snapshot.
   * @public
   */
  restore() {

    // dispose of all terms, including those that may be dragging or animating, see #73
    this.scene.disposeAllTerms();

    this.leftPlateSnapshot.restore();
    this.rightPlateSnapshot.restore();

    // If we saved variable values, restore them.
    if ( this.variableValues ) {
      assert && assert( this.variableValues.length === this.scene.variables.length, 'oops, missing variables' );
      for ( let i = 0; i < this.variableValues.length; i++ ) {
        this.scene.variables[ i ].valueProperty.value = this.variableValues[ i ];
      }
    }
  }
}

/**
 * Snapshot of a plate's state.
 */
class PlateSnapshot {

  /**
   * @param {Plate} plate
   */
  constructor( plate ) {

    // @private
    this.termCreators = plate.termCreators;

    // @private {*[]} data structure that describes the terms for each termCreator.
    // Format is specific to Term subtypes. See createSnapshot for each Term subtype.
    this.snapshotDataStructures = [];

    // Create a snapshot data structure for each termCreator.
    for ( let i = 0; i < this.termCreators.length; i++ ) {
      this.snapshotDataStructures[ i ] = this.termCreators[ i ].createSnapshot();
    }
  }

  /**
   * Restores the snapshot for this plate.
   * @public
   */
  restore() {
    assert && assert( this.termCreators.length === this.snapshotDataStructures.length,
      'arrays should have same length' );
    for ( let i = 0; i < this.termCreators.length; i++ ) {
      this.termCreators[ i ].restoreSnapshot( this.snapshotDataStructures[ i ] );
    }
  }
}

equalityExplorer.register( 'Snapshot', Snapshot );