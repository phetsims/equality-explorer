// Copyright 2018, University of Colorado Boulder

/**
 * A scene in the 'Solve It!' screen.  A scene is created for each level in the game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalanceScale = require( 'EQUALITY_EXPLORER/common/model/BalanceScale' );
  var Challenge = require( 'EQUALITY_EXPLORER/solveit/model/Challenge' );
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var Property = require( 'AXON/Property' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} level - game level, numbered from 1 in the model and view
   * @param {string} description
   * @param {ChallengeGenerator} challengeGenerator
   * @constructor
   */
  function SolveItScene( level, description, challengeGenerator ) {

    assert && assert( level > 0, 'invalid level, numbering starts with 1: ' + level );

    var self = this;

    OperationsScene.call( this, {
      debugName: 'level ' + level,
      scaleLocation: new Vector2( 355, 500 ) // determined empirically
    } );

    // @public (read-only)
    this.level = level;
    this.description = description;
    this.challengeGenerator = challengeGenerator;

    // @public
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: function( value ) {
        return value >= 0;
      }
    } );

    //TODO default to Vector2.ZERO so that this is unnecessary?
    // Initialize locations of term creators.
    // This can be any value, since terms in this screen never return to a toolbox.
    this.allTermCreators.forEach( function( termCreator ) {
      termCreator.positiveLocation = Vector2.ZERO;
      termCreator.negativeLocation = Vector2.ZERO;
    } );

    var leftVariableTermCreator = new VariableTermCreator( this.xVariable );
    var leftConstantTermCreator = new ConstantTermCreator();
    var rightVariableTermCreator = new VariableTermCreator( this.xVariable );
    var rightConstantTermCreator = new ConstantTermCreator();

    // @public (read-only) term creators that hold terms for the challenge
    this.challengeLeftTermCreators = [ leftVariableTermCreator, leftConstantTermCreator ];
    this.challengeRightTermCreators = [ rightVariableTermCreator, rightConstantTermCreator ];

    // Challenge term creators must be associated with a scale, so that they have plates to put terms on,
    // since only the terms that are on a plate will appear in an equation. This scale is otherwise not used.
    new BalanceScale( this.challengeLeftTermCreators, this.challengeRightTermCreators ); // eslint-disable-line

    //TODO default to Vector2.ZERO so that this is unnecessary?
    // Initialize locations of term creators.
    // This can be any value, since terms in this screen never return to a toolbox.
    this.challengeLeftTermCreators.concat( this.challengeRightTermCreators ).forEach( function( termCreator ) {
      termCreator.positiveLocation = Vector2.ZERO;
      termCreator.negativeLocation = Vector2.ZERO;
    } );

    // @public
    this.challengeProperty = new Property( this.challengeGenerator.nextChallenge(), {
      valueType: Challenge
    } );

    // unlink not needed
    this.challengeProperty.link( function( challenge ) {

      self.xVariable.valueProperty.value = challenge.x;

      //TODO clear and update termCreators
    } );

    //TODO observe what's on the scale and determine when it's of the form x = N.
  }

  equalityExplorer.register( 'SolveItScene', SolveItScene );

  return inherit( OperationsScene, SolveItScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.scoreProperty.reset();
      OperationsScene.prototype.reset.call( this );
    },

    /**
     * Generates the next challenge.
     * @public
     */
    nextChallenge: function() {
      this.challengeProperty.value = this.challengeGenerator.nextChallenge();
    }
  } );
} );