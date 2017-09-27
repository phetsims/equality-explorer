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

  // strings
  var snapshotsString = require( 'string!EQUALITY_EXPLORER/snapshots' );

  // constants
  var SEPARATOR_OPTIONS = {
    stroke: 'rgb( 200, 200, 200 )'
  };

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function SnapshotsAccordionBox( leftItemCreators, rightItemCreators, options ) {

    options = _.extend( {

      numberOfSnapshots: 5,

      // supertype options
      maxWidth: 100,
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

    // title
    assert && assert( !options.titleNode, 'this subtype defines its titleNode' );
    options.titleNode = new Text( snapshotsString, {
        font: new PhetFont( 18 ),
        maxWidth: 0.85 * options.maxWidth
      } );

    var snapshotsVBoxChildren = [];

    var contentWidth = options.maxWidth - ( 2 * options.contentXMargin );

    // separator between title and snapshots
    snapshotsVBoxChildren.push( new HSeparator( contentWidth, SEPARATOR_OPTIONS ) );

    // Create a row for each snapshot
    var snapshotIcon = new FontAwesomeNode( 'camera', { scale: 0.4 } );
    for ( var i = 0; i < options.numberOfSnapshots; i++ ) {

      var snapshotButton = new RectangularPushButton( {
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

    // Button to load a snapshot
    var loadIcon = new FontAwesomeNode( 'reply', { scale: 0.45 } );
    var loadButton = new RectangularPushButton( {
      //TODO add loadButton listener
      content: loadIcon,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
    } );

    // Button to trash (delete) a snapshot
    var trashIcon = new FontAwesomeNode( 'trash', { scale: 0.45 } );
    var trashButton = new RectangularPushButton( {
      //TODO add trashButton listener
      content: trashIcon,
      baseColor: 'white',
      xMargin: 12,
      yMargin: 5,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
    } );

    var buttonGroup = new HBox( {
      spacing: 50,
      children: [ loadButton, trashButton ]
    } );
    snapshotsVBoxChildren.push( buttonGroup );

    var contentVBox = new VBox( {
      spacing: 10,
      children: [ snapshotsVBox, buttonGroup ]
    } );

    AccordionBox.call( this, contentVBox, options );

    //TODO disable load and trash buttons when there is no selection
  }

  equalityExplorer.register( 'SnapshotsAccordionBox', SnapshotsAccordionBox );

  return inherit( AccordionBox, SnapshotsAccordionBox );
} );
