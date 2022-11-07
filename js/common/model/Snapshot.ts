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
import Variable from './Variable.js';

// A Term's snapshot is a copy of that Term, and where it appeared on the plate.
type TermSnapshot = {
  term: Term; // copy of the Term, which will be used to restore a snapshot
  cell: number; // cell that the Term occupies in the grid associated with a balance-scale plate
};

// A Plate's snapshot is the set of TermSnapshots for each TermCreator associated with the plate.
type PlateSnapshot = Map<TermCreator, TermSnapshot[]>;

// The snapshot for a set of Variables captures the value of each Variable.
type VariablesSnapshot = Map<Variable, number>;

export default class Snapshot {

  private readonly scene: EqualityExplorerScene;

  private readonly leftPlateSnapshot: PlateSnapshot; // Terms on the left plate of the balance scale
  private readonly rightPlateSnapshot: PlateSnapshot; // Terms on the right plate of the balance scale
  private readonly variablesSnapshot: VariablesSnapshot; // Variable values

  public constructor( scene: EqualityExplorerScene ) {

    this.scene = scene;

    // Snapshot of Terms that are on the plates.
    this.leftPlateSnapshot = createPlateSnapshot( scene.scale.leftPlate );
    this.rightPlateSnapshot = createPlateSnapshot( scene.scale.rightPlate );

    // Snapshot of Variable values.
    this.variablesSnapshot = createVariablesSnapshot( scene.variables );
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

    // Restore variable values.
    restoreVariablesSnapshot( this.variablesSnapshot );
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

/**
 * Creates a snapshot for a set of Variables.
 */
function createVariablesSnapshot( variables: Variable[] | null ): VariablesSnapshot {
  const variablesSnapshot = new Map<Variable, number>();
  if ( variables ) {
    variables.forEach( variable => {
      variablesSnapshot.set( variable, variable.valueProperty.value );
    } );
  }
  return variablesSnapshot;
}

/**
 * Restores the snapshot for a set of Variables.
 */
function restoreVariablesSnapshot( variablesSnapshot: VariablesSnapshot ): void {
  variablesSnapshot.forEach( ( value, variable ) => {
    variable.valueProperty.value = value;
  } );
}

equalityExplorer.register( 'Snapshot', Snapshot );