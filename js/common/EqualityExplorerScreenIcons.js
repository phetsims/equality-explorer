// Copyright 2018, University of Colorado Boulder

/**
 * Methods for creating screen icons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ScreenIcon = require( 'JOIST/ScreenIcon' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // images
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );

  var EqualityExplorerScreenIcons = {

    /**
     * Creates the icons for the 'Basics' screen.
     * @returns {ScreenIcon}
     */
    createBasics: function() {

      var appleNode1 = new Image( appleImage );
      var appleNode2 = new Image( appleImage, {
        left: appleNode1.left - 10,
        top: appleNode1.bottom + 5
      } );
      var appleNode3 = new Image( appleImage, {
        left: appleNode2.right + 5,
        top: appleNode1.bottom - 5
      } );
      var appleGroupNode = new Node( {
        children: [ appleNode1, appleNode2, appleNode3 ]
      } );

      var greaterThanNode = new Text( MathSymbols.GREATER_THAN, {
        font: new PhetFont( 80 )
      } );

      var orangeNode1 = new Image( orangeImage );
      var orangeNode2 = new Image( orangeImage );
      var orangeGroupNode = new VBox( {
        spacing: 10,
        children: [ orangeNode1, orangeNode2 ]
      } );

      var iconNode = new HBox( {
        spacing: 10,
        children: [ appleGroupNode, greaterThanNode, orangeGroupNode ]
      } );

      return new ScreenIcon( iconNode, {
        fill: EqualityExplorerColors.BASICS_SCREEN_BACKGROUND
      } );
    }
  };

  equalityExplorer.register( 'EqualityExplorerScreenIcons', EqualityExplorerScreenIcons );

  return EqualityExplorerScreenIcons;
} );