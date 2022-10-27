// Copyright 2017-2022, University of Colorado Boulder

/**
 * Snapshot of a scene, saves state needed to restore the scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerScene from './EqualityExplorerScene.js';
import Plate from './Plate.js';
import TermCreator, { TermCreatorSnapshot } from './TermCreator.js';

export default class Snapshot {

  private readonly scene: EqualityExplorerScene;
  private readonly leftPlateSnapshot: PlateSnapshot;
  private readonly rightPlateSnapshot: PlateSnapshot;
  private readonly variableValues: number[] | null; // in the order that they appear in scene.variables

  public constructor( scene: EqualityExplorerScene ) {

    this.scene = scene;
    this.leftPlateSnapshot = new PlateSnapshot( scene.scale.leftPlate ); //TODO dynamic
    this.rightPlateSnapshot = new PlateSnapshot( scene.scale.rightPlate ); //TODO dynamic

    // If the scene has variables, save their values, in the order that they appear in scene.variables.
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

    // If we saved variable values, restore them.  Since we saved them in the order that they appear in scene.variables,
    // they must be restored in the same order.
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

  private readonly termCreatorSnapshots: TermCreatorSnapshot[];

  public constructor( plate: Plate ) {

    this.termCreators = plate.termCreators;

    // Save a TermCreatorSnapshot for each TermCreator, in the same order as termCreators.
    this.termCreatorSnapshots = [];
    for ( let i = 0; i < this.termCreators.length; i++ ) {
      this.termCreatorSnapshots[ i ] = this.termCreators[ i ].createSnapshot();
    }
  }

  /**
   * Restores the snapshot for this plate, in the same order that they were saved.
   */
  public restore(): void {
    for ( let i = 0; i < this.termCreators.length; i++ ) {
      this.termCreators[ i ].restoreSnapshot( this.termCreatorSnapshots[ i ] );
    }
  }
}

equalityExplorer.register( 'Snapshot', Snapshot );