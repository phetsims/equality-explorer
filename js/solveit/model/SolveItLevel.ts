// Copyright 2018-2022, University of Colorado Boulder

/**
 * SolveItLevel is a level in the 'Solve It!' game screen. A level is a specialization of a scene from the 'Operations'
 * screen. (variable and constant terms on both sides of the equation), with the addition of game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
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

type SelfOptions = {
  levelNumber: number;
};

type SolveItLevelOptions = SelfOptions & PickRequired<OperationsSceneOptions, 'tandem'>;

export default class SolveItLevel extends OperationsScene {

  // integer, starting from 1
  public readonly levelNumber: number;

  // description that appears in the UI for the level
  public readonly descriptionProperty: LinkableProperty<string>;

  public readonly challengeGenerator: ChallengeGenerator;
  public readonly scoreProperty: NumberProperty;

  // the current challenge, set by nextChallenge
  public readonly challengeProperty: Property<Challenge | null>;

  // has the current challenge been solved?
  private challengeHasBeenSolved: boolean;

  // will x be on the left-side (true) or right-side (false) of the equation in the solution?
  private xOnLeft: boolean;

  private readonly leftVariableTermCreator: VariableTermCreator;
  private readonly leftConstantTermCreator: ConstantTermCreator;
  private readonly rightVariableTermCreator: VariableTermCreator;
  private readonly rightConstantTermCreator: ConstantTermCreator;

  public constructor( descriptionProperty: LinkableProperty<string>,
                      challengeGenerator: ChallengeGenerator,
                      providedOptions: SolveItLevelOptions ) {

    const options = optionize<SolveItLevelOptions, SelfOptions, OperationsSceneOptions>()( {

      // OperationsSceneOptions
      lockable: false, // lock feature is relevant for the game
      scalePosition: new Vector2( 355, 500 ), // determined empirically
      variableRange: null // because variables are not user-controlled in a game level
    }, providedOptions );

    assert && assert( Number.isInteger( options.levelNumber ) && options.levelNumber > 0 );

    super( options );

    this.levelNumber = options.levelNumber;
    this.descriptionProperty = descriptionProperty;
    this.challengeGenerator = challengeGenerator;

    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      tandem: options.tandem.createTandem( 'scoreProperty' ),
      phetioReadOnly: true
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
      isValidValue: value => ( value instanceof Challenge ) || ( value === null ),
      tandem: options.tandem.createTandem( 'challengeProperty' ),
      phetioValueType: NullableIO( Challenge.ChallengeIO ),
      phetioReadOnly: true
    } );

    this.challengeHasBeenSolved = false;
    this.xOnLeft = true;

    // Casting here is not great, but allows us to reuse OperationsScene.
    assert && assert( this.leftTermCreators.length === 2 && this.leftTermCreators[ 0 ] instanceof VariableTermCreator && this.leftTermCreators[ 1 ] instanceof ConstantTermCreator );
    assert && assert( this.rightTermCreators.length === 2 && this.rightTermCreators[ 0 ] instanceof VariableTermCreator && this.rightTermCreators[ 1 ] instanceof ConstantTermCreator );
    this.leftVariableTermCreator = this.leftTermCreators[ 0 ] as VariableTermCreator;
    this.leftConstantTermCreator = this.leftTermCreators[ 1 ] as ConstantTermCreator;
    this.rightVariableTermCreator = this.rightTermCreators[ 0 ] as VariableTermCreator;
    this.rightConstantTermCreator = this.rightTermCreators[ 1 ] as ConstantTermCreator;

    // When a universal operation is completed, determine if the challenge is solved.
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

    this.addLinkedElement( descriptionProperty, {
      tandem: options.tandem.createTandem( 'descriptionProperty' )
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
    phet.log && phet.log( `nextChallenge: challenge=${challenge}` );
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
      assert && assert( aTerm instanceof VariableTerm ); // eslint-disable-line no-simple-type-checking-assertions
      xIsIsolated = ( ( aTerm as VariableTerm ).coefficient.getValue() === 1 ); // x = n
    }
    else if ( !aTerm && bTerm && mTerm && !nTerm ) {
      // 0x + b = mx + 0
      assert && assert( mTerm instanceof VariableTerm ); // eslint-disable-line no-simple-type-checking-assertions
      xIsIsolated = ( ( mTerm as VariableTerm ).coefficient.getValue() === 1 ); // b = x
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
    const variableTerm = new VariableTerm( this.xVariable, { //TODO dynamic
      coefficient: Fraction.fromInteger( 1 ),
      diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
    } );

    // N
    const constantTerm = new ConstantTerm( { //TODO dynamic
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

equalityExplorer.register( 'SolveItLevel', SolveItLevel );