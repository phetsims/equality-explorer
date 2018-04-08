// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var GameLevel = require( 'EQUALITY_EXPLORER/solveit/model/GameLevel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var StringProperty = require( 'AXON/StringProperty' );

  // strings
  var level1String = require( 'string!EQUALITY_EXPLORER/level1' );
  var level2String = require( 'string!EQUALITY_EXPLORER/level2' );
  var level3String = require( 'string!EQUALITY_EXPLORER/level3' );
  var level4String = require( 'string!EQUALITY_EXPLORER/level4' );

  // constants
  var VALID_STATES = [ 'settings', 'playing' ];

  /**
   * @constructor
   */
  function SolveItModel() {

    // @public
    this.stateProperty = new StringProperty( 'settings', {
      validValues: VALID_STATES
    } );

    // @public (read-only)
    this.numberOfLevels = 4;

    // @public (read-only) ordered by ascending level number
    this.levelDescriptions = [
      level1String,
      level2String,
      level3String,
      level4String
    ];

    // @public (read-only)
    this.levels = [];
    for ( var i = 0; i < this.numberOfLevels; i++ ) {
      this.levels.push( new GameLevel( i, this.levelDescriptions[ i ] ) );
    }

    // @public the selected level
    this.levelProperty = new Property( this.levels[ 0 ], {
      validValues: this.levels
    } );

    // @public (read-only) reaching this score results in a reward
    this.rewardScore = 10;

    // @public technically a view Property, but convenient to put it in the model
    this.soundEnabledProperty = new BooleanProperty( true );
  }

  equalityExplorer.register( 'SolveItModel', SolveItModel );

  return inherit( Object, SolveItModel, {

    // @public
    reset: function() {
      this.stateProperty.reset();
      this.levels.forEach( function( level ) {
        level.reset();
      } );
      this.levelProperty.reset();
      this.soundEnabledProperty.reset();
    }
  } );
} );