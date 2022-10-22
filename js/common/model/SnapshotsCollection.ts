// Copyright 2017-2022, University of Colorado Boulder

/**
 * Manages a collection of Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import equalityExplorer from '../../equalityExplorer.js';
import Snapshot from './Snapshot.js';

type SelfOptions = {
  numberOfSnapshots?: number;
};

type SnapshotsCollectionOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SnapshotsCollection extends PhetioObject {

  // a Property for each possible snapshot, null means no snapshot
  public readonly snapshotProperties: Property<Snapshot | null>[];

  // the selected snapshot, null means no selection
  public readonly selectedSnapshotProperty: Property<Snapshot | null>;

  public constructor( providedOptions: SnapshotsCollectionOptions ) {

    const options = optionize<SnapshotsCollectionOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      numberOfSnapshots: 5,

      // PhetioObjectOptions
      phetioState: false,
      phetioDocumentation: 'Collection of snapshots that appear in the Snapshots accordion box'
    }, providedOptions );

    assert && assert( Number.isInteger( options.numberOfSnapshots ) && options.numberOfSnapshots > 0 );

    super( options );

    this.snapshotProperties = [];
    for ( let i = 0; i < options.numberOfSnapshots; i++ ) {
      this.snapshotProperties.push( new Property<Snapshot | null>( null, {
        //TODO tandem: options.tandem.createTandem( `snapshot${i}Property` ),
        //TODO phetioValueType: NullableIO( SnapshotIO ),
        //TODO phetioDocumentation: `The snapshot that occupies row ${i} in the Snapshots accordion box. null means no snapshot.`
      } ) );
    }

    this.selectedSnapshotProperty = new Property<Snapshot | null>( null, {

      // a valid snapshot is null or the value of one of the snapshotProperties' values
      isValidValue: snapshot => {
        return ( snapshot === null ) ||
               _.some( this.snapshotProperties, snapshotProperty => ( snapshotProperty.value === snapshot ) );
      }
      //TODO tandem: options.tandem.createTandem( 'selectedSnapshotProperty' ),
      //TODO phetioValueType: NullableIO( SnapshotIO ),
      //TODO phetioDocumentation: 'The snapshot that is selected in the Snapshots accordion box. null means no snapshot is selected.'
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