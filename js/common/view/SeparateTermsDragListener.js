// Copyright 2018-2019, University of Colorado Boulder

/**
 * Drag listener used when like terms occupy separate cells on a plate.
 * Like terms are combined only if they sum to zero.
 * See terminology and requirements in TermDragListener supertype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const OopsDialog = require( 'SCENERY_PHET/OopsDialog' );
  const TermDragListener = require( 'EQUALITY_EXPLORER/common/view/TermDragListener' );

  // strings
  const leftSideFullString = require( 'string!EQUALITY_EXPLORER/leftSideFull' );
  const rightSideFullString = require( 'string!EQUALITY_EXPLORER/rightSideFull' );

  /**
   * @param {Node} termNode - Node that the listener is attached to
   * @param {Term} term - the term being dragged
   * @param {TermCreator} termCreator - the creator of term
   * @param {Object} [options]
   * @constructor
   */
  function SeparateTermsDragListener( termNode, term, termCreator, options ) {
    assert && assert( !termCreator.combineLikeTermsEnabled,
      'SeparateTermsDragListener is used when like terms occupy separate cells' );

    TermDragListener.call( this, termNode, term, termCreator, options );

    const self = this;

    // @private
    this.inverseTerm = null; // {Term|null} inverse term on opposite plate, for lock feature

    // @private If the inverse term is dragged, break the association between equivalentTerm and inverseTerm
    this.inverseTermDraggingListener = function( dragging ) {
      assert && assert( self.inverseTerm, 'there is no associated inverse term' );
      if ( dragging ) {
        if ( self.inverseTerm.draggingProperty.hasListener( self.inverseTermDraggingListener ) ) {
          self.inverseTerm.draggingProperty.unlink( self.inverseTermDraggingListener );
        }
        self.inverseTerm = null;
      }
    };

    // @private
    this.disposeSeparateTermsDragListener = function() {
      if ( self.inverseTerm && self.inverseTerm.draggingProperty.hasListener( self.inverseTermDraggingListener ) ) {
        self.inverseTerm.draggingProperty.unlink( self.inverseTermDraggingListener );
      }
    };
  }

  equalityExplorer.register( 'SeparateTermsDragListener', SeparateTermsDragListener );

  return inherit( TermDragListener, SeparateTermsDragListener, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeSeparateTermsDragListener();
      TermDragListener.prototype.dispose.call( this );
    },

    //-------------------------------------------------------------------------------------------------
    // Below here is the implementation of the TermDragListener API
    //-------------------------------------------------------------------------------------------------

    /**
     * Called at the start of a drag cycle, when lock is on, to handle related terms on the opposite side.
     * @returns {boolean} true=success, false=failure
     * @protected
     * @override
     */
    startOpposite: function() {
      assert && assert( this.termCreator.lockedProperty.value, 'startOpposite should only be called when lock is on' );

      const termCell = this.plate.getCellForTerm( this.term );
      this.equivalentTerm = this.oppositePlate.getClosestEquivalentTerm( this.term, termCell );

      if ( this.equivalentTerm ) {

        // found equivalent term on opposite plate, remove it from plate
        this.equivalentTermCreator.removeTermFromPlate( this.equivalentTerm );
      }
      else if ( this.oppositePlate.isFull() ) {

        // opposite plate is full, cannot create inverse term, show 'Oops' message
        const thisIsLeft = ( this.termCreator.positiveLocation.x < this.equivalentTermCreator.positiveLocation.x );
        const message = thisIsLeft ? rightSideFullString : leftSideFullString;
        const oopsDialog = new OopsDialog( message );
        oopsDialog.show();

        // interrupt this drag sequence, since we can't take term off the plate
        this.interrupt();
        return false;
      }
      else {

        // no equivalent term on opposite plate, create an inverse term
        this.inverseTerm = this.equivalentTermCreator.createTerm( _.extend( this.term.copyOptions(), {
          sign: -1
        } ) );
        const inverseTermLocation = this.termCreator.getEquivalentTermLocation( this.term );
        const inverseCell = this.oppositePlate.getBestEmptyCell( inverseTermLocation );
        this.equivalentTermCreator.putTermOnPlate( this.inverseTerm, inverseCell );

        // if the inverse term is dragged, break the association to equivalentTerm
        this.inverseTerm.draggingProperty.lazyLink( this.inverseTermDraggingListener ); // unlink needed in dispose

        // create the equivalent term on the opposite side
        // Do this after creating inverseTerm so that it appear in front of inverseTerm.
        this.equivalentTerm = this.equivalentTermCreator.createTerm( this.term.copyOptions() );
      }

      return true;
    },

    /**
     * Called at the end of a drag cycle, when lock is on, to handle related terms on the opposite side.
     * @returns {SumToZeroNode|null} non-null if the drag results in terms on the opposite plate summing to zero
     * @protected
     * @override
     */
    endOpposite: function() {
      assert && assert( this.termCreator.lockedProperty.value, 'endOpposite should only be called when lock is on' );

      // put equivalent term in an empty cell
      const emptyCell = this.oppositePlate.getBestEmptyCell( this.equivalentTerm.locationProperty.value );
      this.equivalentTermCreator.putTermOnPlate( this.equivalentTerm, emptyCell );

      // always null for this subtype, since terms on the opposite side don't combine
      return null;
    },

    /**
     * Animates terms to empty cells.
     * In this scenario, each term occupies a cell on the plate, and like terms are not combined.
     * If there are no empty cells on the plate, the term is returned to the toolbox where it was created.
     * @protected
     * @override
     */
    animateToPlate: function() {
      assert && assert( !this.termCreator.combineLikeTermsEnabled, 'should NOT be called when combining like terms' );

      if ( this.plate.isFull() || ( this.equivalentTerm && this.oppositePlate.isFull() ) ) {

        // Plate is full, return to the toolbox.
        this.animateToToolbox( this.term );
      }
      else {

        const self = this;

        // the target cell and its location
        const cell = this.plate.getBestEmptyCell( this.term.locationProperty.value );
        const cellLocation = this.plate.getLocationOfCell( cell );

        this.term.pickableProperty.value = this.pickableWhileAnimating;

        this.term.animateTo( cellLocation, {

          // On each animation step...
          animationStepCallback: function() {

            // If the target cell has become occupied, or the opposite plate is full, try again.
            if ( !self.plate.isEmptyCell( cell ) || ( self.equivalentTerm && self.oppositePlate.isFull() ) ) {
              self.animateToPlate();
            }
          },

          // When the term reaches the cell...
          animationCompletedCallback: function() {

            assert && assert( !self.plate.isFull(), 'plate is full' );
            assert && assert( !( self.equivalentTerm && self.oppositePlate.isFull() ), 'opposite plate is full' );

            // Compute cell again, in case a term has been removed below the cell that we were animating to.
            const cell = self.plate.getBestEmptyCell( self.term.locationProperty.value );

            // Put the term on the plate
            self.termCreator.putTermOnPlate( self.term, cell );
            self.term.pickableProperty.value = true;

            // Handle related terms on opposite side.
            // Note that equivalentTerm and/or inverseTerm may have been disposed of, so handle that.
            if ( self.equivalentTerm ) {
              if ( self.inverseTerm ) {

                // Equivalent and inverse term cancel each other out.
                !self.inverseTerm.isDisposed && self.inverseTerm.dispose();
                self.inverseTerm = null;
                !self.equivalentTerm.isDisposed && self.equivalentTerm.dispose();
                self.equivalentTerm = null;
              }
              else if ( !self.equivalentTerm.isDisposed ) {

                // Transfer self.equivalentTerm to a local variable and set to null, so that equivalentTerm
                // no longer tracks movement of term. See https://github.com/phetsims/equality-explorer/issues/90
                const equivalentTerm = self.equivalentTerm;
                self.equivalentTerm = null;

                // Put equivalent term on the opposite plate
                const equivalentCell = self.oppositePlate.getBestEmptyCell( equivalentTerm.locationProperty.value );
                self.equivalentTermCreator.putTermOnPlate( equivalentTerm, equivalentCell );
                equivalentTerm.pickableProperty.value = true;
              }
              else {

                // Do nothing - equivalentTerm was disposed before animationCompletedCallback was called.
                // See https://github.com/phetsims/equality-explorer/issues/88
                self.equivalentTerm = null;
              }
            }

            assert && assert( self.equivalentTerm === null, 'equivalentTerm should be null' );
            assert && assert( self.inverseTerm === null, 'inverseTerm should be null' );
          }
        } );
      }
    }
  } );
} );