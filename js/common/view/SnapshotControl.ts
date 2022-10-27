// Copyright 2017-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/equality-explorer/issues/191 do we need an iO-only Property whose value indicates what the displayed snapshot looks like?
/**
 * Control for taking, displaying and selecting a snapshot.
 * The Snapshots accordion box contains a vertical column of these.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { FireListener, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';
import Snapshot from '../model/Snapshot.js';
import SnapshotNode from './SnapshotNode.js';
import CameraButton from '../../../../scenery-phet/js/buttons/CameraButton.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type Orientation = 'horizontal' | 'vertical';

type SelfOptions = {
  // whether variable values are visible in snapshots, null if the feature is not supported
  variableValuesVisibleProperty?: TReadOnlyProperty<boolean> | null;
  controlWidth?: number;
  controlHeight?: number;
  orientation?: Orientation; // layout of the equation and variable values
  commaSeparated?: boolean; // are variable values separated by commas?
  variableValuesOpacity?: number; // [0,1], see https://github.com/phetsims/equality-explorer/issues/113
};

export type SnapshotControlOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SnapshotControl extends Node {

  /**
   * @param scene - the scene that we'll be taking a snapshot of
   * @param snapshotProperty - snapshot associated with this control, null if no snapshot
   * @param selectedSnapshotProperty - the selected snapshot, null if no selection
   * @param [providedOptions]
   */
  public constructor( scene: EqualityExplorerScene,
                      snapshotProperty: Property<Snapshot | null>,
                      selectedSnapshotProperty: Property<Snapshot | null>,
                      providedOptions: SnapshotControlOptions ) {

    const options = optionize<SnapshotControlOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      variableValuesVisibleProperty: null,
      controlWidth: 100,
      controlHeight: 50,
      orientation: 'horizontal',
      commaSeparated: true,
      variableValuesOpacity: 1
    }, providedOptions );

    assert && assert( options.variableValuesOpacity >= 0 && options.variableValuesOpacity <= 1,
      `invalid variableValuesOpacity: ${options.variableValuesOpacity}` );

    // Shows the equation and optional variable values for the snapshot
    const snapshotNode = new SnapshotNode( snapshotProperty, scene, {
      commaSeparated: options.commaSeparated,
      variableValuesOpacity: options.variableValuesOpacity,
      variableValuesVisibleProperty: options.variableValuesVisibleProperty,
      orientation: options.orientation,
      maxWidth: options.controlWidth - 20,
      maxHeight: options.controlHeight - 16,
      tandem: options.tandem.createTandem( 'snapshotNode' )
    } );

    // rectangle that appears around the snapshot when it's selected
    const selectionRectangle = new Rectangle( 0, 0, options.controlWidth, options.controlHeight, {
      visibleProperty: snapshotNode.visibleProperty,
      cornerRadius: 3,
      lineWidth: 3,
      stroke: 'transparent',
      cursor: 'pointer'
    } );

    // Center the snapshot in the selection rectangle.
    snapshotNode.boundsProperty.link( bounds => {
      snapshotNode.center = selectionRectangle.center;
    } );

    // snapshot (camera) button
    const snapshotButton = new CameraButton( {
      visibleProperty: DerivedProperty.not( snapshotNode.visibleProperty ),
      baseColor: 'white',
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      maxWidth: options.controlWidth,
      maxHeight: options.controlHeight,
      center: selectionRectangle.center,
      listener: () => {
        assert && assert( !snapshotProperty.value, 'snapshot is already occupied' );
        const snapshot = new Snapshot( scene );
        snapshotProperty.value = snapshot; // associate the snapshot with this control
        selectedSnapshotProperty.value = snapshot; // select the created snapshot
      },
      tandem: options.tandem.createTandem( 'snapshotButton' ),
      phetioEnabledPropertyInstrumented: false,
      visiblePropertyOptions: { phetioReadOnly: true } // so that PhET-iO client can see whether its visible
    } );

    options.children = [ selectionRectangle, snapshotNode, snapshotButton ];

    super( options );

    // Selects the snapshot associated with this control.
    selectionRectangle.addInputListener( new FireListener( {
      fire: () => {
        if ( snapshotProperty.value ) {
          selectedSnapshotProperty.value = snapshotProperty.value;
        }
      },
      tandem: options.tandem.createTandem( 'fireListener' )
    } ) );

    // Shows that the associated snapshot has been selected.
    selectedSnapshotProperty.link( selectedSnapshot => {
      const isSelected = ( selectedSnapshot && selectedSnapshot === snapshotProperty.value );
      selectionRectangle.stroke = isSelected ?
                                  EqualityExplorerColors.SNAPSHOT_SELECTED_STROKE :
                                  EqualityExplorerColors.SNAPSHOT_DESELECTED_STROKE;
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'SnapshotControl', SnapshotControl );