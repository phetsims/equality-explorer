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

    // @public (read-only) ordered by ascending level number
    this.levelDescriptions = [
      level1String,
      level2String,
      level3String,
      level4String
    ];

    // @public (read-only) {SolveItScene[]} a scene for each level
    this.scenes = [];
    for ( var i = 0; i < this.levelDescriptions.length; i++ ) {
      this.scenes.push( new SolveItScene( i, this.levelDescriptions[ i ] ) );
    }

    // @public {SolveItScene|null} the selected scene, null if no scene is currently selected
    this.sceneProperty = new Property( null );

    // @public (read-only) reaching this score results in a reward
    this.rewardScore = 10;

    // @public technically a view Property, but convenient to put it in the model
    this.soundEnabledProperty = new BooleanProperty( true );
  }

  equalityExplorer.register( 'SolveItModel', SolveItModel );

  return inherit( Object, SolveItModel, {

    // @public
    reset: function() {
      this.scenes.forEach( function( scene ) {
        scene.reset();
      } );
      this.sceneProperty.reset();
      this.soundEnabledProperty.reset();
    }
  } );
} );