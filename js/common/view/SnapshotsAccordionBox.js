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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var mySnapshotsString = require( 'string!EQUALITY_EXPLORER/mySnapshots' );

  // constants
  var NUMBER_FONT = new PhetFont( 16 );

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

    // Create a row for each snapshot
    for ( var i = 0; i < options.numberOfSnapshots; i++ ) {

      var numberLabel = new Text( i + 1, {
        font: NUMBER_FONT
      } );

      var numberButton = new RectangularPushButton( {
        content: new Text( i + 1, {
          font: NUMBER_FONT
        } ),
        baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
        center: numberLabel.center,
        visible: false
      } );

      var numbersParent = new Node( {
        children: [ numberLabel, numberButton ]
      } );

      var equationNode = new Rectangle( 0, 0, 130, 35 ); //TODO use EquationNode

      var snapshotButton = new RectangularPushButton( {
        content: new FontAwesomeNode( 'camera', { scale: 0.4 } ),
        baseColor: PhetColorScheme.PHET_LOGO_YELLOW
      } );

      var trashButton = new RectangularPushButton( {
        content: new FontAwesomeNode( 'trash', { scale: 0.4 } ),
        center: snapshotButton.center,
        baseColor: 'white'
      } );

      var buttonsParent = new Node( {
        children: [ trashButton, snapshotButton ]
      } );

      //TODO show snapshot '1', for demonstration purposes
      if ( i === 0 ) {
        numberButton.visible = true;
        snapshotButton.visible = false;
        var equationText = new Text( '2 > 1', {
          font: new PhetFont( 20 ),
          center: equationNode.center
        } );
        equationNode.addChild( equationText );
      }

      var hBox = new HBox( {
        spacing: 5,
        children: [ numbersParent, equationNode, buttonsParent ]
      } );

      vBoxChildren.push( hBox );
    }

    var contentNode = new VBox( {
      spacing: 30,
      children: vBoxChildren
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'SnapshotsAccordionBox', SnapshotsAccordionBox );

  return inherit( AccordionBox, SnapshotsAccordionBox );
} );
