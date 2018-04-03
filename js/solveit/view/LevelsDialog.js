// Copyright 2018, University of Colorado Boulder

/**
 * Dialog that explains the game levels in the 'Solve It!' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Dialog = require( 'JOIST/Dialog' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var levelsString = require( 'string!EQUALITY_EXPLORER/levels' );
  var level1String = require( 'string!EQUALITY_EXPLORER/level1' );
  var level2String = require( 'string!EQUALITY_EXPLORER/level2' );
  var level3String = require( 'string!EQUALITY_EXPLORER/level3' );
  var level4String = require( 'string!EQUALITY_EXPLORER/level4' );

  // constants
  var TITLE_FONT = new PhetFont( 24 );
  var DESCRIPTION_FONT = new PhetFont( 18 );
  var MAX_CONTENT_WIDTH = 500;

  /**
   * @constructor
   */
  function LevelsDialog() {

    var self = this;

    var levelDescriptions = [
      level1String,
      level2String,
      level3String,
      level4String
    ];

    var children = [];
    levelDescriptions.forEach( function( levelDescription ) {
      children.push( new RichText( levelDescription, {
        font: DESCRIPTION_FONT
      } ) );
    } );

    var content = new VBox( {
      align: 'left',
      spacing: 15,
      children: children,
      maxWidth: MAX_CONTENT_WIDTH // scale all of the descriptions uniformly
    } );

    var titleNode = new Text( levelsString, {
      font: TITLE_FONT,
      maxWidth: 0.75 * MAX_CONTENT_WIDTH
    } );

    Dialog.call( this, content, {
      title: titleNode,
      modal: true,
      hasCloseButton: true,
      xMargin: 30,
      yMargin: 30
    } );

    // Click anywhere on the dialog to hide it.
    this.addInputListener( new ButtonListener( {
      fire: function() { self.hide(); }
    } ) );
  }

  equalityExplorer.register( 'LevelsDialog', LevelsDialog );

  return inherit( Dialog, LevelsDialog );
} );