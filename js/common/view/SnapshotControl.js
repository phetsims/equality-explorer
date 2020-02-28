// Copyright 2017-2020, University of Colorado Boulder

/**
 * Control for taking, displaying and selecting a snapshot.
 * The Snapshots accordion box contains a vertical column of these.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import DownUpListener from '../../../../scenery/js/input/DownUpListener.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import Snapshot from '../model/Snapshot.js';
import EquationNode from './EquationNode.js';
import VariableValuesNode from './VariableValuesNode.js';

// constants
const NO_EQUATION_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder for equation, so bounds are valid
const NO_VARIABLE_VALUES_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder for variable values, so bounds are valid
const EQUATION_FONT_SIZE = 22;
const FRACTION_FONT_SIZE = 14;
const SELECTION_RECTANGLE_X_MARGIN = 10;
const SELECTION_RECTANGLE_Y_MARGIN = 8;
const VALID_ORIENTATION_VALUES = [ 'horizontal', 'vertical' ];

/**
 * @param {EqualityExplorerScene} scene - the scene that we'll be taking a snapshot of
 * @param {Property.<Snapshot|null>} snapshotProperty - snapshot associated with this control, null if no snapshot
 * @param {Property.<Snapshot|null>} selectedSnapshotProperty - the selected snapshot, null if no selection
 * @param {Object} [options]
 * @constructor
 */
function SnapshotControl( scene, snapshotProperty, selectedSnapshotProperty, options ) {

  const self = this;

  options = merge( {

    // {BooleanProperty|null} whether variable values are visible in snapshots, null if the feature is not supported
    variableValuesVisibleProperty: null,
    controlWidth: 100,
    controlHeight: 50,
    orientation: 'horizontal', // layout of the equation and variable values, see VALID_ORIENTATION_VALUES
    commaSeparated: true, // are variable values separated by commas?
    variableValuesOpacity: 1 // [0,1], see https://github.com/phetsims/equality-explorer/issues/113
  }, options );

  assert && assert( _.includes( VALID_ORIENTATION_VALUES, options.orientation ),
    'invalid orientation: ' + options.orientation );
  assert && assert( options.variableValuesOpacity >= 0 && options.variableValuesOpacity <= 1,
    'invalid variableValuesOpacity: ' + options.variableValuesOpacity );

  // rectangle that appears around the snapshot when it's selected
  const selectionRectangle = new Rectangle( 0, 0, options.controlWidth, options.controlHeight, {
    cornerRadius: 3,
    lineWidth: 3,
    stroke: 'transparent'
  } );

  // placeholders, so that snapshotNode has valid bounds
  let equationNode = NO_EQUATION_NODE;
  let variableValuesNode = NO_VARIABLE_VALUES_NODE;

  // parent for the equation and optional display of variable values
  const snapshotNode = new LayoutBox( {
    orientation: options.orientation,
    children: [ equationNode ],
    spacing: ( options.orientation === 'horizontal' ) ? 20 : 8,
    center: selectionRectangle.center,
    maxWidth: options.controlWidth - 2 * SELECTION_RECTANGLE_X_MARGIN,
    maxHeight: options.controlHeight - 2 * SELECTION_RECTANGLE_Y_MARGIN,
    pickable: false
  } );

  // snapshot (camera) button
  const snapshotIcon = new FontAwesomeNode( 'camera', { scale: 0.4 } );
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
    listener: function() {
      assert && assert( !snapshotProperty.value, 'snapshot is already occupied' );
      const snapshot = new Snapshot( scene );
      snapshotProperty.value = snapshot; // associate the snapshot with this control
      selectedSnapshotProperty.value = snapshot; // select the created snapshot
    }
  } );

  assert && assert( !options.children, 'SnapshotControl sets children' );
  options.children = [ selectionRectangle, snapshotNode, snapshotButton ];

  Node.call( this, options );

  // selects the snapshot associated with this control
  const upListener = new DownUpListener( {
    upInside: function( event, trail ) {
      assert && assert( snapshotProperty.value, 'expected a snapshot' );
      selectedSnapshotProperty.value = snapshotProperty.value;
    }
  } );

  // updates the layout of the snapshot, and centers it in the control
  const updateSnapshotLayout = function() {
    if ( options.variableValuesVisibleProperty && options.variableValuesVisibleProperty.value ) {
      snapshotNode.children = [ equationNode, variableValuesNode ];
    }
    else {
      snapshotNode.children = [ equationNode ];
    }
    snapshotNode.center = selectionRectangle.center;
  };

  // Updates the view when the model changes. unlink not required.
  snapshotProperty.link( function( snapshot ) {

    // either the button or the snapshot is visible
    snapshotButton.visible = !snapshot;
    snapshotNode.visible = !!snapshot;
    selectionRectangle.visible = !!snapshot;

    if ( snapshot ) {

      selectionRectangle.cursor = 'pointer';

      // create the equation for the snapshot
      equationNode = new EquationNode( scene.leftTermCreators, scene.rightTermCreators, {
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
        } );
      }

      // add listener that selects the snapshot
      self.addInputListener( upListener );
    }
    else if ( self.hasInputListener( upListener ) ) {

      selectionRectangle.cursor = null;

      // no associated snapshot
      equationNode = NO_EQUATION_NODE;
      variableValuesNode = NO_VARIABLE_VALUES_NODE;
      self.removeInputListener( upListener );
    }

    updateSnapshotLayout();
  } );

  // Shows that the associated snapshot has been selected. unlink not required.
  selectedSnapshotProperty.link( function( selectedSnapshot ) {
    const isSelected = ( selectedSnapshot && selectedSnapshot === snapshotProperty.value );
    selectionRectangle.stroke = isSelected ?
                                EqualityExplorerColors.SNAPSHOT_SELECTED_STROKE :
                                EqualityExplorerColors.SNAPSHOT_DESELECTED_STROKE;
  } );

  if ( options.variableValuesVisibleProperty ) {

    // Shows/hides variable values. unlink not required.
    options.variableValuesVisibleProperty.link( function( visible ) {
      updateSnapshotLayout();
    } );
  }
}

equalityExplorer.register( 'SnapshotControl', SnapshotControl );

inherit( Node, SnapshotControl );
export default SnapshotControl;