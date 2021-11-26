// Copyright 2017-2021, University of Colorado Boulder

/**
 * Abstract base type for a scene in Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import EqualityExplorerQueryParameters from '../EqualityExplorerQueryParameters.js';
import BalanceScale from './BalanceScale.js';
import SnapshotsCollection from './SnapshotsCollection.js';

// constants
const DEFAULT_SCALE_POSITION = new Vector2( 355, 427 );
const DRAG_BOUNDS_X_MARGIN = 20;
const DRAG_BOUNDS_Y_MARGIN = 10;
const DRAG_BOUNDS_MIN_Y = 100;
const DRAG_BOUNDS_MAX_Y = EqualityExplorerConstants.SCREEN_VIEW_OPTIONS.layoutBounds.maxY - DRAG_BOUNDS_Y_MARGIN;

class EqualityExplorerScene {

  /**
   * @param {TermCreator[]} leftTermCreators - in order that they appear in left toolbox and left side of equations
   * @param {TermCreator[]} rightTermCreators - in order that they appear in right toolbox and right side of equations
   * @param {Object} [options]
   * @abstract
   */
  constructor( leftTermCreators, rightTermCreators, options ) {

    options = merge( {
      debugName: null, // internal name, not displayed to the user
      scalePosition: DEFAULT_SCALE_POSITION, // determined empirically
      lockable: true, // is the lock feature supported for this scene?
      icon: null, // {Node|null} optional icon used to represent the scene in the scene control (radio buttons)
      maxWeight: 30, // maximum weight at which a plate 'bottoms out', and won't move when more weight is added to it,
      gridRows: EqualityExplorerQueryParameters.rows, // rows in the grid on the scale
      gridColumns: EqualityExplorerQueryParameters.columns, // columns in the grid on the scale
      numberOfSnapshots: 5, // number of snapshots in the Snapshots accordion box
      iconSize: null, // {Dimension2|null} size of term icons on the scale, computed if null
      variables: null // {Variable[]|null} variables associated with the scene
    }, options );

    // @public (read-only)
    this.debugName = options.debugName;
    phet.log && phet.log( `scene: ${this.debugName}, maxWeight=${options.maxWeight}` );

    // @private {Node|null} used to represent the scene. See ES5 getter.
    this._icon = options.icon;

    // @public {Variable[]|null} variables associated with the scene
    this.variables = options.variables;

    // Check for potential bad combinations of term creators
    assert && validateTermCreators( leftTermCreators );
    assert && validateTermCreators( rightTermCreators );

    // @public (read-only) {TermCreator[]} creators for terms on left and right sides of scale
    this.leftTermCreators = leftTermCreators;
    this.rightTermCreators = rightTermCreators;

    // @public (read-only) for operations that need to be performed on all term creators
    this.allTermCreators = leftTermCreators.concat( rightTermCreators );

    // Associate each term creator with a 'like term' creator on the opposite side of the scale.
    assert && assert( leftTermCreators.length === rightTermCreators.length,
      'the same number of term creators are required on both sides of the scale' );
    for ( let i = 0; i < leftTermCreators.length; i++ ) {
      assert && assert( leftTermCreators[ i ].isLikeTermCreator( rightTermCreators[ i ] ),
        'like term creators must have the same indices on both sides of the scale' );
      leftTermCreators[ i ].equivalentTermCreator = rightTermCreators[ i ];
      rightTermCreators[ i ].equivalentTermCreator = leftTermCreators[ i ];
    }

    // @public (read-only)
    this.scale = new BalanceScale( this.leftTermCreators, this.rightTermCreators, {
      position: options.scalePosition,
      gridRows: options.gridRows,
      gridColumns: options.gridColumns,
      iconSize: options.iconSize,
      maxWeight: options.maxWeight
    } );

    // @public (read-only, for debugging) drag bounds for left plate
    this.leftDragBounds = new Bounds2( DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.position.x - DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MAX_Y );
    leftTermCreators.forEach( termCreator => {
      termCreator.dragBounds = this.leftDragBounds;
    } );

    // @public (read-only, for debugging) drag bounds for right plate
    this.rightDragBounds = new Bounds2( this.scale.position.x + DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.position.x + DRAG_BOUNDS_X_MARGIN + this.leftDragBounds.width, DRAG_BOUNDS_MAX_Y );
    rightTermCreators.forEach( termCreator => {
      termCreator.dragBounds = this.rightDragBounds;
    } );

    // @public collection of snapshots, for saving/restoring the state of a scene
    this.snapshotsCollection = new SnapshotsCollection( {
      numberOfSnapshots: options.numberOfSnapshots
    } );

    // @public {BooleanProperty|null} locks equivalent terms, null if this feature is not supported
    this.lockedProperty = null;

    // if the 'lock' feature is supported...
    if ( options.lockable ) {

      this.lockedProperty = new BooleanProperty( EqualityExplorerQueryParameters.locked );

      // Update the lockedProperty of all term creators. unlink not needed.
      this.lockedProperty.link( locked => {
        for ( let i = 0; i < this.allTermCreators.length; i++ ) {
          this.allTermCreators[ i ].lockedProperty.value = locked;
        }
      } );
    }
  }

  /**
   * Gets the icon used to represent this scene.
   * Since this icon is used in multiple places in the scenery DAG, it must be wrapped.
   * @returns {Node}
   * @public
   */
  get icon() {
    return new Node( { children: [ this._icon ] } );
  }

  // @public
  reset() {

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
   * @public
   */
  disposeAllTerms() {
    this.allTermCreators.forEach( termCreator => termCreator.disposeAllTerms() );
  }

  /**
   * Disposes of all terms that are managed by term creators and are not on the scale.
   * @public
   */
  disposeTermsNotOnScale() {
    this.allTermCreators.forEach( termCreator => termCreator.disposeTermsNotOnPlate() );
  }

  /**
   * Updates time-dependent parts of the scene.
   * @param {number} dt - time since the previous step, in seconds
   * @public
   */
  step( dt ) {

    // step all terms
    this.allTermCreators.forEach( termCreator => termCreator.step( dt ) );
  }
}

/**
 * Verifies that none of the specified term creators are 'like term' creators.
 * Like term creators are not allowed on the same side of the equation.
 * For example, there should not be 2 creators for constants, or 2 creators for 'x'.
 * @param {TermCreator[]} termCreators
 */
function validateTermCreators( termCreators ) {
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

export default EqualityExplorerScene;