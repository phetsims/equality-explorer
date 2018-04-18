// Copyright 2018, University of Colorado Boulder

/**
 * Displays debugging info related to the current challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RichText = require( 'SCENERY/nodes/RichText' );

  // constants
  var DEFAULT_FONT = new PhetFont( 16 );
  var RICH_TEXT_SPACE = '\u00A0'; // workaround for https://github.com/phetsims/scenery/issues/769

  /**
   * @param {Property.<Challenge|null>} challengeProperty
   * @param {Object} [options]
   * @constructor
   */
  function DebugChallengeNode( challengeProperty, options ) {

    var self = this;

    options = _.extend( {
      font: DEFAULT_FONT
    }, options );

    RichText.call( this, RICH_TEXT_SPACE, options );

    challengeProperty.link( function( challenge ) {
      if ( challenge ) {
        self.text = '<b>Challenge debug:</b><br>' + challenge.debugOrigin + '<br>' + challenge.debugDerivation;
      }
      else {
        self.text = RICH_TEXT_SPACE;
      }
    } );
  }

  equalityExplorer.register( 'DebugChallengeNode', DebugChallengeNode );

  return inherit( RichText, DebugChallengeNode );
} );
 