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
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var Property = require( 'AXON/Property' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );
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

    //TODO make this less hardcoded, or assert that types are as expected
    var leftVariableTermCreator = this.leftTermCreators[ 0 ];
    var leftConstantTermCreator = this.leftTermCreators[ 1 ];
    var rightVariableTermCreator = this.rightTermCreators[ 0 ];
    var rightConstantTermCreator = this.rightTermCreators[ 1 ];

    // @public
    this.challengeProperty = new Property( this.challengeGenerator.nextChallenge(), {
      valueType: Challenge
    } );

    // unlink not needed
    this.challengeProperty.link( function( challenge ) {

      self.xVariable.valueProperty.value = challenge.x;

      // dispose of all terms
      self.allTermCreators.forEach( function( termCreator ) {
        termCreator.disposeAllTerms();
      } );

      // Create terms that correspond to the challenge, and put them on the scale.
      // challenge form is: ax + b = mx + n
      var term;

      // a
      if ( challenge.a.getValue() !== 0 ) {
        term = new VariableTerm( self.xVariable, {
          coefficient: challenge.a,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        //TODO default to cell=likeTermsCell when termCreator.combineLikeTermsEnabled, since nothing else should be specified
        leftVariableTermCreator.putTermOnPlate( term, leftVariableTermCreator.likeTermsCell );
      }

      // b
      if ( challenge.b.getValue() !== 0 ) {
        term = new ConstantTerm( {
          constantValue: challenge.b,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        leftConstantTermCreator.putTermOnPlate( term, leftConstantTermCreator.likeTermsCell );
      }

      // m
      if ( challenge.m.getValue() !== 0 ) {
        term = new VariableTerm( self.xVariable, {
          coefficient: challenge.m,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        rightVariableTermCreator.putTermOnPlate( term, rightVariableTermCreator.likeTermsCell );
      }

      // n
      if ( challenge.n.getValue() !== 0 ) {
        term = new ConstantTerm( {
          constantValue: challenge.n,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        rightConstantTermCreator.putTermOnPlate( term, rightConstantTermCreator.likeTermsCell );
      }
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