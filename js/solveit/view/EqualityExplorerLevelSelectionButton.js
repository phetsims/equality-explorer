// Copyright 2018, University of Colorado Boulder

/**
 * A game level button in the 'Solve It!' screen.
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
   * @param {GameLevel} level - the level for this button
   * @param {Property.<GameLevel>} levelProperty - the selected level
   * @param {StringProperty} stateProperty - the state of the game
   * @constructor
   */
  function EqualityExplorerLevelSelectionButton( level, levelProperty, stateProperty ) {

    // 'x' term with level number as coefficient
    var icon = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( level.levelNumber + 1 ), xString, {
      diameter: 50,
      margin: 15,
      showOne: true
    } );

    var scoreDisplay = new ScoreDisplayNumberAndStar( level.scoreProperty );

    LevelSelectionButton.call( this, icon, scoreDisplay, {
      baseColor: 'rgb( 191, 239, 254 )',
      listener: function() {
        levelProperty.value = level;
        stateProperty.value = 'playing';
      }
    } );
  }

  equalityExplorer.register( 'EqualityExplorerLevelSelectionButton', EqualityExplorerLevelSelectionButton );

  return inherit( LevelSelectionButton, EqualityExplorerLevelSelectionButton );
} );