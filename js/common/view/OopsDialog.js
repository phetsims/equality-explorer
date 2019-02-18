// Copyright 2018-2019, University of Colorado Boulder

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
      topMargin: 20,
      bottomMargin: 20,
      rightMargin: 20
    } );
  }

  equalityExplorer.register( 'OopsDialog', OopsDialog );

  return inherit( Dialog, OopsDialog );
} );
 