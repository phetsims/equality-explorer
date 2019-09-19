// Copyright 2018, University of Colorado Boulder

/**
 * Level (scene) selection button in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  const ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  const VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  // strings
  const xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {SolveItScene} scene - the scene that will be selected by pressing this button
   * @param {Property.<SolveItScene>} sceneProperty - the selected scene
   * @constructor
   */
  function EqualityExplorerLevelSelectionButton( scene, sceneProperty ) {

    // 'x' term with level number as coefficient
    const icon = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( scene.level ), xString, {
      diameter: 50,
      margin: 15,
      showOne: true
    } );

    LevelSelectionButton.call( this, icon, scene.scoreProperty, {
      baseColor: 'rgb( 191, 239, 254 )',
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      listener: function() {
        phet.log && phet.log( 'Level' + scene.level + ' button pressed' );
        sceneProperty.value = scene;
      }
    } );
  }

  equalityExplorer.register( 'EqualityExplorerLevelSelectionButton', EqualityExplorerLevelSelectionButton );

  return inherit( LevelSelectionButton, EqualityExplorerLevelSelectionButton );
} );