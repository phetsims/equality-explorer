// Copyright 2017-2019, University of Colorado Boulder

/**
 * Accordion box that allows the student to save and restore snapshots, specific configurations of a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import equalityExplorerStrings from '../../equality-explorer-strings.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import SnapshotControl from './SnapshotControl.js';
import VariableValuesVisibleCheckbox from './VariableValuesVisibleCheckbox.js';

const snapshotsString = equalityExplorerStrings.snapshots;

// constants
const SEPARATOR_OPTIONS = {
  stroke: 'rgb( 200, 200, 200 )'
};

/**
 * @param {EqualityExplorerScene} scene - the scene that we'll be taking snapshots of
 * @param {Object} [options]
 * @constructor
 */
function SnapshotsAccordionBox( scene, options ) {

  const self = this;

  options = merge( {}, EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {

    // this accordion box is designed to be a fixed width, regardless of its content
    fixedWidth: 100,

    // {BooleanProperty|null} whether variable values are visible in snapshots, null if the feature is not supported
    variableValuesVisibleProperty: null,

    // {Object|null} options passed to SnapshotControl
    snapshotControlOptions: null,

    // supertype options
    contentXMargin: 10,
    contentYMargin: 10,
    contentYSpacing: 3

  }, options );

  // options for SnapshotControl
  options.snapshotControlOptions = merge( {
    controlHeight: 50,
    orientation: 'horizontal',
    commaSeparated: true,
    variableValuesOpacity: 1
  }, options.snapshotControlOptions );

  assert && assert( !( options.variableValuesVisibleProperty && !scene.variables ),
    'scene has no variables to show in snapshots' );

  assert && assert( options.maxWidth === undefined, 'SnapshotsAccordionBox sets maxWidth' );
  options.maxWidth = options.fixedWidth;

  const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

  options.snapshotControlOptions = merge( {
    variableValuesVisibleProperty: options.variableValuesVisibleProperty,
    controlWidth: contentWidth
  }, options.snapshotControlOptions );

  // title
  assert && assert( !options.titleNode, 'SnapshotsAccordionBox sets titleNode' );
  options.titleNode = new Text( snapshotsString, {
    font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
    maxWidth: 0.85 * contentWidth
  } );

  // Create a row for each snapshot
  const snapshotsVBoxChildren = [];
  for ( let i = 0; i < scene.snapshotsCollection.snapshotProperties.length; i++ ) {
    snapshotsVBoxChildren.push( new SnapshotControl( scene, scene.snapshotsCollection.snapshotProperties[ i ],
      scene.snapshotsCollection.selectedSnapshotProperty, options.snapshotControlOptions ) );
  }

  const snapshotsVBox = new VBox( {
    spacing: 15,
    children: snapshotsVBoxChildren
  } );

  // Button to restore the selected snapshot
  const restoreIcon = new FontAwesomeNode( 'reply', { scale: 0.45 } );
  const restoreButton = new RectangularPushButton( {
    content: restoreIcon,
    baseColor: EqualityExplorerColors.SNAPSHOT_SELECTED_STROKE, // button color matches selection stroke
    xMargin: 8,
    yMargin: 4,
    touchAreaXDilation: 10,
    touchAreaYDilation: 10,
    listener: function() {
      scene.snapshotsCollection.selectedSnapshotProperty.value.restore();
    }
  } );

  // Button to delete (trash) the selected snapshot
  const trashIcon = new FontAwesomeNode( 'trash', { scale: 0.45 } );
  const trashButton = new RectangularPushButton( {
    content: trashIcon,
    baseColor: 'white',
    xMargin: 12,
    yMargin: 5,
    touchAreaXDilation: 5,
    touchAreaYDilation: 5,
    listener: function() {
      scene.snapshotsCollection.deleteSelectedSnapshot();
    }
  } );

  // Disables restore and trash buttons when there is no selection. unlink not required.
  scene.snapshotsCollection.selectedSnapshotProperty.link( function( snapshot ) {
    const enabled = ( snapshot !== null );
    restoreButton.enabled = enabled;
    trashButton.enabled = enabled;
  } );

  const buttonGroupChildren = [ restoreButton, trashButton ];

  // Checkbox for making variable values visible.
  if ( options.variableValuesVisibleProperty ) {
    buttonGroupChildren.push( new VariableValuesVisibleCheckbox(
      scene.variables, options.variableValuesVisibleProperty, {
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
      } ) );
  }

  const buttonGroup = new HBox( {
    spacing: 40,
    children: buttonGroupChildren,
    maxWidth: contentWidth
  } );

  snapshotsVBoxChildren.push( buttonGroup );

  const contentVBox = new VBox( {
    spacing: 10,
    children: [
      snapshotsVBox,
      new HSeparator( contentWidth, SEPARATOR_OPTIONS ),
      buttonGroup
    ]
  } );

  AccordionBox.call( this, contentVBox, options );

  // Click outside this accordion box to clear the selected snapshot.
  const clickToDeselectListener = {
    down: function( event ) {
      if ( !self.parentToGlobalBounds( self.visibleBounds ).containsPoint( event.pointer.point ) ) {
        scene.snapshotsCollection.selectedSnapshotProperty.value = null;
      }
    }
  };

  // Register input listener with the Display only when we have a selected snapshot.
  // This technique was borrowed from circuit-construction-kit-common.CircuitElementNode.
  // unlink not required.
  scene.snapshotsCollection.selectedSnapshotProperty.link( function( selectedSnapshot, oldSelectedSnapshot ) {
    if ( oldSelectedSnapshot ) {
      phet.joist.sim.display.removeInputListener( clickToDeselectListener );
    }
    if ( selectedSnapshot ) {
      phet.joist.sim.display.addInputListener( clickToDeselectListener );
    }
  } );
}

equalityExplorer.register( 'SnapshotsAccordionBox', SnapshotsAccordionBox );

inherit( AccordionBox, SnapshotsAccordionBox );
export default SnapshotsAccordionBox;