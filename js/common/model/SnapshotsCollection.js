// Copyright 2017-2020, University of Colorado Boulder

/**
 * Manages a collection of Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import equalityExplorer from '../../equalityExplorer.js';
import Snapshot from './Snapshot.js';

/**
 * @constructor
 */
function SnapshotsCollection( options ) {

  options = merge( {
    numberOfSnapshots: 5
  }, options );

  const self = this;

  // @public {Property.<Snapshot|null>[]} a Property for each possible snapshot, null means no snapshot
  this.snapshotProperties = [];
  for ( let i = 0; i < options.numberOfSnapshots; i++ ) {
    this.snapshotProperties.push( new Property( null, {
      isValidValue: function( snapshot ) {
        return ( snapshot === null ) || ( snapshot instanceof Snapshot );
      }
    } ) );
  }

  // @public {Property.<Snapshot|null>} the selected snapshot, null means no selection
  this.selectedSnapshotProperty = new Property( null, {

    // a valid snapshot is null or the value of one of the snapshotProperties' values
    isValidValue: function( snapshot ) {
      return ( snapshot === null ) ||
             _.some( self.snapshotProperties, function( snapshotProperty ) {
               return ( snapshotProperty.value === snapshot );
             } );
    }
  } );
}

equalityExplorer.register( 'SnapshotsCollection', SnapshotsCollection );

export default inherit( Object, SnapshotsCollection, {

  // @public
  reset: function() {

    // reset the selected snapshot
    this.selectedSnapshotProperty.reset();

    // delete all snapshots
    for ( let i = 0; i < this.snapshotProperties.length; i++ ) {
      if ( this.snapshotProperties[ i ].value !== null ) {
        this.snapshotProperties[ i ].value = null;
      }
    }
  },

  /**
   * Deletes the selected snapshot.
   * @public
   */
  deleteSelectedSnapshot: function() {

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
} );