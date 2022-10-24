// Copyright 2017-2022, University of Colorado Boulder

//TODO https://github.com/phetsims/equality-explorer/issues/191 do we need an iO-only Property whose value indicates what the displayed snapshot looks like?
/**
 * Control for taking, displaying and selecting a snapshot.
 * The Snapshots accordion box contains a vertical column of these.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { FireListener, FlowBox, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import cameraSolidShape from '../../../../sherpa/js/fontawesome-5/cameraSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';
import Snapshot from '../model/Snapshot.js';
import EquationNode from './EquationNode.js';
import VariableValuesNode from './VariableValuesNode.js';

// constants
const EQUATION_FONT_SIZE = 22;
const FRACTION_FONT_SIZE = 14;
const SELECTION_RECTANGLE_X_MARGIN = 10;
const SELECTION_RECTANGLE_Y_MARGIN = 8;

type Orientation = 'horizontal' | 'vertical';

type SelfOptions = {
  // whether variable values are visible in snapshots, null if the feature is not supported
  variableValuesVisibleProperty?: Property<boolean> | null;
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

    // rectangle that appears around the snapshot when it's selected
    const selectionRectangle = new Rectangle( 0, 0, options.controlWidth, options.controlHeight, {
      cornerRadius: 3,
      lineWidth: 3,
      stroke: 'transparent'
    } );

    // Placeholders for equation and variable values. These cannot be shared by instances of SnapshotControl,
    // because FlowBox does not support scenery's DAG feature.
    const NO_EQUATION_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder for equation, so bounds are valid
    const NO_VARIABLE_VALUES_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder for variable values, so bounds are valid

    // placeholders, so that snapshotNode has valid bounds
    let equationNode: Node = NO_EQUATION_NODE;
    let variableValuesNode: Node = NO_VARIABLE_VALUES_NODE;

    // parent for the equation and optional display of variable values
    const snapshotNode = new FlowBox( {
      orientation: options.orientation,
      children: [ equationNode ],
      spacing: ( options.orientation === 'horizontal' ) ? 20 : 8,
      center: selectionRectangle.center,
      maxWidth: options.controlWidth - 2 * SELECTION_RECTANGLE_X_MARGIN,
      maxHeight: options.controlHeight - 2 * SELECTION_RECTANGLE_Y_MARGIN,
      pickable: false
    } );

    // snapshot (camera) button
    const snapshotIcon = new Path( cameraSolidShape, {
      scale: 0.037,
      fill: 'black'
    } );
    const snapshotButton = new RectangularPushButton( {
      content: snapshotIcon,
      baseColor: 'white',
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      center: selectionRectangle.center,
      maxWidth: options.controlWidth,
      maxHeight: options.controlHeight,
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

    assert && assert( !options.children, 'SnapshotControl sets children' );
    options.children = [ selectionRectangle, snapshotNode, snapshotButton ];

    super( options );

    // Selects the snapshot associated with this control.
    this.addInputListener( new FireListener( {
      fire: () => {
        if ( snapshotProperty.value ) {
          selectedSnapshotProperty.value = snapshotProperty.value;
        }
      }
    } ) );

    // updates the layout of the snapshot, and centers it in the control
    const updateSnapshotLayout = () => {
      if ( options.variableValuesVisibleProperty && options.variableValuesVisibleProperty.value ) {
        snapshotNode.children = [ equationNode, variableValuesNode ];
      }
      else {
        snapshotNode.children = [ equationNode ];
      }
      snapshotNode.center = selectionRectangle.center;
    };

    // Updates the view when the model changes.
    snapshotProperty.link( snapshot => {

      const hasSnapShot = !!snapshot;

      // either the button or the snapshot is visible
      snapshotButton.visible = !hasSnapShot;
      snapshotNode.visible = hasSnapShot;
      selectionRectangle.visible = hasSnapShot;
      selectionRectangle.cursor = hasSnapShot ? 'pointer' : null;

      if ( hasSnapShot ) {

        // create the equation for the snapshot
        equationNode = new EquationNode( scene.leftTermCreators, scene.rightTermCreators, { //TODO dynamic
          updateEnabled: false, // equation is static
          symbolFontSize: EQUATION_FONT_SIZE,
          operatorFontSize: EQUATION_FONT_SIZE,
          integerFontSize: EQUATION_FONT_SIZE,
          fractionFontSize: FRACTION_FONT_SIZE,
          relationalOperatorFontSize: EQUATION_FONT_SIZE,
          relationalOperatorSpacing: 15,
          pickable: false
        } );

        // optionally show variable values, e.g. '(x = 2)' or '(x = 1, y = 3)'
        if ( scene.variables ) {
          variableValuesNode = new VariableValuesNode( scene.variables, {
            opacity: options.variableValuesOpacity,
            fontSize: EQUATION_FONT_SIZE,
            commaSeparated: options.commaSeparated,

            // de-emphasize variable values by scaling them down,
            // see https://github.com/phetsims/equality-explorer/issues/110
            scale: 0.75
            //TODO https://github.com/phetsims/equality-explorer/issues/191 does VariableValuesNode need to be instrumented?
          } );
        }
      }
      else {

        // no associated snapshot
        equationNode = NO_EQUATION_NODE;
        variableValuesNode = NO_VARIABLE_VALUES_NODE;
      }

      updateSnapshotLayout();
    } );

    // Shows that the associated snapshot has been selected.
    selectedSnapshotProperty.link( selectedSnapshot => {
      const isSelected = ( selectedSnapshot && selectedSnapshot === snapshotProperty.value );
      selectionRectangle.stroke = isSelected ?
                                  EqualityExplorerColors.SNAPSHOT_SELECTED_STROKE :
                                  EqualityExplorerColors.SNAPSHOT_DESELECTED_STROKE;
    } );

    if ( options.variableValuesVisibleProperty ) {

      // Shows/hides variable values. unlink not required.
      options.variableValuesVisibleProperty.link( visible => updateSnapshotLayout() );
    }
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'SnapshotControl', SnapshotControl );