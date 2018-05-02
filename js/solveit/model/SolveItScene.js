// Copyright 2018, University of Colorado Boulder

/**
 * A scene in the 'Solve It!' screen.  A scene is created for each level in the game.
 * This is an extension of the Operations scene (variable and constant terms on both sides of the equation),
 * with the addition of game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Challenge = require( 'EQUALITY_EXPLORER/solveit/model/Challenge' );
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var DebugChallenge = require( 'EQUALITY_EXPLORER/solveit/model/DebugChallenge' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var Property = require( 'AXON/Property' );
  var UniversalOperation = require( 'EQUALITY_EXPLORER/common/model/UniversalOperation' );
  var Vector2 = require( 'DOT/Vector2' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // constants
  var POINTS_PER_CHALLENGE = 1;

  /**
   * @param {number} level - game level, numbered from 1 in the model and view
   * @param {string} description - displayed in the status bar
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

    // Initialize locations of term creators. This is necessary because this screen has no TermToolboxes.
    // Locations can be any value, since terms in this screen never return to a toolbox.
    // This is preferable to using a default value, since initialization order is important in other screens.
    // See for example frameStartedCallback in TermCreatorNode.
    this.allTermCreators.forEach( function( termCreator ) {
      termCreator.positiveLocation = Vector2.ZERO;
      termCreator.negativeLocation = Vector2.ZERO;
    } );

    // @public (read-only) {Property.<Challenge|null>} the current challenge, set by nextChallenge
    this.challengeProperty = new Property( null, {
      isValidValue: function( value ) {
        return ( value instanceof Challenge ) || ( value === null );
      }
    } );

    // @private has the current challenge been solved?
    this.challengeHasBeenSolved = false;

    // When a universal operation is completed, determine if the challenge is solved.
    // removeListener not needed.
    this.operationCompletedEmitter.addListener( function( operation ) {

      assert && assert( operation instanceof UniversalOperation, 'invalid operation: ' + operation );

      // All challenges in the game are equalities, and applying a universal operation should result in an equality.
      assert && assert( self.scale.angleProperty.value === 0,
        'scale is not balanced after applying operation ' + operation );

      // challenge is in a 'solved' state if x has been isolated on the scale.
      var solved = self.isXIsolated();

      // The first time that the challenge has been solved, award points and notify listeners.
      if ( solved && !self.challengeHasBeenSolved ) {
        phet.log && phet.log( 'operationCompletedEmitter listener: challenge is solved' );
        self.challengeHasBeenSolved = true;
        self.scoreProperty.value = self.scoreProperty.value + POINTS_PER_CHALLENGE;
      }
    } );
  }

  equalityExplorer.register( 'SolveItScene', SolveItScene );

  return inherit( OperationsScene, SolveItScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.scoreProperty.reset();
      this.challengeProperty.reset();
      OperationsScene.prototype.reset.call( this );
    },

    /**
     * Generates the next challenge.
     * @public
     */
    nextChallenge: function() {

      // reset the universal operation
      this.operatorProperty.reset();
      this.operandProperty.reset();

      // clear snapshots
      this.snapshotsCollection.reset();

      // dispose of all terms
      this.allTermCreators.forEach( function( termCreator ) {
        termCreator.disposeAllTerms();
      } );

      // generate the challenge, form is: ax + b = mx + n
      var challenge = this.challengeGenerator.nextChallenge();
      if ( EqualityExplorerQueryParameters.challenge ) {
        challenge = new DebugChallenge();
      }
      phet.log && phet.log( 'nextChallenge: challenge=' + challenge.toString() );
      phet.log && phet.log( 'nextChallenge: derivation=' + challenge.debugDerivation.replace( /<br>/g, ', ' ) );

      // set the value of x
      this.xVariable.valueProperty.value = challenge.x;

      // randomize whether the scale shows 'ax + b = mx + n' or 'mx + n = ax + b'
      var reflect = phet.joist.random.nextBoolean();
      var aTermCreator = reflect ? this.leftVariableTermCreator : this.rightVariableTermCreator;
      var bTermCreator = reflect ? this.leftConstantTermCreator : this.rightConstantTermCreator;
      var mTermCreator = reflect ? this.rightVariableTermCreator : this.leftVariableTermCreator;
      var nTermCreator = reflect ? this.rightConstantTermCreator : this.leftConstantTermCreator;

      // Create terms on the scale that correspond to the challenge.
      this.createVariableTermOnPlate( aTermCreator, challenge.a );
      this.createConstantTermOnPlate( bTermCreator, challenge.b );
      this.createVariableTermOnPlate( mTermCreator, challenge.m );
      this.createConstantTermOnPlate( nTermCreator, challenge.n );

      // The new challenge has not been solved
      this.challengeHasBeenSolved = false;

      // Finally, set challengeProperty, to notify listeners that the challenge has changed.
      this.challengeProperty.value = challenge;
    },

    /**
     * Creates a variable term on the plate. If coefficient is zero, this is a no-op.
     * @param {VariableTermCreator} termCreator
     * @param {Fraction} coefficient
     * @private
     */
    createVariableTermOnPlate: function( termCreator, coefficient ) {
      assert && assert( termCreator instanceof VariableTermCreator, 'invalid termCreator: ' + termCreator );
      assert && assert( coefficient instanceof Fraction, 'invalid coefficient: ' + coefficient );
      if ( coefficient.getValue() !== 0 ) {
        var term = termCreator.createTerm( {
          coefficient: coefficient,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        termCreator.putTermOnPlate( term );
      }
    },

    /**
     * Creates a constant term on the plate. If constantValue is zero, this is a no-op.
     * @param {ConstantTermCreator} termCreator
     * @param {Fraction} constantValue
     * @private
     */
    createConstantTermOnPlate: function( termCreator, constantValue ) {
      assert && assert( termCreator instanceof ConstantTermCreator, 'invalid termCreator: ' + termCreator );
      assert && assert( constantValue instanceof Fraction, 'invalid constantValue: ' + constantValue );
      if ( constantValue.getValue() !== 0 ) {
        var term = termCreator.createTerm( {
          constantValue: constantValue,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        termCreator.putTermOnPlate( term );
      }
    },

    /**
     * Determines whether the value of x has been isolated on the scale.
     * This means that the scale contains either 'x = n' or 'b = x', where 'ax + b = mx + n' is the general form.
     * @returns {boolean}
     * @private
     */
    isXIsolated: function() {

      var xIsIsolated = false;

      // a, b, m, n
      var aTerm = this.leftVariableTermCreator.getLikeTermOnPlate();
      var bTerm = this.leftConstantTermCreator.getLikeTermOnPlate();
      var mTerm = this.rightVariableTermCreator.getLikeTermOnPlate();
      var nTerm = this.rightConstantTermCreator.getLikeTermOnPlate();

      if ( ( aTerm && !bTerm && !mTerm && nTerm ) ) {
        // ax + 0 = 0x + n
        xIsIsolated = ( aTerm.coefficient.getValue() === 1 ); // x = n
      }
      else if ( !aTerm && bTerm && mTerm && !nTerm ) {
        // 0x + b = mx + 0
        xIsIsolated = ( mTerm.coefficient.getValue() === 1 ); // b = x
      }

      return xIsIsolated;
    },

    /**
     * Goes immediately to the answer, for debugging.
     * @public
     */
    showAnswer: function() {
      //TODO
      console.log( 'SolveItScene.showAnswer' );
    }
  } );
} );