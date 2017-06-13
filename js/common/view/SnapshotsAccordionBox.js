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
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var WorstCaseSnapshotLabel = require( 'EQUALITY_EXPLORER/common/view/WorstCaseSnapshotLabel' );
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
  var mySnapshotsString = require( 'string!EQUALITY_EXPLORER/mySnapshots' );

  // constants
  var BUTTON_X_MARGIN = 3;
  var BUTTON_Y_MARGIN = 1;
  var CONTENT_WIDTH = 225;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function SnapshotsAccordionBox( options ) {

    options = _.extend( {
      numberOfSnapshots: 5,
      fill: 'white',
      titleNode: new Text( mySnapshotsString, {
        font: new PhetFont( 18 )
        //TODO maxWidth
      } ),
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

    var snapshotsVBoxChildren = [];

    snapshotsVBoxChildren.push( new HSeparator( CONTENT_WIDTH, {
      stroke: 'rgb( 200, 200, 200 )'
    } ) );

    // Create a row for each snapshot
    var snapshotIcon = new FontAwesomeNode( 'camera', { scale: 0.4 } );
    for ( var i = 0; i < options.numberOfSnapshots; i++ ) {

      if ( i === 0 ) {

        //TODO for demonstration of worst-case layout
        snapshotsVBoxChildren.push( new WorstCaseSnapshotLabel( {
          maxWidth: CONTENT_WIDTH
        } ) );
        //TODO make snapshots selectable, like radio button
      }
      else {

        var snapshotButton = new RectangularPushButton( {
          content: snapshotIcon,
          baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
          xMargin: 8,
          yMargin: 4,
          touchAreaXDilation: 5,
          touchAreaYDilation: 5
        } );

        snapshotsVBoxChildren.push( snapshotButton );
      }
    }

    snapshotsVBoxChildren.push( new HSeparator( CONTENT_WIDTH, {
      stroke: 'rgb( 200, 200, 200 )'
    } ) );

    var snapshotsVBox = new VBox( {
      spacing: 30,
      children: snapshotsVBoxChildren
    } );

    var loadIcon = new ArrowNode( 0, 0, -20, 0, {
      headWidth: 15,
      headHeight: 8,
      tailWidth: 4
    } );
    var loadButton = new RectangularPushButton( {
      content: loadIcon,
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
    } );
    //TODO listener - load the selected snapshot

    var trashIcon = new FontAwesomeNode( 'trash', { scale: 0.45 } );
    var trashButton = new RectangularPushButton( {
      content: trashIcon,
      baseColor: 'white',
      xMargin: 12,
      yMargin: 5,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
    } );
    //TODO listener - delete the selected snapshot

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
