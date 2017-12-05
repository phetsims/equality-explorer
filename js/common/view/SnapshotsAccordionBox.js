// Copyright 2017, University of Colorado Boulder

/***
 * Accordion box that allows the student to save and restore snapshots, specific configurations of a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var XCheckBox = require( 'EQUALITY_EXPLORER/common/view/XCheckBox' );

  // strings
  var snapshotsString = require( 'string!EQUALITY_EXPLORER/snapshots' );

  // constants
  var SEPARATOR_OPTIONS = {
    stroke: 'rgb( 200, 200, 200 )'
  };

  /**
   * @param {Snapshots} snapshots
   * @param {Object} [options]
   * @constructor
   */
  function SnapshotsAccordionBox( snapshots, options ) {

    options = _.extend( {

      fixedWidth: 100, // this accordion box is designed to be a fixed width, regardless of its content

      // {BooleanProperty|null} whether 'x' value is visible in snapshots
      // null indicates that showing 'x' value is not supported.
      xVisibleProperty: null,

      // supertype options
      resize: false,
      fill: 'white',
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      contentXMargin: 10,
      contentYMargin: 10

    }, options );

    assert && assert( options.maxWidth === undefined, 'subtype defines its maxWidth' );
    options.maxWidth = options.fixedWidth;

    // title
    assert && assert( !options.titleNode, 'this type defines its titleNode' );
    options.titleNode = new Text( snapshotsString, {
      font: new PhetFont( 18 ),
      maxWidth: 0.85 * options.fixedWidth
    } );

    var snapshotsVBoxChildren = [];

    var contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    // separator between title and snapshots
    snapshotsVBoxChildren.push( new HSeparator( contentWidth, SEPARATOR_OPTIONS ) );

    // Create a row for each snapshot
    var snapshotIcon = new FontAwesomeNode( 'camera', { scale: 0.4 } );
    for ( var i = 0; i < snapshots.maxSnapshots; i++ ) {

      var snapshotButton = new RectangularPushButton( {
        //TODO snapshotButton listener
        content: snapshotIcon,
        baseColor: PhetColorScheme.BUTTON_YELLOW,
        xMargin: 8,
        yMargin: 4,
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
      } );

      snapshotsVBoxChildren.push( snapshotButton );
    }

    // separator between snapshots and buttons
    snapshotsVBoxChildren.push( new HSeparator( contentWidth, SEPARATOR_OPTIONS ) );

    var snapshotsVBox = new VBox( {
      spacing: 35,
      children: snapshotsVBoxChildren
    } );

    // Button to restore the selected snapshot
    var restoreIcon = new FontAwesomeNode( 'reply', { scale: 0.45 } );
    var restoreButton = new RectangularPushButton( {
      content: restoreIcon,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      listener: function() {
        snapshots.restoreSelectedSnapshot();
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
        snapshots.deleteSelectedSnapshot();
      }
    } );

    // disable restore and trash buttons when there is no selection
    snapshots.selectedSnapshotProperty.link( function( snapshot ) {
      var enabled = ( snapshot !== null );
      restoreButton.enabled = enabled;
      trashButton.enabled = enabled;
    } );

    var buttonGroupChildren = [ restoreButton, trashButton ];

    // Check box for making 'x' visible
    if ( options.xVisibleProperty ) {
      var xCheckBox = new XCheckBox( options.xVisibleProperty, {
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
      } );
      buttonGroupChildren.push( xCheckBox );
    }

    var buttonGroup = new HBox( {
      spacing: 50,
      children: buttonGroupChildren
    } );

    snapshotsVBoxChildren.push( buttonGroup );

    var contentVBox = new VBox( {
      spacing: 10,
      children: [ snapshotsVBox, buttonGroup ]
    } );

    AccordionBox.call( this, contentVBox, options );
  }

  equalityExplorer.register( 'SnapshotsAccordionBox', SnapshotsAccordionBox );

  return inherit( AccordionBox, SnapshotsAccordionBox );
} );
