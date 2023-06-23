// Copyright 2017-2023, University of Colorado Boulder

/**
 * Manages a collection of Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
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
        //TODO https://github.com/phetsims/equality-explorer/issues/200 add these options after creating SnapshotIO
        //tandem: options.tandem.createTandem( `snapshot${i}Property` ),
        //phetioValueType: NullableIO( SnapshotIO ),
        //phetioDocumentation: `The snapshot that occupies row ${i} in the Snapshots accordion box. null means no snapshot.`
      } ) );
    }

    this.selectedSnapshotProperty = new Property<Snapshot | null>( null, {

      // a valid snapshot is null or the value of one of the snapshotProperties' values
      isValidValue: snapshot => {
        return ( snapshot === null ) ||
               _.some( this.snapshotProperties, snapshotProperty => ( snapshotProperty.value === snapshot ) );
      }
      //TODO https://github.com/phetsims/equality-explorer/issues/200 add these options after creating SnapshotIO
      //tandem: options.tandem.createTandem( 'selectedSnapshotProperty' ),
      //phetioValueType: NullableIO( SnapshotIO ),
      //phetioDocumentation: 'The snapshot that is selected in the Snapshots accordion box. null means no snapshot is selected.'
    } );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }

  public reset(): void {

    // Reset the selected snapshot.
    this.selectedSnapshotProperty.reset();

    // Dispose of all snapshots.
    for ( let i = 0; i < this.snapshotProperties.length; i++ ) {
      const snapshot = this.snapshotProperties[ i ].value;
      if ( snapshot !== null ) {
        snapshot.dispose();
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

    const selectedSnapshot = this.selectedSnapshotProperty.value;
    assert && assert( selectedSnapshot, 'no selected snapshot' );

    // Clear the selection.
    this.selectedSnapshotProperty.value = null;

    // Clear the Property that corresponds to the selected snapshot.
    const snapshotProperty = _.find( this.snapshotProperties, p => ( p.value === selectedSnapshot ) );
    assert && assert( snapshotProperty );
    snapshotProperty!.value = null;

    // Dispose of the selected snapshot.
    selectedSnapshot!.dispose();
  }
}

equalityExplorer.register( 'SnapshotsCollection', SnapshotsCollection );