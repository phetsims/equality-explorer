// Copyright 2018-2022, University of Colorado Boulder

/**
 * A scene in the 'Solve It!' screen.  A scene is created for each level in the game.
 * This is an extension of the Operations scene (variable and constant terms on both sides of the equation),
 * with the addition of game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import ConstantTerm from '../../common/model/ConstantTerm.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import VariableTerm from '../../common/model/VariableTerm.js';
import VariableTermCreator from '../../common/model/VariableTermCreator.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsScene, { OperationsSceneOptions } from '../../operations/model/OperationsScene.js';
import Challenge from './Challenge.js';
import ChallengeGenerator from './ChallengeGenerator.js';
import DebugChallenge from './DebugChallenge.js';

// constants
const POINTS_PER_CHALLENGE = 1;

type SelfOptions = EmptySelfOptions;

type SolveItSceneOptions = SelfOptions;

export default class SolveItScene extends OperationsScene {

  public readonly challengeGenerator: ChallengeGenerator;
  public readonly scoreProperty: NumberProperty;

  // the current challenge, set by nextChallenge
  public readonly challengeProperty: Property<Challenge | null>;

  // has the current challenge been solved?
  private challengeHasBeenSolved: boolean;

  // will x be on the left-side (true) or right-side (false) of the equation in the solution?
  private xOnLeft: boolean;

  public constructor( challengeGenerator: ChallengeGenerator, providedOptions?: SolveItSceneOptions ) {

    const options = optionize<SolveItSceneOptions, SelfOptions, OperationsSceneOptions>()( {

      // OperationsSceneOptions
      debugName: `level ${challengeGenerator.level}`,
      scalePosition: new Vector2( 355, 500 ), // determined empirically
      variableRange: null // because variables are not user-controlled in this scene
    }, providedOptions );

    super( options );

    this.challengeGenerator = challengeGenerator;

    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 )
    } );

    // Initialize positions of term creators. This is necessary because this screen has no TermToolboxes.
    // Positions can be any value, since terms in this screen never return to a toolbox.
    // This is preferable to using a default value, since initialization order is important in other screens.
    // See for example frameStartedCallback in TermCreatorNode.
    this.allTermCreators.forEach( termCreator => {
      termCreator.positivePosition = Vector2.ZERO;
      termCreator.negativePosition = Vector2.ZERO;
    } );

    this.challengeProperty = new Property<Challenge | null>( null, {
      isValidValue: value => ( value instanceof Challenge ) || ( value === null )
    } );

    this.challengeHasBeenSolved = false;
    this.xOnLeft = true;

    // When a universal operation is completed, determine if the challenge is solved.
    // removeListener not needed.
    this.operationCompletedEmitter.addListener( operation => {

      // All challenges in the game are equalities, and applying a universal operation should result in an equality.
      assert && assert( this.scale.angleProperty.value === 0,
        `scale is not balanced after applying operation ${operation}` );

      // challenge is in a 'solved' state if x has been isolated on the scale.
      const solved = this.isXIsolated();

      // The first time that the challenge has been solved, award points and notify listeners.
      if ( solved && !this.challengeHasBeenSolved ) {
        phet.log && phet.log( 'operationCompletedEmitter listener: challenge is solved' );
        this.challengeHasBeenSolved = true;
        this.scoreProperty.value = this.scoreProperty.value + POINTS_PER_CHALLENGE;
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    this.scoreProperty.reset();
    this.challengeProperty.reset();
    super.reset();
  }

  /**
   * Generates the next challenge.
   */
  public nextChallenge(): void {

    // reset the universal operation
    this.operatorProperty.reset();
    this.operandProperty.reset();

    // clear snapshots
    this.snapshotsCollection.reset();

    // dispose of all terms
    this.allTermCreators.forEach( termCreator => termCreator.disposeAllTerms() );

    // generate the challenge, form is: ax + b = mx + n
    let challenge = this.challengeGenerator.nextChallenge();
    if ( EqualityExplorerQueryParameters.challenge ) {
      challenge = new DebugChallenge();
    }
    phet.log && phet.log( `nextChallenge: challenge=${challenge.toString()}` );
    phet.log && phet.log( `nextChallenge: derivation=${challenge.debugDerivation.replace( /<br>/g, ', ' )}` );

    // set the value of x
    this.xVariable.valueProperty.value = challenge.x;

    // randomize whether the scale shows 'ax + b = mx + n' or 'mx + n = ax + b'
    this.xOnLeft = dotRandom.nextBoolean();
    const aTermCreator = this.xOnLeft ? this.leftVariableTermCreator : this.rightVariableTermCreator;
    const bTermCreator = this.xOnLeft ? this.leftConstantTermCreator : this.rightConstantTermCreator;
    const mTermCreator = this.xOnLeft ? this.rightVariableTermCreator : this.leftVariableTermCreator;
    const nTermCreator = this.xOnLeft ? this.rightConstantTermCreator : this.leftConstantTermCreator;

    // Create terms on the scale that correspond to the challenge.
    this.createVariableTermOnPlate( aTermCreator, challenge.a );
    this.createConstantTermOnPlate( bTermCreator, challenge.b );
    this.createVariableTermOnPlate( mTermCreator, challenge.m );
    this.createConstantTermOnPlate( nTermCreator, challenge.n );

    // The new challenge has not been solved
    this.challengeHasBeenSolved = false;

    // Finally, set challengeProperty, to notify listeners that the challenge has changed.
    this.challengeProperty.value = challenge;
  }

  /**
   * Creates a variable term on the plate. If coefficient is zero, this is a no-op.
   */
  private createVariableTermOnPlate( termCreator: VariableTermCreator, coefficient: Fraction ): void {
    if ( coefficient.getValue() !== 0 ) {
      const term = termCreator.createTerm( {
        coefficient: coefficient,
        diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
      } );
      termCreator.putTermOnPlate( term );
    }
  }

  /**
   * Creates a constant term on the plate. If constantValue is zero, this is a no-op.
   */
  private createConstantTermOnPlate( termCreator: ConstantTermCreator, constantValue: Fraction ): void {
    if ( constantValue.getValue() !== 0 ) {
      const term = termCreator.createTerm( {
        constantValue: constantValue,
        diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
      } );
      termCreator.putTermOnPlate( term );
    }
  }

  /**
   * Determines whether the value of x has been isolated on the scale.
   * This means that the scale contains either 'x = n' or 'b = x', where 'ax + b = mx + n' is the general form.
   */
  private isXIsolated(): boolean {

    let xIsIsolated = false;

    // a, b, m, n
    const aTerm = this.leftVariableTermCreator.getLikeTermOnPlate();
    const bTerm = this.leftConstantTermCreator.getLikeTermOnPlate();
    const mTerm = this.rightVariableTermCreator.getLikeTermOnPlate();
    const nTerm = this.rightConstantTermCreator.getLikeTermOnPlate();

    if ( ( aTerm && !bTerm && !mTerm && nTerm ) ) {
      // ax + 0 = 0x + n
      // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 coefficient does not exist on type Term
      xIsIsolated = ( aTerm.coefficient.getValue() === 1 ); // x = n
    }
    else if ( !aTerm && bTerm && mTerm && !nTerm ) {
      // 0x + b = mx + 0
      // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 coefficient does not exist on type Term
      xIsIsolated = ( mTerm.coefficient.getValue() === 1 ); // b = x
    }

    return xIsIsolated;
  }

  /**
   * Displays the answer to the current challenge, for debugging.
   */
  public showAnswer(): void {

    // 0 = 0
    this.allTermCreators.forEach( termCreator => termCreator.disposeAllTerms() );

    // x
    const variableTerm = new VariableTerm( this.xVariable, {
      coefficient: Fraction.fromInteger( 1 ),
      diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
    } );

    // N
    const constantTerm = new ConstantTerm( {
      constantValue: Fraction.fromInteger( this.xVariable.valueProperty.value ),
      diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
    } );

    // x = N
    if ( this.xOnLeft ) {
      this.leftVariableTermCreator.putTermOnPlate( variableTerm );
      this.rightConstantTermCreator.putTermOnPlate( constantTerm );
    }
    else {
      this.rightVariableTermCreator.putTermOnPlate( variableTerm );
      this.leftConstantTermCreator.putTermOnPlate( constantTerm );
    }

    // indicate that the challenge has been solved
    this.challengeHasBeenSolved = true;
    this.scoreProperty.value = this.scoreProperty.value + POINTS_PER_CHALLENGE;
  }
}

equalityExplorer.register( 'SolveItScene', SolveItScene );