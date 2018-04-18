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
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  /**
   * @param {number} level - game level, numbered from 1 in the model and view
   * @param {string} description
   * @param {ChallengeGenerator} challengeGenerator
   * @constructor
   */
  function SolveItScene( level, description, challengeGenerator ) {

    assert && assert( level > 0, 'invalid level, numbering starts with 1: ' + level );

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
      this.challengeProperty.reset();
      OperationsScene.prototype.reset.call( this );
    },

    /**
     * Generates the next challenge.
     * @public
     */
    nextChallenge: function() {

      // dispose of all terms
      this.allTermCreators.forEach( function( termCreator ) {
        termCreator.disposeAllTerms();
      } );

      // generate the challenge, form is: ax + b = mx + n
      var challenge = this.challengeGenerator.nextChallenge();

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
    }
  } );
} );