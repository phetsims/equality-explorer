// Copyright 2018, University of Colorado Boulder

/**
 * Dialog displayed when an operation is canceled because EqualityExplorerConstants.LARGEST_INTEGER
 * limit is exceeded.  So named because the message begins with 'Oops!', so that's how people referred to it.
 * See https://github.com/phetsims/equality-explorer/issues/48
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
  var phetGirlWaggingFingerImage = require( 'image!EQUALITY_EXPLORER/phet-girl-wagging-finger.png' );

  // string
  var oopsMessageString = require( 'string!EQUALITY_EXPLORER/oopsMessage' );

  /**
   * @constructor
   */
  function OopsDialog() {

    var self = this;

    var messageNode = new RichText( oopsMessageString, {
      font: new PhetFont( 20 ),
      maxWidth: 600,
      maxHeight: 400
    } );

    var phetGirlNode = new Image( phetGirlWaggingFingerImage, {
      maxHeight: 132 // determined empirically
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

    // Click anywhere on the dialog to hide it.
    this.addInputListener( new ButtonListener( {
      fire: function() { self.hide(); }
    } ) );
  }

  equalityExplorer.register( 'OopsDialog', OopsDialog );

  return inherit( Dialog, OopsDialog );
} );
 