// Copyright 2017-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Manages a collection of Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import equalityExplorer from '../../equalityExplorer.js';
import Snapshot from './Snapshot.js';

export default class SnapshotsCollection {

  constructor( options ) {

    options = merge( {
      numberOfSnapshots: 5
    }, options );

    // @public {Property.<Snapshot|null>[]} a Property for each possible snapshot, null means no snapshot
    this.snapshotProperties = [];
    for ( let i = 0; i < options.numberOfSnapshots; i++ ) {
      this.snapshotProperties.push( new Property( null, {
        isValidValue: snapshot => ( snapshot === null ) || ( snapshot instanceof Snapshot )
      } ) );
    }

    // @public {Property.<Snapshot|null>} the selected snapshot, null means no selection
    this.selectedSnapshotProperty = new Property( null, {

      // a valid snapshot is null or the value of one of the snapshotProperties' values
      isValidValue: snapshot => {
        return ( snapshot === null ) ||
               _.some( this.snapshotProperties, snapshotProperty => ( snapshotProperty.value === snapshot ) );
      }
    } );
  }

  // @public
  reset() {

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
   * Deletes the selected snapshot.
   * @public
   */
  deleteSelectedSnapshot() {

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