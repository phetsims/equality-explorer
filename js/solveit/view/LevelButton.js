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
  var LevelSelectionItemNode = require( 'VEGAS/LevelSelectionItemNode' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {GameLevel} level
   * @param {Property.<GameLevel>} levelProperty
   * @param {StringProperty} stateProperty
   * @constructor
   */
  function LevelButton( level, levelProperty, stateProperty ) {

    // 'x' term with level number as coefficient
    var icon = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( level.levelNumber + 1 ), xString, {
      diameter: 50,
      margin: 15,
      showOne: true
    } );

    var scoreDisplay = new ScoreDisplayNumberAndStar( level.scoreProperty );

    LevelSelectionItemNode.call( this, icon, scoreDisplay, {
      baseColor: 'rgb( 191, 239, 254 )',
      listener: function() {
        levelProperty.value = level;
        stateProperty.value = 'playing';
      }
    } );
  }

  equalityExplorer.register( 'LevelButton', LevelButton );

  return inherit( LevelSelectionItemNode, LevelButton );
} );