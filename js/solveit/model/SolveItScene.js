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
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // constants
  var POINTS_PER_CHALLENGE = 1;

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

    // @public (read-only) {Property.<Challenge|null>} the current challenge, set by nextChallenge
    this.challengeProperty = new Property( null, {
      isValidValue: function( value ) {
        return ( value instanceof Challenge ) || ( value === null );
      }
    } );

    // @private has the current challenge has been solved?
    this.challengeHasBeenSolved = false;

    // @public (read-only) emit is called the first time that the current challenge is solved
    this.challengeSolvedEmitter = new Emitter();

    // When a universal operation is completed, determine if the challenge is solved
    this.operationCompletedEmitter.addListener( function( operation ) {

      // All challenges in the game are equalities, and applying a universal operation should result in an equality.
      assert && assert( self.scale.angleProperty.value === 0,
        'scale is not balanced after applying operation ' + operation );

      // challenge is in a 'solved' state if x has been isolated on the scale.
      var solved = self.isXIsolated();

      // The first time that the challenge has been solved, award points and notify listeners.
      if ( solved && !self.challengeHasBeenSolved ) {
        self.challengeHasBeenSolved = true;
        self.scoreProperty.value = self.scoreProperty.value + POINTS_PER_CHALLENGE;
        self.challengeSolvedEmitter.emit();
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

      // reset the universal operation control
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

      // The new challenge is has not been solved
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
     * This means that the scale contains either 'x = N' or 'N = x', where N is the value of x.
     * @returns {boolean}
     * @private
     */
    isXIsolated: function() {

      var xIsIsolated = false;

      var leftVariableTerm = this.leftVariableTermCreator.getLikeTermOnPlate();
      var leftConstantTerm = this.leftConstantTermCreator.getLikeTermOnPlate();
      var rightVariableTerm = this.rightVariableTermCreator.getLikeTermOnPlate();
      var rightConstantTerm = this.rightConstantTermCreator.getLikeTermOnPlate();

      if ( ( leftVariableTerm && !leftConstantTerm && !rightVariableTerm && rightConstantTerm ) ) {
        // x = N
        xIsIsolated = ( leftVariableTerm.coefficient.getValue() === 1 );
      }
      else if ( !leftVariableTerm && leftConstantTerm && rightVariableTerm && !rightConstantTerm ) {
        // N = x
        xIsIsolated = ( rightVariableTerm.coefficient.getValue() === 1 );
      }

      return xIsIsolated;
    }
  } );
} );