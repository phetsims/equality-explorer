// Copyright 2017-2022, University of Colorado Boulder

/**
 * Abstract base type for a scene in Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import EqualityExplorerQueryParameters from '../EqualityExplorerQueryParameters.js';
import BalanceScale from './BalanceScale.js';
import SnapshotsCollection from './SnapshotsCollection.js';
import TermCreator from './TermCreator.js';
import Variable from './Variable.js';
import Property from '../../../../axon/js/Property.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const DEFAULT_SCALE_POSITION = new Vector2( 355, 427 );
const DRAG_BOUNDS_X_MARGIN = 20;
const DRAG_BOUNDS_Y_MARGIN = 10;
const DRAG_BOUNDS_MIN_Y = 100;
const DRAG_BOUNDS_MAX_Y = EqualityExplorerConstants.SCREEN_VIEW_LAYOUT_BOUNDS.maxY - DRAG_BOUNDS_Y_MARGIN;

type SelfOptions = {
  scalePosition?: Vector2; // determined empirically
  hasNegativeTermsInToolbox?: boolean; // if true, put negative terms in the toolbox, e.g. -x
  lockable?: boolean; // is the lock feature supported for this scene?
  icon?: Node | null; // optional icon used to represent the scene in the scene control (radio buttons)
  maxWeight?: number; // maximum weight at which a plate 'bottoms out', and won't move when more weight is added to it,
  gridRows?: number; // rows in the grid on the scale
  gridColumns?: number; // columns in the grid on the scale
  numberOfSnapshots?: number; // number of snapshots in the Snapshots accordion box
  iconSize?: Dimension2 | null; // size of term icons on the scale, computed if null
  variables?: Variable[] | null; // variables associated with the scene
};

export type EqualityExplorerSceneOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

type CreateTermCreatorsFunction = ( lockedProperty: Property<boolean> | null, tandem: Tandem ) => TermCreator[];

export default abstract class EqualityExplorerScene extends PhetioObject {

  public readonly hasNegativeTermsInToolbox: boolean;
  private readonly _icon: Node | null;
  public readonly variables: Variable[] | null;

  // creators for terms on left and right sides of scale
  public readonly leftTermCreators: TermCreator[];
  public readonly rightTermCreators: TermCreator[];

  // for operations that need to be performed on all term creators
  public readonly allTermCreators: TermCreator[];

  public readonly scale: BalanceScale;

  // drag bounds for the plates
  public readonly leftDragBounds: Bounds2;
  public readonly rightDragBounds: Bounds2;

  // collection of snapshots, for saving/restoring the state of a scene
  public readonly snapshotsCollection: SnapshotsCollection;

  // Locks equivalent terms, null if this feature is not supported.
  // See https://github.com/phetsims/equality-explorer/blob/master/doc/lock-scenarios.md for scenarios that
  // describe how this feature works with drag listeners.
  public readonly lockedProperty?: Property<boolean> | null;

  /**
   * @param createLeftTermCreators - in order that they appear in left toolbox and left side of equations
   * @param createRightTermCreators - in order that they appear in right toolbox and right side of equations
   * @param [providedOptions]
   * @abstract
   */
  protected constructor( createLeftTermCreators: CreateTermCreatorsFunction,
                         createRightTermCreators: CreateTermCreatorsFunction,
                         providedOptions: EqualityExplorerSceneOptions ) {

    const options = optionize<EqualityExplorerSceneOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      scalePosition: DEFAULT_SCALE_POSITION,
      hasNegativeTermsInToolbox: true,
      lockable: true,
      icon: null,
      maxWeight: 30,
      gridRows: EqualityExplorerQueryParameters.rows,
      gridColumns: EqualityExplorerQueryParameters.columns,
      numberOfSnapshots: 5,
      iconSize: null,
      variables: null,

      // PhetioObjectOptions
      phetioType: EqualityExplorerScene.EqualityExplorerSceneIO
    }, providedOptions );

    assert && assert( options.variables === null || options.variables.length > 0 );

    super( options );

    phet.log && phet.log( `scene: ${this.tandem.name}, maxWeight=${options.maxWeight}` );

    this.lockedProperty = null;
    if ( options.lockable ) {
      this.lockedProperty = new BooleanProperty( EqualityExplorerQueryParameters.locked, {
        tandem: options.tandem.createTandem( 'lockedProperty' )
      } );
    }

    this.hasNegativeTermsInToolbox = options.hasNegativeTermsInToolbox;
    this._icon = options.icon;
    this.variables = options.variables;

    const termCreatorsTandem = options.tandem.createTandem( 'termCreators' );

    this.leftTermCreators = createLeftTermCreators( this.lockedProperty, termCreatorsTandem.createTandem( 'leftTermCreators' ) );
    assert && validateTermCreators( this.leftTermCreators );

    this.rightTermCreators = createRightTermCreators( this.lockedProperty, termCreatorsTandem.createTandem( 'rightTermCreators' ) );
    assert && validateTermCreators( this.rightTermCreators );

    this.allTermCreators = this.leftTermCreators.concat( this.rightTermCreators );

    // Associate each term creator with a 'like term' creator on the opposite side of the scale.
    assert && assert( this.leftTermCreators.length === this.rightTermCreators.length,
      'the same number of term creators are required on both sides of the scale' );
    for ( let i = 0; i < this.leftTermCreators.length; i++ ) {
      assert && assert( this.leftTermCreators[ i ].isLikeTermCreator( this.rightTermCreators[ i ] ),
        'like term creators must have the same indices on both sides of the scale' );
      this.leftTermCreators[ i ].equivalentTermCreator = this.rightTermCreators[ i ];
      this.rightTermCreators[ i ].equivalentTermCreator = this.leftTermCreators[ i ];
    }

    this.scale = new BalanceScale( this.leftTermCreators, this.rightTermCreators, {
      position: options.scalePosition,
      gridRows: options.gridRows,
      gridColumns: options.gridColumns,
      iconSize: options.iconSize,
      maxWeight: options.maxWeight,
      tandem: options.tandem.createTandem( 'balanceScale' )
    } );

    this.leftDragBounds = new Bounds2( DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.position.x - DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MAX_Y );
    this.leftTermCreators.forEach( termCreator => {
      termCreator.dragBounds = this.leftDragBounds;
    } );

    this.rightDragBounds = new Bounds2( this.scale.position.x + DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.position.x + DRAG_BOUNDS_X_MARGIN + this.leftDragBounds.width, DRAG_BOUNDS_MAX_Y );
    this.rightTermCreators.forEach( termCreator => {
      termCreator.dragBounds = this.rightDragBounds;
    } );

    this.snapshotsCollection = new SnapshotsCollection( {
      numberOfSnapshots: options.numberOfSnapshots,
      tandem: options.tandem.createTandem( 'snapshotsCollection' )
    } );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }

  /**
   * Gets the icon used to represent this scene.
   * Since this icon is used in multiple places in the scenery DAG, it must be wrapped.
   */
  public get icon(): Node {
    const icon = this._icon!;
    assert && assert( icon );
    return new Node( { children: [ icon ] } );
  }

  public reset(): void {

    this.lockedProperty && this.lockedProperty.reset();

    // dispose all terms
    this.disposeAllTerms();

    // clear all snapshots
    this.snapshotsCollection.reset();

    // reset all variables
    if ( this.variables ) {
      this.variables.forEach( variable => variable.reset() );
    }
  }

  /**
   * Disposes of all terms that are managed by term creators.
   */
  public disposeAllTerms(): void {
    this.allTermCreators.forEach( termCreator => termCreator.disposeAllTerms() );
  }

  /**
   * Disposes of all terms that are managed by term creators and are not on the scale.
   */
  public disposeTermsNotOnScale(): void {
    this.allTermCreators.forEach( termCreator => termCreator.disposeTermsNotOnPlate() );
  }

  /**
   * Updates time-dependent parts of the scene.
   * @param dt - time since the previous step, in seconds
   */
  public step( dt: number ): void {

    // step all terms
    this.allTermCreators.forEach( termCreator => termCreator.step( dt ) );
  }

  /**
   * EqualityExplorerSceneIO handles PhET-iO serialization of EqualityExplorerScene.
   * It implements 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly EqualityExplorerSceneIO = new IOType( 'EqualityExplorerSceneIO', {
    valueType: EqualityExplorerScene,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}

/**
 * Verifies that none of the specified term creators are 'like term' creators.
 * Like term creators are not allowed on the same side of the equation.
 * For example, there should not be 2 creators for constants, or 2 creators for 'x'.
 */
function validateTermCreators( termCreators: TermCreator[] ): void {
  for ( let i = 0; i < termCreators.length; i++ ) {
    for ( let j = 0; j < termCreators.length; j++ ) {

      // skip comparisons to self
      if ( termCreators[ i ] !== termCreators[ j ] ) {
        assert && assert( !( termCreators[ i ].isLikeTermCreator( termCreators[ j ] ) ),
          'like term creators are not allowed on the same side of the equation' );
      }
    }
  }
}

equalityExplorer.register( 'EqualityExplorerScene', EqualityExplorerScene );