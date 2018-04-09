// Copyright 2018, University of Colorado Boulder

/**
 * A scene in the 'Solve It!' screen.  Each scene corresponds to a level in the game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );

  /**
   * @param {number} levelNumber - game level, numbered from 0 in the model, from 1 in the view
   * @param {string} description
   * @constructor
   */
  function SolveItScene( levelNumber, description ) {

    OperationsScene.call( this );

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

  equalityExplorer.register( 'SolveItScene', SolveItScene );

  return inherit( OperationsScene, SolveItScene );
} );