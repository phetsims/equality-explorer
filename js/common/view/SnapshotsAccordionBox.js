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
  var BUTTON_X_MARGIN = 8;
  var BUTTON_Y_MARGIN = 5;
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

    var vBoxChildren = [];

    vBoxChildren.push( new HSeparator( CONTENT_WIDTH, {
      stroke: 'rgb( 200, 200, 200 )'
    } ) );

    // button icons
    var snapshotIcon = new FontAwesomeNode( 'camera', { scale: 0.4 } );
    var loadIcon = new ArrowNode( 0, 0, -20, 0, {
      headWidth: 15,
      headHeight: 8,
      tailWidth: 4
    } );
    var trashIcon = new FontAwesomeNode( 'trash', { scale: 0.4 } );

    // for making all buttons the same size
    var maxIconWidth = _.maxBy( [ snapshotIcon, loadIcon, trashIcon], function( icon ) { return icon.width; } ).width;
    var maxIconHeight = _.maxBy( [ snapshotIcon, loadIcon, trashIcon], function( icon ) { return icon.height; } ).height;

    // Create a row for each snapshot
    for ( var i = 0; i < options.numberOfSnapshots; i++ ) {

      if ( i === 0 ) {
        var equationText = new Text( '-40 X + 40 X + 40 X = -40 X + 40 X + 40 X', {
          font: new PhetFont( 12 ),
          maxWidth: CONTENT_WIDTH
        } );
        vBoxChildren.push( equationText );
        //TODO make snapshots selectable, like radio button
      }
      else {

        var snapshotButton = new RectangularPushButton( {
          content: snapshotIcon,
          baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
          xMargin: BUTTON_X_MARGIN + ( maxIconWidth - snapshotIcon.width ),
          yMargin: BUTTON_Y_MARGIN + ( maxIconHeight - snapshotIcon.height ),
          touchAreaXDilation: 5,
          touchAreaYDilation: 5
        } );

        vBoxChildren.push( snapshotButton );
      }
    }

    vBoxChildren.push( new HSeparator( CONTENT_WIDTH, {
      stroke: 'rgb( 200, 200, 200 )'
    } ) );

    var snapshotsVBox = new VBox( {
      spacing: 25,
      children: vBoxChildren
    } );

    var loadButton = new RectangularPushButton( {
      content: loadIcon,
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      xMargin: BUTTON_X_MARGIN + ( maxIconWidth - loadIcon.width ),
      yMargin: BUTTON_Y_MARGIN + ( maxIconHeight - loadIcon.height ),
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
    } );
    //TODO listener - load the selected snapshot

    var trashButton = new RectangularPushButton( {
      content: trashIcon,
      baseColor: 'white',
      xMargin: BUTTON_X_MARGIN + ( maxIconWidth - trashIcon.width ),
      yMargin: BUTTON_Y_MARGIN + ( maxIconHeight - trashIcon.height ),
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
    } );
    //TODO listener - delete the selected snapshot

    var buttonGroup = new HBox( {
      spacing: 20,
      children: [ loadButton, trashButton ]
    });
    vBoxChildren.push( buttonGroup );
    
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
