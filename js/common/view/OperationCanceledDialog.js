// Copyright 2018, University of Colorado Boulder

/**
 * Dialog displayed when an operation is canceled because EqualityExplorerConstants.LARGEST_INTEGER
 * limit is exceeded.  See See https://github.com/phetsims/equality-explorer/issues/48
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dialog = require( 'JOIST/Dialog' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RichText = require( 'SCENERY/nodes/RichText' );

  // images
  var phetGirlImage = require( 'image!EQUALITY_EXPLORER/phetGirl.png' ); //TODO #48 get the correct PNG file

  // string
  var oopsMessageString = require( 'string!EQUALITY_EXPLORER/oopsMessage' );

  /**
   * @constructor
   */
  function OperationCanceledDialog() {

    var self = this;

    var messageNode = new RichText( oopsMessageString, {
      font: new PhetFont( 20 )
    } );

    var phetGirlNode = new Image( phetGirlImage, {
      maxHeight: messageNode.height
    } );

    var content = new HBox( {
      spacing: 10,
      children: [ messageNode, phetGirlNode ]
    } );

    Dialog.call( this, content, {
      modal: true,
      hasCloseButton: true,
      xMargin: 30,
      yMargin: 30
    } );

    //TODO why do I have to click twice?  on close button, on the dialog, outside dialog...
    // Click anywhere on the dialog to dispose of it.
    this.addInputListener( new ButtonListener( {
      fire: function() { self.dispose(); }
    } ) );
  }

  equalityExplorer.register( 'OperationCanceledDialog', OperationCanceledDialog );

  return inherit( Dialog, OperationCanceledDialog );
} );
 