// Copyright 2017-2022, University of Colorado Boulder

/**
 * Snapshot of a scene, saves state needed to restore the scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerScene from './EqualityExplorerScene.js';
import Plate from './Plate.js';
import Term from './Term.js';
import TermCreator from './TermCreator.js';

// A Term's snapshot is a copy of that Term, and where it appeared on the plate.
type TermSnapshot = {
  term: Term; // copy of the Term, which will be used to restore a snapshot
  cell: number; // cell that the Term occupies in the grid associated with a balance-scale plate
};

// A Plate's snapshot is the set of TermSnapshots for each TermCreator associated with the plate.
type PlateSnapshot = Map<TermCreator, TermSnapshot[]>;

export default class Snapshot {

  private readonly scene: EqualityExplorerScene;

  private readonly leftPlateSnapshot: PlateSnapshot; // Terms on the left plate of the balance scale
  private readonly rightPlateSnapshot: PlateSnapshot; // Terms on the right plate of the balance scale
  private readonly variableValues: number[] | null; // in the order that they appear in scene.variables

  public constructor( scene: EqualityExplorerScene ) {

    this.scene = scene;

    // Snapshot terms that are on the plates.
    this.leftPlateSnapshot = createPlateSnapshot( scene.scale.leftPlate );
    this.rightPlateSnapshot = createPlateSnapshot( scene.scale.rightPlate );

    // If the scene has variables, save their values, in the order that they appear in scene.variables.
    if ( scene.variables ) {
      this.variableValues = scene.variables.map( variable => variable.valueProperty.value );
    }
    else {
      this.variableValues = null;
    }
  }

  /**
   * Restores this snapshot.
   */
  public restore(): void {

    // Dispose of all terms, including those on the plates, dragging, or animating.
    // See https://github.com/phetsims/equality-explorer/issues/73
    this.scene.disposeAllTerms();

    // Restore terms to the plates.
    restorePlateSnapshot( this.scene.scale.leftPlate, this.leftPlateSnapshot );
    restorePlateSnapshot( this.scene.scale.rightPlate, this.rightPlateSnapshot );

    // If we saved variable values, restore them - in the same order that they were saved.
    if ( this.variableValues && this.scene.variables ) {
      assert && assert( this.variableValues.length === this.scene.variables.length, 'oops, missing variables' );
      for ( let i = 0; i < this.variableValues.length; i++ ) {
        this.scene.variables[ i ].valueProperty.value = this.variableValues[ i ];
      }
    }
  }

  /**
   * Disposes this snapshot.
   */
  public dispose(): void {
    disposePlateSnapshot( this.leftPlateSnapshot );
    disposePlateSnapshot( this.rightPlateSnapshot );
  }
}

/**
 * Creates the snapshot for a plate.
 */
function createPlateSnapshot( plate: Plate ): PlateSnapshot {
  const plateSnapshot = new Map<TermCreator, TermSnapshot[]>();
  plate.termCreators.forEach( termCreator => {
    const termSnapshots = termCreator.getTermsOnPlate().map( term => {
      return {
        term: term.copy(),
        cell: plate.getCellForTerm( term )!
      };
    } );
    plateSnapshot.set( termCreator, termSnapshots );
  } );
  assert && assert( plateSnapshot.size === plate.termCreators.length );
  return plateSnapshot;
}

/**
 * Restores the snapshot for a plate. Note that this needs to put a COPY of each Term onto the plate, because terms
 * on the plate may be disposed via the Clear button, and we don't want the snapshot Terms to be affected.
 */
function restorePlateSnapshot( plate: Plate, plateSnapshot: PlateSnapshot ): void {
  assert && assert( plateSnapshot.size === plate.termCreators.length );
  plate.termCreators.forEach( termCreator => {
    termCreator.disposeAllTerms();
    const termSnapshots = plateSnapshot.get( termCreator )!;
    assert && assert( termSnapshots );
    termSnapshots.forEach( termSnapshot => termCreator.putTermOnPlate( termSnapshot.term.copy(), termSnapshot.cell ) );
  } );
}

/**
 * Disposes of the snapshot for a plate, including all Terms that make up that snapshot.
 * @param plateSnapshot
 */
function disposePlateSnapshot( plateSnapshot: PlateSnapshot ): void {
  plateSnapshot.forEach( termSnapshots => termSnapshots.forEach(
    termSnapshot => termSnapshot.term.dispose()
  ) );
}

equalityExplorer.register( 'Snapshot', Snapshot );