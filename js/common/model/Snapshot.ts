// Copyright 2017-2022, University of Colorado Boulder

/**
 * Snapshot of a scene, saves state needed to restore the scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerScene from './EqualityExplorerScene.js';
import { PlateSnapshot } from './Plate.js';

export default class Snapshot {

  private readonly scene: EqualityExplorerScene;

  private readonly leftPlateSnapshot: PlateSnapshot; // terms on the left plate of the balance scale
  private readonly rightPlateSnapshot: PlateSnapshot; // terms on the right plate of the balance scale
  private readonly variableValues: number[] | null; // in the order that they appear in scene.variables

  public constructor( scene: EqualityExplorerScene ) {

    this.scene = scene;

    // Save terms that are on the plates.
    this.leftPlateSnapshot = scene.scale.leftPlate.createSnapshot();
    this.rightPlateSnapshot = scene.scale.rightPlate.createSnapshot();

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

    // dispose of all terms, including those that may be dragging or animating,
    // see https://github.com/phetsims/equality-explorer/issues/#73
    this.scene.disposeAllTerms();

    // Restore terms to the plates.
    this.scene.scale.leftPlate.restoreSnapshot( this.leftPlateSnapshot );
    this.scene.scale.rightPlate.restoreSnapshot( this.rightPlateSnapshot );

    // If we saved variable values, restore them.
    // Since we saved them in the order that they appear in scene.variables, they must be restored in the same order.
    if ( this.variableValues && this.scene.variables ) {
      assert && assert( this.variableValues.length === this.scene.variables.length, 'oops, missing variables' );
      for ( let i = 0; i < this.variableValues.length; i++ ) {
        this.scene.variables[ i ].valueProperty.value = this.variableValues[ i ];
      }
    }
  }
}

equalityExplorer.register( 'Snapshot', Snapshot );