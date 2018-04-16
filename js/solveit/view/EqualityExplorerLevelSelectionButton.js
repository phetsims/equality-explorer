// Copyright 2018, University of Colorado Boulder

/**
 * Level (scene) selection button in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {SolveItScene} scene - the scene that will be selected by pressing this button
   * @param {Property.<SolveItScene>} sceneProperty - the selected scene
   * @constructor
   */
  function EqualityExplorerLevelSelectionButton( scene, sceneProperty ) {

    // 'x' term with level number as coefficient
    var icon = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( scene.levelNumber + 1 ), xString, {
      diameter: 50,
      margin: 15,
      showOne: true
    } );

    LevelSelectionButton.call( this, icon, scene.scoreProperty, {
      baseColor: 'rgb( 191, 239, 254 )',
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      listener: function() {
        sceneProperty.value = scene;
      }
    } );
  }

  equalityExplorer.register( 'EqualityExplorerLevelSelectionButton', EqualityExplorerLevelSelectionButton );

  return inherit( LevelSelectionButton, EqualityExplorerLevelSelectionButton );
} );