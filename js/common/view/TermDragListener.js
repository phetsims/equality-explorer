// Copyright 2018-2020, University of Colorado Boulder

/**
 * Drag listener for terms, abstract base type.
 *
 * Terminology:
 * - The dragged term is the term that you’re dragging.
 * - The equivalent term is the term on the opposite side that follows along with the dragged term.
 *   It has the same value as the dragged term. For example, if you’re dragging 2x, the equivalent term will also be 2x.
 * - The inverse term is the term that is created on the opposite plate if no equivalent term is already on the plate.
 *   It’s value is the inverse of the equivalent term.  For example, if the equivalent term is 2x, the inverse term
 *   is -2x.  (Inverse term is only relevant for the Numbers and Variables screens. In Operations, the equivalent term
 *   is subtracted from what’s on the plate.)
 * - The opposite plate is the plate associated with the equivalent term, opposite the dragging term.
 *
 * General requirements for the 'lock' feature:
 * - toggling the lock state deletes all terms that are not on the plate (dragging and animating terms)
 * - dragged term and equivalent term are added to plates simultaneously
 * - equivalent term is not interactive
 * - equivalent term has a shadow while dragged term has a shadow
 * - equivalent term does not interact with terms on plate (no sum-to-zero)
 * - inverse term is interactive; interacting with it breaks the association to the equivalent term
 * - equivalent term is chosen from a plate based on dragged term's cell - choose closest
 * - equivalent term is put on the plate based on dragged term's cell - choose closest
 * - inverse term is created on a plate based on term's cell - choose closest
 *
 * NOTE: When a Term is created, events are forward to this drag listener by TermCreatorNode, via
 * SimpleDragHandler.createForwardingListener. At the time of this writing, that means that fields in
 * SceneryEvent and SimpleDragHandler will contain invalid values. In SceneryEvent, currentTarget and trail will be
 * specific to the forwarding TermCreatorNode. In SimpleDragHandler, node, trail, transform and startTransformMatrix
 * fields are all invalid, and you should avoid calling cancel().
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import EqualityExplorerQueryParameters from '../EqualityExplorerQueryParameters.js';
import Term from '../model/Term.js';
import TermCreator from '../model/TermCreator.js';
import SumToZeroNode from './SumToZeroNode.js';

/**
 * @param {Node} termNode - Node that the listener is attached to
 * @param {Term} term - the term being dragged
 * @param {TermCreator} termCreator - the creator of term
 * @param {Object} [options]
 * @constructor
 * @abstract
 */
function TermDragListener( termNode, term, termCreator, options ) {

  assert && assert( termNode instanceof Node, 'invalid termNode: ' + termNode );
  assert && assert( term instanceof Term, 'invalid term: ' + term );
  assert && assert( termCreator instanceof TermCreator, 'invalid termCreator: ' + termCreator );

  // Workaround for not being able to use this before calling super.
  // See https://github.com/phetsims/tasks/issues/1026#issuecomment-594357784
  let self = null; /* eslint-disable-line consistent-this */

  options = merge( {

    haloRadius: 10, // radius of the halo around terms that sum to zero
    pickableWhileAnimating: true, // is termNode pickable while term is animating?

    // SimpleDragHandler options
    allowTouchSnag: true,
    start: ( event, trail ) => self.start( event, trail ),
    drag: ( event, trail ) => self.drag( event, trail ),
    end: ( event, trail ) => self.end( event, trail )

  }, options );

  SimpleDragHandler.call( this, options );

  self = this;

  // @protected constructor args
  this.termNode = termNode;
  this.term = term;
  this.termCreator = termCreator;

  // @protected options
  this.haloRadius = options.haloRadius;
  this.pickableWhileAnimating = options.pickableWhileAnimating;

  // @protected related terms
  this.likeTerm = null; // {Term|null} like term that is overlapped while dragging
  this.equivalentTerm = null; // {Term|null} equivalent term on opposite plate, for lock feature

  // @protected to improve readability
  this.plate = termCreator.plate;
  this.equivalentTermCreator = termCreator.equivalentTermCreator;
  this.oppositePlate = termCreator.equivalentTermCreator.plate;

  // Equivalent term tracks the movement of the dragged term throughout the drag cycle and post-drag animation.
  const positionListener = position => {
    if ( this.equivalentTerm && !this.equivalentTerm.isDisposed ) {
      this.equivalentTerm.moveTo( termCreator.getEquivalentTermPosition( term ) );
    }
  };
  term.positionProperty.link( positionListener ); // unlink required in dispose

  // When the plate moves, or its contents change, refresh the halos around overlapping terms.
  const refreshHalosBound = this.refreshHalos.bind( this );
  this.plate.positionProperty.link( refreshHalosBound ); // unlink required in dispose
  this.plate.contentsChangedEmitter.addListener( refreshHalosBound ); // removeListener required in dispose

  // @private called by dispose
  this.disposeTermDragListener = () => {

    if ( term.positionProperty.hasListener( positionListener ) ) {
      term.positionProperty.unlink( positionListener );
    }

    if ( this.plate.positionProperty.hasListener( refreshHalosBound ) ) {
      this.plate.positionProperty.unlink( refreshHalosBound );
    }

    if ( this.plate.contentsChangedEmitter.hasListener( refreshHalosBound ) ) {
      this.plate.contentsChangedEmitter.removeListener( refreshHalosBound );
    }
  };
}

equalityExplorer.register( 'TermDragListener', TermDragListener );

export default inherit( SimpleDragHandler, TermDragListener, {

  /**
   * @public
   * @override
   */
  dispose: function() {
    this.disposeTermDragListener();
    SimpleDragHandler.prototype.dispose.call( this );
  },

  /**
   * Called at the start of a drag cycle, on pointer down.
   * @param {SceneryEvent} event
   * @param {Trail} trail
   * @private
   */
  start: function( event, trail ) {

    let success = true;

    if ( this.termCreator.isTermOnPlate( this.term ) ) {

      if ( this.termCreator.lockedProperty.value ) {
        success = this.startOpposite();
      }

      if ( success ) {
        this.termCreator.removeTermFromPlate( this.term );
      }
    }
    else if ( !this.term.isAnimating() ) {

      // term came from toolbox. If lock is enabled, create an equivalent term on other side of the scale.
      if ( this.termCreator.lockedProperty.value ) {
        this.equivalentTerm = this.equivalentTermCreator.createTerm( this.term.copyOptions() );
      }
    }

    if ( success ) {
      assert && assert( this.equivalentTerm || !this.termCreator.lockedProperty.value,
        'lock is on, equivalentTerm expected' );

      // move the term a bit, so it's obvious that we're interacting with it
      this.term.moveTo( this.eventToPosition( event ) );

      // set term properties at beginning of drag
      this.term.draggingProperty.value = true;
      this.term.shadowVisibleProperty.value = true;
      if ( this.equivalentTerm && !this.equivalentTerm.isDisposed ) {
        this.equivalentTerm.shadowVisibleProperty.value = true;
        this.equivalentTerm.pickableProperty.value = false;
      }

      // move the node we're dragging to the foreground
      this.termNode.moveToFront();

      this.refreshHalos();
    }
  },

  /**
   * Called while termNode is being dragged.
   * @param {SceneryEvent} event
   * @param {Trail} trail
   * @private
   */
  drag: function( event, trail ) {

    // move the term
    this.term.moveTo( this.eventToPosition( event ) );

    // refresh the halos that appear when dragged term overlaps with an inverse term
    this.refreshHalos();
  },

  /**
   * Called at the end of a drag cycle, on pointer up.
   * @param {SceneryEvent} event
   * @param {Trail} trail
   * @private
   */
  end: function( event, trail ) {

    // drag sequence was interrupted, return immediately
    if ( this.interrupted ) { return; }

    // set term Properties at end of drag
    this.term.draggingProperty.value = false;
    this.term.shadowVisibleProperty.value = false;
    if ( this.equivalentTerm && !this.equivalentTerm.isDisposed ) {
      this.equivalentTerm.shadowVisibleProperty.value = false;
    }

    if ( this.equivalentTerm && !this.termCreator.combineLikeTermsEnabled && this.oppositePlate.isFull() ) {

      // there's no place to put equivalentTerm, the opposite plate is full
      this.refreshHalos();
      this.animateToToolbox();
    }
    else if ( this.likeTerm && this.term.isInverseTerm( this.likeTerm ) ) {

      // overlapping terms sum to zero
      const sumToZeroParent = this.termNode.getParent();
      const sumToZeroNode = new SumToZeroNode( {
        variable: this.term.variable || null,
        haloRadius: this.haloRadius,
        haloBaseColor: EqualityExplorerColors.HALO, // show the halo
        fontSize: this.termCreator.combineLikeTermsEnabled ?
                  EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE :
                  EqualityExplorerConstants.SUM_TO_ZERO_SMALL_FONT_SIZE
      } );
      const sumToZeroCell = this.plate.getCellForTerm( this.likeTerm );

      // dispose of terms that sum to zero
      !this.term.isDisposed && this.term.dispose();
      this.term = null;
      !this.likeTerm.isDisposed && this.likeTerm.dispose();
      this.likeTerm = null;

      // put equivalent term on opposite plate
      if ( this.equivalentTerm ) {
        var oppositeSumToZeroNode = this.endOpposite();
        if ( this.equivalentTerm && !this.equivalentTerm.isDisposed ) {
          this.equivalentTerm.pickableProperty.value = true;
        }
        this.equivalentTerm = null;
      }

      // Do sum-to-zero animations after addressing both plates, so that plates have moved to their final position.
      sumToZeroParent.addChild( sumToZeroNode );
      sumToZeroNode.center = this.plate.getPositionOfCell( sumToZeroCell );
      sumToZeroNode.startAnimation();
      if ( oppositeSumToZeroNode ) {
        sumToZeroParent.addChild( oppositeSumToZeroNode );
        oppositeSumToZeroNode.center = this.oppositePlate.getPositionOfCell( sumToZeroCell );
        oppositeSumToZeroNode.startAnimation();
      }
    }
    else if ( this.term.positionProperty.value.y >
              this.plate.positionProperty.value.y + EqualityExplorerQueryParameters.plateYOffset ) {

      // term was released below the plate, animate back to toolbox
      this.animateToToolbox();
    }
    else {

      // term was released above the plate, animate to the plate
      this.animateToPlate();
    }
  },

  /**
   * Returns terms to the toolboxes where they were created.
   * @private
   */
  animateToToolbox: function() {
    assert && assert( this.term.toolboxPosition, 'toolboxPosition was not initialized for term: ' + this.term );

    this.term.pickableProperty.value = this.pickableWhileAnimating;

    this.term.animateTo( this.term.toolboxPosition, {
      animationCompletedCallback: () => {

        // dispose of terms when they reach the toolbox
        !this.term.isDisposed && this.term.dispose();
        this.term = null;

        if ( this.equivalentTerm ) {
          !this.equivalentTerm.isDisposed && this.equivalentTerm.dispose();
          this.equivalentTerm = null;
        }
      }
    } );
  },

  /**
   * Converts an event to a model position with some offset, constrained to the drag bounds.
   * This is used at the start of a drag cycle to position termNode relative to the pointer.
   * @param {SceneryEvent} event
   * @returns {Vector2}
   * @private
   */
  eventToPosition: function( event ) {

    // move bottom-center of termNode to pointer position
    const dx = 0;
    const dy = this.termNode.contentNodeSize.height / 2;
    const position = this.termNode.globalToParentPoint( event.pointer.point ).minusXY( dx, dy );

    // constrain to drag bounds
    return this.term.dragBounds.closestPointTo( position );
  },

  /**
   * Refreshes the visual feedback (yellow halo) that is provided when a dragged term overlaps
   * a like term that is on the scale. This has the side-effect of setting this.likeTerm.
   * See https://github.com/phetsims/equality-explorer/issues/17
   * @private
   */
  refreshHalos: function() {

    // Bail if this drag listener is not currently active, for example when 2 terms are locked together
    // and only one of them is being dragged. See https://github.com/phetsims/equality-explorer/issues/96
    if ( !this.term.pickableProperty.value ) { return; }

    if ( this.term.draggingProperty.value ) {

      const previousLikeTerm = this.likeTerm;
      this.likeTerm = null;

      // does this term overlap a like term on the plate?
      const termOnPlate = this.plate.getTermAtPosition( this.term.positionProperty.value );
      if ( termOnPlate && termOnPlate.isLikeTerm( this.term ) ) {
        this.likeTerm = termOnPlate;
      }

      // if the like term is new, then clean up previous like term
      if ( previousLikeTerm && !previousLikeTerm.isDisposed && ( previousLikeTerm !== this.likeTerm ) ) {
        previousLikeTerm.haloVisibleProperty.value = false;
      }

      if ( this.likeTerm && ( this.termCreator.combineLikeTermsEnabled || this.term.isInverseTerm( this.likeTerm ) ) ) {

        // terms will combine, show halo for term and likeTerm
        if ( !this.term.isDisposed ) {
          this.term.shadowVisibleProperty.value = false;
          this.term.haloVisibleProperty.value = true;
        }
        if ( !this.likeTerm.isDisposed ) {
          this.likeTerm.haloVisibleProperty.value = true;
        }
      }
      else if ( !this.term.isDisposed ) {

        // term will not combine
        this.term.shadowVisibleProperty.value = true;
        this.term.haloVisibleProperty.value = false;
      }
    }
    else {
      if ( !this.term.isDisposed ) {
        this.term.shadowVisibleProperty.value = false;
        this.term.haloVisibleProperty.value = false;
      }
      if ( this.likeTerm && !this.likeTerm.isDisposed ) {
        this.likeTerm.haloVisibleProperty.value = false;
      }
    }
  },

  //-------------------------------------------------------------------------------------------------
  // Below here are @abstract methods, to be implemented by subtypes
  //-------------------------------------------------------------------------------------------------

  /**
   * Called at the start of a drag cycle, when lock is on, to handle related terms on the opposite side.
   * @returns {boolean} true=success, false=failure
   * @protected
   * @abstract
   */
  startOpposite: function() {
    throw new Error( 'startOpposite must be implemented by subtype' );
  },

  /**
   * Called at the end of a drag cycle, when lock is on, to handle related terms on the opposite side.
   * @returns {SumToZeroNode|null} non-null if the drag results in terms on the opposite plate summing to zero
   * @protected
   * @abstract
   */
  endOpposite: function() {
    throw new Error( 'endOpposite must be implemented by subtype' );
  },

  /**
   * Animates term to plates.
   * @protected
   * @abstract
   */
  animateToPlate: function() {
    throw new Error( 'animateToPlate must be implemented by subtype' );
  }
} );