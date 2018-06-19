// Copyright 2018, University of Colorado Boulder

/**
 * Shows how the current challenge was derived. Used exclusively for debugging.
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
  var DEFAULT_FONT = new PhetFont( 14 );

  /**
   * @param {Property.<Challenge|null>} challengeProperty
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeDerivationNode( challengeProperty, options ) {

    var self = this;

    options = _.extend( {

      // RichText options
      font: DEFAULT_FONT
    }, options );

    RichText.call( this, '', options );

    // display derivation of the current challenge. unlink not needed.
    challengeProperty.link( function( challenge ) {
      self.text = ( challenge ? challenge.debugDerivation : '' );
    } );
  }

  equalityExplorer.register( 'ChallengeDerivationNode', ChallengeDerivationNode );

  return inherit( RichText, ChallengeDerivationNode );
} );
 