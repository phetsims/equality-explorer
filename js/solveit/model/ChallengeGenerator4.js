// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for level 4.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeGenerator = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function ChallengeGenerator4() {
    ChallengeGenerator.call( this, 4 /* level */ );
  }

  equalityExplorer.register( 'ChallengeGenerator4', ChallengeGenerator4 );

  return inherit( ChallengeGenerator, ChallengeGenerator4, {

    /**
     * Generates the next challenge.
     * @returns {Object}
     * @protected
     * @override
     */
    nextChallengeProtected: function() {
      //TODO
      return { level: this.level };
    }
  } );
} );