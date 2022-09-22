// Copyright 2017-2022, University of Colorado Boulder

/**
 * Snapshot of a scene, saves state needed to restore the scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerScene from './EqualityExplorerScene.js';
import Plate from './Plate.js';
import TermCreator from './TermCreator.js';

export default class Snapshot {

  private readonly scene: EqualityExplorerScene;
  private readonly leftPlateSnapshot: PlateSnapshot;
  private readonly rightPlateSnapshot: PlateSnapshot;
  private readonly variableValues: number[] | null;

  public constructor( scene: EqualityExplorerScene ) {

    this.scene = scene;
    this.leftPlateSnapshot = new PlateSnapshot( scene.scale.leftPlate );
    this.rightPlateSnapshot = new PlateSnapshot( scene.scale.rightPlate );

    // If the scene has variables, save their values.
    if ( scene.variables ) {
      this.variableValues = _.map( scene.variables, variable => variable.valueProperty.value );
    }
    else {
      this.variableValues = null;
    }
  }

  /**
   * Restores this snapshot.
   */
  public restore(): void {

    // dispose of all terms, including those that may be dragging or animating, see #73
    this.scene.disposeAllTerms();

    this.leftPlateSnapshot.restore();
    this.rightPlateSnapshot.restore();

    // If we saved variable values, restore them.
    if ( this.variableValues && this.scene.variables ) {
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

  private readonly termCreators: TermCreator[];

  // Data structure that describes the terms for each termCreator.
  // Format is specific to Term subclasses. See createSnapshot for each Term subclasses.
  //TODO https://github.com/phetsims/equality-explorer/issues/186 any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly snapshotDataStructures: any[];

  public constructor( plate: Plate ) {

    this.termCreators = plate.termCreators;

    // Create a snapshot data structure for each termCreator on the plate.
    this.snapshotDataStructures = [];
    for ( let i = 0; i < this.termCreators.length; i++ ) {
      this.snapshotDataStructures[ i ] = this.termCreators[ i ].createSnapshot();
    }
  }

  /**
   * Restores the snapshot for this plate.
   */
  public restore(): void {
    assert && assert( this.termCreators.length === this.snapshotDataStructures.length,
      'arrays should have same length' );
    for ( let i = 0; i < this.termCreators.length; i++ ) {
      this.termCreators[ i ].restoreSnapshot( this.snapshotDataStructures[ i ] );
    }
  }
}

equalityExplorer.register( 'Snapshot', Snapshot );