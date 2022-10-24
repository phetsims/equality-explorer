// Copyright 2017-2022, University of Colorado Boulder

/**
 * Accordion box that allows the student to save and restore snapshots, specific configurations of a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TrashButton from '../../../../scenery-phet/js/buttons/TrashButton.js';
import { HBox, HSeparator, Node, Path, PressListenerEvent, Text, VBox } from '../../../../scenery/js/imports.js';
import replySolidShape from '../../../../sherpa/js/fontawesome-5/replySolidShape.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import SnapshotControl, { SnapshotControlOptions } from './SnapshotControl.js';
import VariableValuesVisibleCheckbox from './VariableValuesVisibleCheckbox.js';
import Snapshot from '../model/Snapshot.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = {

  // this accordion box is designed to be a fixed width, regardless of its content
  fixedWidth?: number;

  // whether variable values are visible in snapshots, null if the feature is not supported
  variableValuesVisibleProperty?: Property<boolean> | null;

  // options passed to SnapshotControl
  snapshotControlOptions?: StrictOmit<SnapshotControlOptions, 'tandem'>;
};

//TODO narrow AccordionBoxOptions to PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>
type SnapshotsAccordionBoxOptions = SelfOptions & AccordionBoxOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

export default class SnapshotsAccordionBox extends AccordionBox {

  /**
   * @param scene - the scene that we'll be taking snapshots of
   * @param [providedOptions]
   */
  public constructor( scene: EqualityExplorerScene, providedOptions: SnapshotsAccordionBoxOptions ) {

    const accordionBoxOptions = combineOptions<SnapshotsAccordionBoxOptions>( {}, EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {
      contentXMargin: 10,
      contentYMargin: 10,
      contentYSpacing: 3
    } );

    const defaultOptions = optionize<SnapshotsAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {

      // SelfOptions
      fixedWidth: 100,
      variableValuesVisibleProperty: null,
      snapshotControlOptions: {
        controlHeight: 50,
        orientation: 'horizontal',
        commaSeparated: true,
        variableValuesOpacity: 1
      }
    }, accordionBoxOptions );

    const options = optionize<SnapshotsAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      defaultOptions, providedOptions );

    assert && assert( !( options.variableValuesVisibleProperty && !scene.variables ),
      'scene has no variables to show in snapshots' );

    options.maxWidth = options.fixedWidth;

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    // title
    options.titleNode = new Text( EqualityExplorerStrings.snapshotsStringProperty, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentWidth,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    // Create a row for each snapshot
    const snapshotControls = [];
    for ( let i = 0; i < scene.snapshotsCollection.snapshotProperties.length; i++ ) {

      const snapshotControl = new SnapshotControl( scene, scene.snapshotsCollection.snapshotProperties[ i ],
        scene.snapshotsCollection.selectedSnapshotProperty, combineOptions<SnapshotControlOptions>( {
          variableValuesVisibleProperty: options.variableValuesVisibleProperty,
          controlWidth: contentWidth,
          tandem: options.tandem.createTandem( `snapshotControl${i}` )
        }, options.snapshotControlOptions ) );

      snapshotControls.push( snapshotControl );
    }

    const snapshotControlsVBox = new VBox( {
      spacing: 15,
      children: snapshotControls
    } );

    // true when a snapshot is selected
    const hasSelectedSnapshotProperty = new DerivedProperty(
      [ scene.snapshotsCollection.selectedSnapshotProperty ],
      selectedSnapshot => ( selectedSnapshot !== null ) );

    // Button to restore the selected snapshot
    const restoreIcon = new Path( replySolidShape, {
      scale: 0.04,
      fill: 'black'
    } );
    const restoreButton = new RectangularPushButton( {
      content: restoreIcon,
      baseColor: EqualityExplorerColors.SNAPSHOT_SELECTED_STROKE, // button color matches selection stroke
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      listener: () => scene.snapshotsCollection.restoreSelectedSnapshot(),
      enabledProperty: hasSelectedSnapshotProperty,
      tandem: options.tandem.createTandem( 'restoreButton' )
    } );

    // Button to delete (trash) the selected snapshot
    const trashButton = new TrashButton( {
      iconOptions: { scale: 0.034 },
      baseColor: 'white',
      xMargin: 12,
      yMargin: 5,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      listener: () => scene.snapshotsCollection.deleteSelectedSnapshot(),
      enabledProperty: hasSelectedSnapshotProperty,
      tandem: options.tandem.createTandem( 'trashButton' )
    } );

    const hBoxChildren: Node[] = [ restoreButton, trashButton ];

    // Checkbox for making variable values visible.
    if ( options.variableValuesVisibleProperty ) {
      const variables = scene.variables!;
      assert && assert( variables );
      hBoxChildren.push( new VariableValuesVisibleCheckbox( options.variableValuesVisibleProperty, variables, {
        touchAreaXDilation: 5,
        touchAreaYDilation: 5,
        tandem: options.tandem.createTandem( 'variableValuesVisibleCheckbox' )
      } ) );
    }

    const hBox = new HBox( {
      spacing: 40,
      children: hBoxChildren,
      maxWidth: contentWidth
    } );

    const content = new VBox( {
      spacing: 10,
      children: [
        snapshotControlsVBox,
        new HSeparator( { stroke: 'rgb( 200, 200, 200 )' } ),
        hBox
      ]
    } );

    super( content, options );

    // Click outside this accordion box to clear the selected snapshot.
    const clickToDeselectListener = {
      down: ( event: PressListenerEvent ) => {
        if ( !this.parentToGlobalBounds( this.visibleBounds ).containsPoint( event.pointer.point ) ) {
          scene.snapshotsCollection.selectedSnapshotProperty.value = null;
        }
      }
    };

    // Register input listener with the Display only when we have a selected snapshot.
    // This technique was borrowed from circuit-construction-kit-common.CircuitElementNode.
    // unlink not required.
    scene.snapshotsCollection.selectedSnapshotProperty.link(
      ( selectedSnapshot: Snapshot | null, oldSelectedSnapshot: Snapshot | null ) => {
        if ( oldSelectedSnapshot ) {
          phet.joist.display.removeInputListener( clickToDeselectListener );
        }
        if ( selectedSnapshot ) {
          phet.joist.display.addInputListener( clickToDeselectListener );
        }
      } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'SnapshotsAccordionBox', SnapshotsAccordionBox );