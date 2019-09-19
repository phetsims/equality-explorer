// Copyright 2018-2019, University of Colorado Boulder

/**
 * Info dialog that explains the game levels in the 'Solve It!' screen.
 * This is intended primarily for use by teachers, to remind them of the types of challenges for each level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const levelsString = require( 'string!EQUALITY_EXPLORER/levels' );

  // constants
  var TITLE_FONT = new PhetFont( 24 );
  var DESCRIPTION_FONT = new PhetFont( 18 );
  var MAX_CONTENT_WIDTH = 500;

  /**
   * @param {string[]} levelDescriptions
   * @constructor
   */
  function InfoDialog( levelDescriptions ) {

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
      ySpacing: 20,
      bottomMargin: 20
    } );
  }

  equalityExplorer.register( 'InfoDialog', InfoDialog );

  return inherit( Dialog, InfoDialog );
} );