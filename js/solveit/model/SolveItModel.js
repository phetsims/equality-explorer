// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ChallengeGenerator1 = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator1' );
  const ChallengeGenerator2 = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator2' );
  const ChallengeGenerator3 = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator3' );
  const ChallengeGenerator4 = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator4' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const SolveItScene = require( 'EQUALITY_EXPLORER/solveit/model/SolveItScene' );

  // strings
  const level1String = require( 'string!EQUALITY_EXPLORER/level1' );
  const level2String = require( 'string!EQUALITY_EXPLORER/level2' );
  const level3String = require( 'string!EQUALITY_EXPLORER/level3' );
  const level4String = require( 'string!EQUALITY_EXPLORER/level4' );

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

    // @private challenge generators, ordered by ascending level number
    this.challengeGenerators = [
      new ChallengeGenerator1(),
      new ChallengeGenerator2(),
      new ChallengeGenerator3(),
      new ChallengeGenerator4()
    ];
    assert && assert( this.challengeGenerators.length === this.levelDescriptions.length,
      'levelDescriptions and challengeGenerators must have the same number of elements' );

    // @public (read-only) {SolveItScene[]} a scene for each level
    this.scenes = [];
    for ( let i = 0; i < this.levelDescriptions.length; i++ ) {
      this.scenes.push( new SolveItScene( i + 1, this.levelDescriptions[ i ], this.challengeGenerators[ i ] ) );
    }

    // @public {SolveItScene|null} the selected scene, null if no scene is currently selected
    this.sceneProperty = new Property( null );
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
    },

    /**
     * Tests challenge generators by generating a large number of challenges.
     * Each challenge is printed to the browser console.
     * @public (debug)
     */
    testChallengeGenerators: function() {

      const testsPerLevel = 1000;

      for ( let i = 0; i < this.challengeGenerators.length; i++ ) {

        console.log( '>>> Testing level ' + ( i + 1 ) );
        const challengeGenerator = this.challengeGenerators[ i ];

        for ( let j = 0; j < testsPerLevel; j++ ) {
          const challenge = challengeGenerator.nextChallenge();
          console.log( j + ': ' + challenge.toString() );
        }
      }

      console.log( '>>> Tests passed for all levels' );
    }
  } );
} );