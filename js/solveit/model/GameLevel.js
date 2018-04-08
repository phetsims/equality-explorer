// Copyright 2018, University of Colorado Boulder

/**
 * A level in the 'Solve It!' game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @param {number} levelNumber
   * @param {string} description
   * @constructor
   */
  function GameLevel( levelNumber, description ) {

    // @public (read-only)
    this.levelNumber = levelNumber;
    this.description = description;

    // @public
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: function( value ) {
        return value >= 0;
      }
    } );
  }

  equalityExplorer.register( 'GameLevel', GameLevel );

  return inherit( Object, GameLevel, {

    // @public
    reset: function() {
      this.scoreProperty.reset();
    }
  } );
} );