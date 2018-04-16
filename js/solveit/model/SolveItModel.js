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
  var ChallengeGenerator1 = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator1' );
  var ChallengeGenerator2 = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator2' );
  var ChallengeGenerator3 = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator3' );
  var ChallengeGenerator4 = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator4' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SolveItScene = require( 'EQUALITY_EXPLORER/solveit/model/SolveItScene' );

  // strings
  var level1String = require( 'string!EQUALITY_EXPLORER/level1' );
  var level2String = require( 'string!EQUALITY_EXPLORER/level2' );
  var level3String = require( 'string!EQUALITY_EXPLORER/level3' );
  var level4String = require( 'string!EQUALITY_EXPLORER/level4' );

  /**
   * @constructor
   */
  function SolveItModel() {

    // @public (read-only) descriptions for each game level, ordered by ascending level number
    this.levelDescriptions = [
      level1String,
      level2String,
      level3String,
      level4String
    ];

    // @private challenge generators for each level
    this.challengeGenerators = [
      new ChallengeGenerator1(),
      new ChallengeGenerator2(),
      new ChallengeGenerator3(),
      new ChallengeGenerator4()
    ];

    // @public (read-only) {SolveItScene[]} a scene for each level
    this.scenes = [];
    for ( var i = 0; i < this.levelDescriptions.length; i++ ) {
      this.scenes.push( new SolveItScene( i + 1, this.levelDescriptions[ i ], this.challengeGenerators[ i ] ) );
    }

    // @public {SolveItScene|null} the selected scene, null if no scene is currently selected
    this.sceneProperty = new Property( null );

    // @public technically a view Property, but convenient to put it in the model
    this.soundEnabledProperty = new BooleanProperty( true );
  }

  equalityExplorer.register( 'SolveItModel', SolveItModel );

  return inherit( Object, SolveItModel, {

    // @public
    reset: function() {

      this.challengeGenerators.forEach( function( challengeGenerator ) {
        challengeGenerator.reset();
      } );

      this.scenes.forEach( function( scene ) {
        scene.reset();
      } );

      this.sceneProperty.reset();
      this.soundEnabledProperty.reset();
    }
  } );
} );