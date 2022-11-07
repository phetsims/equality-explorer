// Copyright 2018-2022, University of Colorado Boulder

/**
 * TermCreator is the abstract base type for creating and managing terms.
 *
 * Terms can be created in 3 ways:
 * - by dragging them out of a toolbox below a plate
 * - by restoring a snapshot
 * - by using the 'universal operation' control.
 *
 * TermCreators operate in one of two modes, based on the value of {boolean} this.combineLikeTermsEnabled:
 * true: each term *type* occupies one cell on the scale, and all like terms are combined
 * false: each term *instance* occupies one cell on the scale, and terms are combined only if they sum to zero
 *
 * See https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md
 * for a detailed description of how the PhET 'creator pattern' is applied in this simulation.
 *
 * Note that TermCreator is not involved with Terms that are created for snapshots. Those terms are created
 * and managed by Snapshot. See https://github.com/phetsims/equality-explorer/issues/199
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import { Node, PressListenerEvent, SceneryEvent } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import Plate from './Plate.js';
import Term, { TermOptions } from './Term.js';
import UniversalOperation from './UniversalOperation.js';
import Variable from './Variable.js';
import TermNode from '../view/TermNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {

  // null if the term is a constant
  variable?: Variable | null;

  // dragging is constrained to these bounds
  dragBounds?: Bounds2;

  // Like terms will occupy this cell in the plate's 2D grid.
  // null means 'no cell', and like terms will not be combined.
  likeTermsCell?: number | null;

  // locks equivalent terms, null if this feature is not supported
  lockedProperty?: Property<boolean> | null;
};

export type TermCreatorOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// sign that will be applied to terms that are created
export type TermCreatorSign = 1 | -1;

// options to createTerm, createTermProtected, and createZeroTerm
export type CreateTermOptions = {
  sign?: TermCreatorSign;
  event?: PressListenerEvent | null; // non-null if the term is created as the result of a user interaction
} & TermOptions;

export default abstract class TermCreator extends PhetioObject {

  public readonly variable: Variable | null;

  // The plate that this term creator is associated with.
  // null during deferred initialization, see set plate() for notes.
  private _plate: Plate | null;

  // Positions of the associated positive and negative TermCreatorNodes.
  // null during deferred initialization, see set positivePosition() and set negativePosition() for notes.
  private _positivePosition: Vector2 | null;
  private _negativePosition: Vector2 | null;

  // like terms will be combined in this cell in the plate's 2D grid
  public readonly likeTermsCell: number | null;

  // Convenience property, so we don't need to test the type of likeTermsCell.
  public readonly combineLikeTermsEnabled: boolean;

  // drag bounds for terms created
  public dragBounds: Bounds2;

  // All 'managed' terms that currently exist. Managed terms include those on the balance scale, those being dragged
  // by the user, and those that are animating. It does not include terms that are part of a snapshot.
  private readonly allTerms: ObservableArray<Term>;

  // terms that are on the plate, a subset of this.allTerms
  protected readonly termsOnPlate: ObservableArray<Term>;

  // number of term on the associated plate, so we don't have to make this.termsOnPlate public
  public readonly numberOfTermsOnPlateProperty: TReadOnlyProperty<number>;

  // Weight of the terms that are on the plate
  public readonly weightOnPlateProperty: TReadOnlyProperty<Fraction>;

  // Emit is called when a term is created.
  // The event arg is non-null if the term was created as the result of a user interaction.
  public readonly termCreatedEmitter: Emitter<[ TermCreator, Term, PressListenerEvent | null ]>;

  // Emit is called when adding a term to the plate would cause EqualityExplorerQueryParameters.maxInteger
  // to be exceeded. See https://github.com/phetsims/equality-explorer/issues/48
  public readonly maxIntegerExceededEmitter: Emitter;

  // Optional equivalent term creator on the opposite side of the scale. This is needed
  // for the lock feature, which involves creating an equivalent term on the opposite side of the scale.
  // Example: When locked, if you drag -x out of the left toolbox, -x must also drag out of the right toolbox.
  // Because this is a 2-way association, initialization is deferred until after instantiation.
  // See set equivalentTermCreator() for notes.
  private _equivalentTermCreator: TermCreator | null;

  // indicates whether this term creator is locked to _equivalentTermCreator
  public readonly lockedProperty: Property<boolean>;

  // called when a term is disposed
  private readonly termDisposedListener: ( term: Term ) => void;

  protected constructor( providedOptions: TermCreatorOptions ) {

    const options = optionize<TermCreatorOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      variable: null,
      dragBounds: Bounds2.EVERYTHING,
      likeTermsCell: null,
      lockedProperty: null,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.variable = options.variable;
    this._plate = null;
    this._positivePosition = null;
    this._negativePosition = null;
    this.likeTermsCell = options.likeTermsCell;
    this.combineLikeTermsEnabled = ( options.likeTermsCell !== null );
    this.dragBounds = options.dragBounds;
    this.allTerms = createObservableArray();
    this.termsOnPlate = createObservableArray();

    this.numberOfTermsOnPlateProperty = new DerivedProperty(
      [ this.termsOnPlate.lengthProperty ], length => length, {
        tandem: options.tandem.createTandem( 'numberOfTermsOnPlateProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'Number of terms on the plate that were created by this term creator'
      } );

    const weightOnPlateDependencies = [ this.numberOfTermsOnPlateProperty ];
    if ( options.variable ) {
      weightOnPlateDependencies.push( options.variable.valueProperty );
    }

    this.weightOnPlateProperty = DerivedProperty.deriveAny( weightOnPlateDependencies,
      () => {
        let weight = Fraction.fromInteger( 0 );
        for ( let i = 0; i < this.termsOnPlate.length; i++ ) {
          weight = weight.plus( this.termsOnPlate.get( i ).weight ).reduced();
        }
        return weight;
      }, {
        valueType: Fraction,
        useDeepEquality: true, // set value only if truly different, prevents costly unnecessary notifications
        tandem: options.tandem.createTandem( 'weightOnPlateProperty' ),
        phetioValueType: Fraction.FractionIO,
        phetioDocumentation: 'Weight of the terms on the plate that were created by this term creator'
      } );

    this.termCreatedEmitter = new Emitter( {
      parameters: [
        { valueType: TermCreator },
        { valueType: Term },
        { valueType: [ SceneryEvent, null ] }
      ]
    } );

    this.maxIntegerExceededEmitter = new Emitter();

    this._equivalentTermCreator = null;

    // If options.lockedProperty was not provided, then create a Property that permanently turns this feature off.
    this.lockedProperty = options.lockedProperty || new BooleanProperty( false, {
      validValues: [ false ]
      // Do not instrument, this feature is off.
    } );

    this.termDisposedListener = ( term: Term ) => this.unmanageTerm( term );

    // When locked changes...
    this.lockedProperty.lazyLink( locked => {

      // If lock feature is turned on, verify that an equivalentTermCreator has been provided.
      assert && assert( !locked || this.equivalentTermCreator, 'lock feature requires equivalentTermCreator' );

      // Changing lock state causes all terms that are not on the plate to be disposed.
      this.disposeTermsNotOnPlate();
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Initializes the plate that this TermCreator is associated with. This association necessarily occurs
   * after instantiation, since TermCreators are instantiated before Plates, and the association is 2-way.
   */
  public set plate( value: Plate ) {
    assert && assert( !this._plate, 'attempted to initialize plate twice' );
    this._plate = value;
  }

  /**
   * Gets the plate that this TermCreator is associated with.
   */
  public get plate(): Plate {
    const plate = this._plate!;
    assert && assert( plate, 'attempt to access plate before it was initialized' );
    return plate;
  }

  /**
   * Initializes the position of the positive TermCreatorNode.
   * The value is dependent on the view and is unknowable until the sim has loaded.
   * See TermCreatorNode.frameStartedCallback for initialization.
   */
  public set positivePosition( value: Vector2 ) {
    assert && assert( !this._positivePosition, 'attempted to initialize positivePosition twice' );
    this._positivePosition = value;
  }

  /**
   * Gets the position of the positive TermCreatorNode.
   */
  public get positivePosition(): Vector2 {
    const position = this._positivePosition!;
    assert && assert( position, 'attempt to access positivePosition before it was initialized' );
    return position;
  }

  /**
   * Initializes the position of the optional negative TermCreatorNode.
   * The value is dependent on the view and is unknowable until the sim has loaded.
   * See TermCreatorNode.frameStartedCallback for initialization.
   */
  public set negativePosition( value: Vector2 ) {
    assert && assert( !this._negativePosition, 'attempted to initialize negativePosition twice' );
    this._negativePosition = value;
  }

  /**
   * Gets the position of the optional negative TermCreatorNode.
   */
  public get negativePosition(): Vector2 {
    const position = this._negativePosition!;
    assert && assert( position, 'attempt to access negativePosition before it was initialized' );
    return position;
  }

  /**
   * Initializes the optional equivalent TermCreator for the opposite plate, required for the optional 'lock' feature.
   * This association necessarily occurs after instantiation because it's a 2-way association.
   */
  public set equivalentTermCreator( value: TermCreator ) {
    assert && assert( !this._equivalentTermCreator, 'attempted to initialize equivalentTermCreator twice' );
    assert && assert( this.isLikeTermCreator( value ), `value is not a like TermCreator: ${value}` );
    this._equivalentTermCreator = value;
  }

  /**
   * Gets the optional equivalent TermCreator for the opposite plate.
   */
  public get equivalentTermCreator(): TermCreator {
    const equivalentTermCreator = this._equivalentTermCreator!;
    assert && assert( equivalentTermCreator, 'attempt to access equivalentTermCreator before it was initialized' );
    return equivalentTermCreator;
  }

  /**
   * Given a term, gets the position for an equivalent term on the opposite side of the scale.
   * When locked, equivalent terms track the y coordinate of their associated term, but their
   * x coordinate is offset by the distance between their associated toolbox positions.
   */
  public getEquivalentTermPosition( term: Term ): Vector2 {
    assert && assert( this.isManagedTerm( term ), `term is not managed by this TermCreator: ${term}` );

    let xOffset;
    if ( term.significantValue.getValue() >= 0 ) {
      xOffset = this.equivalentTermCreator.positivePosition.x - this.positivePosition.x;
    }
    else {
      xOffset = this.equivalentTermCreator.negativePosition.x - this.negativePosition.x;
    }

    return term.positionProperty.value.plusXY( xOffset, 0 );
  }

  /**
   * Animates terms.
   * @param dt - time since the previous step, in seconds
   */
  public step( dt: number ): void {

    // operate on a copy, since step may involve modifying the array
    const allTermsCopy = this.allTerms.getArrayCopy();
    for ( let i = 0; i < allTermsCopy.length; i++ ) {
      const term = allTermsCopy[ i ];

      // Stepping a term may result in other term(s) being disposed, so only step terms
      // that have not been disposed. See https://github.com/phetsims/equality-explorer/issues/94.
      if ( !term.isDisposed ) {
        allTermsCopy[ i ].step( dt );
      }
    }
  }

  /**
   * Creates a term. Subclasses must override this method to expand the type definition of providedOptions, including
   * properties that are specific to the subclass. The subclass implementation will then call super.createTerm.
   *
   * NOTE: Using TypeScript generics to parameterize the type of providedOptions would have been preferred if this sim
   * had originally been written in TypeScript. But that was not possible with the current JavaScript implementation.
   * Generics introduced other problems that were not straightforward to resolve.
   */
  public createTerm( providedOptions?: CreateTermOptions ): Term {

    const options = combineOptions<CreateTermOptions>( {
      sign: 1,
      event: null
    }, providedOptions );

    // create term
    const term = this.createTermProtected( options );

    // manage the term
    this.manageTerm( term, options.event );

    return term;
  }

  /**
   * Tells this term creator to manage a term.  Once managed, a term cannot be unmanaged - it's a life commitment!
   * @param term
   * @param event - non-null if term was created as the result of a user interaction
   */
  private manageTerm( term: Term, event: PressListenerEvent | null = null ): void {
    assert && assert( !term.isDisposed, `term is disposed: ${term}` );
    assert && assert( !this.isManagedTerm( term ), `term is already managed: ${term}` );

    this.allTerms.add( term );

    // set the term's drag bounds
    term.dragBounds = this.dragBounds;

    // set the term's toolboxPosition, so that it knows how to animate back to the toolbox
    if ( term.significantValue.getValue() >= 0 ) {
      term.toolboxPosition = this.positivePosition;
    }
    else {
      assert && assert( this.negativePosition, 'negativePosition has not been initialized' );
      term.toolboxPosition = this.negativePosition;
    }

    // Clean up when the term is disposed.
    // removeListener required when the term is disposed, see termWasDisposed.
    term.disposedEmitter.addListener( this.termDisposedListener );

    // Notify listeners that a term is being managed by this term creator.
    // This will result in creation of the corresponding view.
    this.termCreatedEmitter.emit( this, term, event );
  }

  /**
   * Called when Term.dispose is called.
   */
  private unmanageTerm( term: Term ): void {

    // ORDER IS VERY IMPORTANT HERE!
    if ( this.isTermOnPlate( term ) ) {
      this.removeTermFromPlate( term );
    }

    if ( this.allTerms.includes( term ) ) {
      this.allTerms.remove( term );
    }

    if ( term.disposedEmitter.hasListener( this.termDisposedListener ) ) {
      term.disposedEmitter.removeListener( this.termDisposedListener );
    }
  }

  /**
   * Is the specified term managed by this term creator?
   */
  private isManagedTerm( term: Term ): boolean {
    return this.allTerms.includes( term );
  }

  /**
   * Puts a term on the plate. If the term wasn't already managed, it becomes managed.
   * @param term
   * @param [cell] - cell in the plate's 2D grid, defaults to this.likeTermsCell when combining like terms
   */
  public putTermOnPlate( term: Term, cell?: number ): void {
    assert && assert( !this.termsOnPlate.includes( term ), `term already on plate: ${term}` );

    if ( cell === undefined && this.combineLikeTermsEnabled ) {
      const likeTermsCell = this.likeTermsCell!;
      assert && assert( likeTermsCell !== null );
      cell = likeTermsCell;
    }
    assert && assert( cell !== undefined, 'cell is undefined' );

    // ORDER IS VERY IMPORTANT HERE!
    if ( !this.isManagedTerm( term ) ) {
      this.manageTerm( term, null );
    }
    this.plate.addTerm( term, cell! );
    this.termsOnPlate.push( term );
    term.onPlateProperty.value = true;

    assert && assert( !this.combineLikeTermsEnabled || this.termsOnPlate.length <= 1,
      `when combineLikeTermsEnabled, there should be at most 1 term on plate: ${this.termsOnPlate.length}` );
  }

  /**
   * Removes a term from the plate.
   * @param term
   * @returns the cell that the term was removed from
   */
  public removeTermFromPlate( term: Term ): number {
    assert && assert( this.allTerms.includes( term ), `term not found: ${term}` );
    assert && assert( this.termsOnPlate.includes( term ), `term not on plate: ${term}` );

    // ORDER IS VERY IMPORTANT HERE!
    const cell = this.plate.removeTerm( term );
    this.termsOnPlate.remove( term );
    if ( !term.onPlateProperty.isDisposed ) {
      term.onPlateProperty.value = false;
    }
    return cell;
  }

  /**
   * Is the specified term on the plate?
   */
  public isTermOnPlate( term: Term ): boolean {
    return this.termsOnPlate.includes( term );
  }

  /**
   * Gets the terms that are on the plate.
   */
  public getTermsOnPlate(): Term[] {
    return this.termsOnPlate.getArrayCopy(); // defensive copy
  }

  /**
   * Gets the positive terms on the plate.
   */
  public getPositiveTermsOnPlate(): Term[] {
    return _.filter( this.termsOnPlate, term => ( term.sign === 1 ) );
  }

  /**
   * Gets the negative terms on the plate.
   */
  public getNegativeTermsOnPlate(): Term[] {
    return _.filter( this.termsOnPlate, term => ( term.sign === -1 ) );
  }

  /**
   * Gets the term that occupies the 'like terms' cell on the plate.
   */
  public getLikeTermOnPlate(): Term | null {
    assert && assert( this.combineLikeTermsEnabled, 'getLikeTermOnPlate is only supported when combineLikeTermsEnabled' );
    assert && assert( this.termsOnPlate.length <= 1, 'expected at most 1 term on plate' );

    const likeTermsCell = this.likeTermsCell!;
    assert && assert( likeTermsCell !== null );
    return this.plate.getTermInCell( likeTermsCell );
  }

  /**
   * Disposes of all terms.
   */
  public disposeAllTerms(): void {

    // operate on a copy, since dispose causes the ObservableArrayDef to be modified
    this.disposeTerms( this.allTerms.getArrayCopy() );
  }

  /**
   * Disposes of all terms that are on the plate.
   */
  public disposeTermsOnPlate(): void {

    // operate on a copy, since dispose causes the ObservableArrayDef to be modified
    this.disposeTerms( this.termsOnPlate.getArrayCopy() );
    this.hideAllTermHalos();
  }

  /**
   * Disposes of all terms that are NOT on the plate.
   */
  public disposeTermsNotOnPlate(): void {
    this.disposeTerms( _.difference( this.allTerms, this.termsOnPlate ) );
    this.hideAllTermHalos();
  }

  /**
   * Disposes of some collection of terms.
   */
  private disposeTerms( terms: Term[] ): void {
    for ( let i = 0; i < terms.length; i++ ) {
      const term = terms[ i ];
      if ( !term.isDisposed ) {
        term.dispose(); // results in call to unmanageTerm
      }
      else {
        // workaround for https://github.com/phetsims/equality-explorer/issues/88
        phet.log && phet.log( `Oops! term was already disposed, cleaning up: ${term}`, { color: 'red' } );
        this.unmanageTerm( term );
      }
    }
  }

  /**
   * Hides halos for all terms. This is done as part of disposeTermsOnPlate and disposeTermsNotOnPlate,
   * so that some term is not left with its halo visible after the term that it overlapped disappears.
   * See https://github.com/phetsims/equality-explorer/issues/59.
   */
  private hideAllTermHalos(): void {
    for ( let i = 0; i < this.allTerms.length; i++ ) {
      this.allTerms.get( i ).haloVisibleProperty.value = false;
    }
  }

  /**
   * Do this TermCreator and the specified TermCreator create like terms?
   */
  public isLikeTermCreator( termCreator: TermCreator ): boolean {

    // Create 2 terms via createTermProtected, not createTerm, so that they are not managed.
    const thisTerm = this.createTermProtected();
    const thatTerm = termCreator.createTermProtected();

    // If the 2 terms are 'like' then the creators are 'like'.
    const isLike = thisTerm.isLikeTerm( thatTerm );

    // Dispose of the terms.
    thisTerm.dispose();
    thatTerm.dispose();

    return isLike;
  }

  /**
   * Applies an operation to terms on the plate.
   * @param operation
   * @returns true if the operation resulted in a term on the plate becoming zero, false otherwise
   */
  public applyOperation( operation: UniversalOperation ): boolean {

    assert && assert( this.combineLikeTermsEnabled,
      'applyOperation is only supported when combining like terms' );
    assert && assert( this.termsOnPlate.length <= 1,
      `expected at most 1 term on plate: ${this.termsOnPlate.length}` );

    let summedToZero = false;
    let plateWasEmpty = false;

    const likeTermsInCell = this.likeTermsCell!;
    assert && assert( likeTermsInCell !== null );

    // Get the term on the plate, or use zero term
    let term = this.plate.getTermInCell( likeTermsInCell );
    if ( !term ) {
      plateWasEmpty = true;
      term = this.createZeroTerm( {
        diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
      } );
    }

    // Apply the operation to the term. Returns null if the operation was not applicable to the term.
    const newTerm = term.applyOperation( operation );

    if ( newTerm ) {

      // dispose of the term
      term.dispose();

      if ( newTerm.sign === 0 ) {
        summedToZero = !plateWasEmpty;
      }
      else {

        // manage the new term and put it on the plate
        this.putTermOnPlate( newTerm, likeTermsInCell );
      }
    }

    return summedToZero;
  }

  //-------------------------------------------------------------------------------------------------
  // Below here are @abstract methods, to be implemented by subclasses
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates the icon used to represent this term in the TermsToolboxNode and equations.
   */
  public abstract createIcon( sign?: TermCreatorSign ): Node;

  /**
   * Instantiates a term.
   */
  protected abstract createTermProtected( providedOptions?: CreateTermOptions ): Term;

  /**
   * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
   * The term is not managed by the TermCreator, so the implementation in subclasses should typically call
   * createTermProtected instead of createTerm.
   */
  public abstract createZeroTerm( providedOptions?: CreateTermOptions ): Term;

  /**
   * Instantiates the Node that corresponds to a term.
   */
  public abstract createTermNode( term: Term ): TermNode;

  /**
   * Subclasses must implement this method to provide 'useful information', to appease
   * TS ESLint rule @typescript-eslint/no-base-to-string. See https://github.com/phetsims/chipper/issues/1338
   */
  public abstract override toString(): string;
}

equalityExplorer.register( 'TermCreator', TermCreator );