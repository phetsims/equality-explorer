// Copyright 2018, University of Colorado Boulder

/**
 * A scene in the 'Solve It!' screen.  A scene is created for each level in the game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Challenge = require( 'EQUALITY_EXPLORER/solveit/model/Challenge' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var Property = require( 'AXON/Property' );
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

    // Initialize locations of term creators.
    // This is necessary because this screen has no TermToolboxes.
    // Locations can be any value, since terms in this screen never return to a toolbox.
    // This is preferable to using a default value, since initialization order is important in other screens.
    // See for example frameStartedCallback in TermCreatorNode.
    this.allTermCreators.forEach( function( termCreator ) {
      termCreator.positiveLocation = Vector2.ZERO;
      termCreator.negativeLocation = Vector2.ZERO;
    } );

    // @public
    this.challengeProperty = new Property( this.challengeGenerator.nextChallenge(), {
      valueType: Challenge
    } );

    // unlink not needed
    this.challengeProperty.link( function( challenge ) {
      self.applyChallenge( challenge );
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
    },

    /**
     * Applies a challenge to the scene.
     * This maps a challenge to terms on the scale, created and managed by term creators.
     * @param {Challenge} challenge
     */
    applyChallenge: function( challenge ) {

      this.xVariable.valueProperty.value = challenge.x;

      // dispose of all terms
      this.allTermCreators.forEach( function( termCreator ) {
        termCreator.disposeAllTerms();
      } );

      // challenge form is: ax + b = mx + n
      var term;

      // a
      if ( challenge.a.getValue() !== 0 ) {
        term = this.leftVariableTermCreator.createTerm( {
          coefficient: challenge.a,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        this.leftVariableTermCreator.putTermOnPlate( term );
      }

      // b
      if ( challenge.b.getValue() !== 0 ) {
        term = this.leftConstantTermCreator.createTerm( {
          constantValue: challenge.b,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        this.leftConstantTermCreator.putTermOnPlate( term );
      }

      // m
      if ( challenge.m.getValue() !== 0 ) {
        term = this.rightVariableTermCreator.createTerm( {
          coefficient: challenge.m,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        this.rightVariableTermCreator.putTermOnPlate( term );
      }

      // n
      if ( challenge.n.getValue() !== 0 ) {
        term = this.rightConstantTermCreator.createTerm( {
          constantValue: challenge.n,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        this.rightConstantTermCreator.putTermOnPlate( term );
      }
    }
  } );
} );