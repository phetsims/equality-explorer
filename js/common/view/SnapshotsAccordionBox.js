// Copyright 2017-2018, University of Colorado Boulder

/**
 * Accordion box that allows the student to save and restore snapshots, specific configurations of a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var SnapshotControl = require( 'EQUALITY_EXPLORER/common/view/SnapshotControl' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableValuesVisibleCheckbox = require( 'EQUALITY_EXPLORER/common/view/VariableValuesVisibleCheckbox' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var snapshotsString = require( 'string!EQUALITY_EXPLORER/snapshots' );

  // constants
  var SEPARATOR_OPTIONS = {
    stroke: 'rgb( 200, 200, 200 )'
  };

  /**
   * @param {Scene} scene - the scene that we'll be taking snapshots of
   * @param {Object} [options]
   * @constructor
   */
  function SnapshotsAccordionBox( scene, options ) {

    var self = this;

    options = _.extend( {}, EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {

      // this accordion box is designed to be a fixed width, regardless of its content
      fixedWidth: 100,

      // {BooleanProperty|null} whether variable values are visible in snapshots, null if the feature is not supported
      variableValuesVisibleProperty: null,

      // SnapshotControl options
      snapshotControlHeight: 50,
      snapshotControlOrientation: 'horizontal',
      snapshotControlCommaSeparated: true,

      // supertype options
      contentXMargin: 10,
      contentYMargin: 10,
      contentYSpacing: 3

    }, options );

    assert && assert( !( options.variableValuesVisibleProperty && !scene.variables ),
      'scene has no variables to show in snapshots' );

    assert && assert( options.maxWidth === undefined, 'SnapshotsAccordionBox sets maxWidth' );
    options.maxWidth = options.fixedWidth;

    var contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    // title
    assert && assert( !options.titleNode, 'SnapshotsAccordionBox sets titleNode' );
    options.titleNode = new Text( snapshotsString, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentWidth
    } );

    // Create a row for each snapshot
    var snapshotsVBoxChildren = [];
    for ( var i = 0; i < scene.snapshotsCollection.snapshotProperties.length; i++ ) {
      snapshotsVBoxChildren.push( new SnapshotControl(
        scene, scene.snapshotsCollection.snapshotProperties[ i ], scene.snapshotsCollection.selectedSnapshotProperty, {
          variableValuesVisibleProperty: options.variableValuesVisibleProperty,
          orientation: options.snapshotControlOrientation,
          commaSeparated: options.snapshotControlCommaSeparated,
          controlWidth: contentWidth,
          controlHeight: options.snapshotControlHeight
        } ) );
    }

    var snapshotsVBox = new VBox( {
      spacing: 15,
      children: snapshotsVBoxChildren
    } );

    // Button to restore the selected snapshot
    var restoreIcon = new FontAwesomeNode( 'reply', { scale: 0.45 } );
    var restoreButton = new RectangularPushButton( {
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
    var trashIcon = new FontAwesomeNode( 'trash', { scale: 0.45 } );
    var trashButton = new RectangularPushButton( {
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

    // Disables restore and trash buttons when there is no selection.
    // unlink not required.
    scene.snapshotsCollection.selectedSnapshotProperty.link( function( snapshot ) {
      var enabled = ( snapshot !== null );
      restoreButton.enabled = enabled;
      trashButton.enabled = enabled;
    } );

    var buttonGroupChildren = [ restoreButton, trashButton ];

    // Checkbox for making variable values visible.
    if ( options.variableValuesVisibleProperty ) {
      buttonGroupChildren.push( new VariableValuesVisibleCheckbox( scene.variables, options.variableValuesVisibleProperty, {
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
      } ) );
    }

    var buttonGroup = new HBox( {
      spacing: 40,
      children: buttonGroupChildren,
      maxWidth: contentWidth
    } );

    snapshotsVBoxChildren.push( buttonGroup );

    var contentVBox = new VBox( {
      spacing: 10,
      children: [
        snapshotsVBox,
        new HSeparator( contentWidth, SEPARATOR_OPTIONS ),
        buttonGroup
      ]
    } );

    AccordionBox.call( this, contentVBox, options );

    // Click outside this accordion box to clear the selected snapshot.
    var clickToDeselectListener = {
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

  return inherit( AccordionBox, SnapshotsAccordionBox );
} );
