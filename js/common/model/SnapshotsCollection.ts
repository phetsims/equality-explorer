// Copyright 2017-2022, University of Colorado Boulder

/**
 * Manages a collection of Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import equalityExplorer from '../../equalityExplorer.js';
import Snapshot from './Snapshot.js';

type SelfOptions = {
  numberOfSnapshots?: number;
};

type SnapshotsCollectionOptions = SelfOptions;

export default class SnapshotsCollection {

  // a Property for each possible snapshot, null means no snapshot
  public readonly snapshotProperties: Property<Snapshot | null>[];

  // the selected snapshot, null means no selection
  public readonly selectedSnapshotProperty: Property<Snapshot | null>;

  public constructor( providedOptions?: SnapshotsCollectionOptions ) {

    const options = optionize<SnapshotsCollectionOptions, SelfOptions>()( {

      // SelfOptions
      numberOfSnapshots: 5
    }, providedOptions );

    assert && assert( Number.isInteger( options.numberOfSnapshots ) && options.numberOfSnapshots > 0 );

    this.snapshotProperties = [];
    for ( let i = 0; i < options.numberOfSnapshots; i++ ) {
      this.snapshotProperties.push( new Property<Snapshot | null>( null ) );
    }

    this.selectedSnapshotProperty = new Property<Snapshot | null>( null, {

      // a valid snapshot is null or the value of one of the snapshotProperties' values
      isValidValue: snapshot => {
        return ( snapshot === null ) ||
               _.some( this.snapshotProperties, snapshotProperty => ( snapshotProperty.value === snapshot ) );
      }
    } );
  }

  public reset(): void {

    // reset the selected snapshot
    this.selectedSnapshotProperty.reset();

    // delete all snapshots
    for ( let i = 0; i < this.snapshotProperties.length; i++ ) {
      if ( this.snapshotProperties[ i ].value !== null ) {
        this.snapshotProperties[ i ].value = null;
      }
    }
  }

  /**
   * Restores the selected snapshot.
   */
  public restoreSelectedSnapshot(): void {
    const snapshot = this.selectedSnapshotProperty.value!;
    assert && assert( snapshot );
    snapshot.restore();
  }

  /**
   * Deletes the selected snapshot.
   */
  public deleteSelectedSnapshot(): void {

    // clear the selection
    const selectedSnapshot = this.selectedSnapshotProperty.value;
    assert && assert( selectedSnapshot, 'no selected snapshot' );
    this.selectedSnapshotProperty.value = null;

    // find the Property that corresponds to the snapshot and clear it
    for ( let i = 0; i < this.snapshotProperties.length; i++ ) {
      if ( this.snapshotProperties[ i ].value === selectedSnapshot ) {
        this.snapshotProperties[ i ].value = null;
        break;
      }
    }
  }
}

equalityExplorer.register( 'SnapshotsCollection', SnapshotsCollection );