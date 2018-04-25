// Copyright 2018, University of Colorado Boulder

/**
 * Message dialog displayed when some limitation of the simulation is encountered.
 * So named because the messages begin with 'Oops!', so that's how people referred to it.
 * See https://github.com/phetsims/equality-explorer/issues/48
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dialog = require( 'SUN/Dialog' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RichText = require( 'SCENERY/nodes/RichText' );

  // images
  var phetGirlWaggingFingerImage = require( 'image!EQUALITY_EXPLORER/phet-girl-wagging-finger.png' );

  /**
   * @constructor
   */
  function OopsDialog( messageString ) {

    var self = this;

    var messageNode = new RichText( messageString, {
      font: new PhetFont( 20 ),
      maxWidth: 600,
      maxHeight: 400
    } );

    var phetGirlNode = new Image( phetGirlWaggingFingerImage, {
      maxHeight: 132 // determined empirically
    } );
    
    var content = new HBox( {
      spacing: 20,
      children: [ messageNode, phetGirlNode ]
    } );

    Dialog.call( this, content, {
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
 