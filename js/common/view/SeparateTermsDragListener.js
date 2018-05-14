// Copyright 2018, University of Colorado Boulder

/**
 * Drag listener used when like terms occupy separate cells on a plate.
 * Like terms are combined only if they sum to zero.
 * See terminology and requirements in TermDragListener supertype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OopsDialog = require( 'EQUALITY_EXPLORER/common/view/OopsDialog' );
  var TermDragListener = require( 'EQUALITY_EXPLORER/common/view/TermDragListener' );

  // strings
  var leftSideOfBalanceIsFullString = require( 'string!EQUALITY_EXPLORER/leftSideOfBalanceIsFull' );
  var rightSideOfBalanceIsFullString = require( 'string!EQUALITY_EXPLORER/rightSideOfBalanceIsFull' );

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

    var self = this;

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

    /**
     * Detaches terms that are related to this drag listener.
     * @protected
     * @override
     */
    detachRelatedTerms: function() {

      // inverse term
      if ( this.inverseTerm && !this.inverseTerm.disposed ) {
        if ( this.inverseTerm.draggingProperty.hasListener( this.inverseTermDraggingListener ) ) {
          this.inverseTerm.draggingProperty.unlink( this.inverseTermDraggingListener );
        }
      }
      this.inverseTerm = null;

      TermDragListener.prototype.detachRelatedTerms.call( this );
    },

    /**
     * Called at the start of a drag cycle, when lock is on, to handle related terms on the opposite side.
     * Check this.interrupted after calling this function; it may interrupt the drag cycle!
     * @protected
     * @override
     */
    startOpposite: function() {
      assert && assert( this.termCreator.lockedProperty.value, 'startOpposite should only be called when lock is on' );

      var termCell = this.plate.getCellForTerm( this.term );
      this.equivalentTerm = this.oppositePlate.getClosestEquivalentTerm( this.term, termCell );

      if ( this.equivalentTerm ) {

        // found equivalent term on opposite plate, remove it from plate
        this.equivalentTermCreator.removeTermFromPlate( this.equivalentTerm );
      }
      else if ( this.oppositePlate.isFull() ) {

        // opposite plate is full, cannot create inverse term, show 'Oops' message
        var thisIsLeft = ( this.termCreator.positiveLocation.x < this.equivalentTermCreator.positiveLocation.x );
        var message = thisIsLeft ? rightSideOfBalanceIsFullString : leftSideOfBalanceIsFullString;
        var oopsDialog = new OopsDialog( message );
        oopsDialog.show();

        // interrupt this drag sequence, since we can't take term off the plate
        this.interrupt();
      }
      else {

        // no equivalent term on opposite plate, create an inverse term
        this.inverseTerm = this.equivalentTermCreator.createTerm( _.extend( this.term.copyOptions(), {
          sign: -1
        } ) );
        var inverseTermLocation = this.termCreator.getEquivalentTermLocation( this.term );
        var inverseCell = this.oppositePlate.getBestEmptyCell( inverseTermLocation );
        this.equivalentTermCreator.putTermOnPlate( this.inverseTerm, inverseCell );

        // if the inverse term is dragged, break the association to equivalentTerm
        this.inverseTerm.draggingProperty.link( this.inverseTermDraggingListener ); // unlink needed in dispose

        // create the equivalent term on the opposite side
        // Do this after creating inverseTerm so that it appear in front of inverseTerm.
        this.equivalentTerm = this.equivalentTermCreator.createTerm( this.term.copyOptions() );
      }
    },

    /**
     * Called at the end of a drag cycle, when lock is on, to handle related terms on the opposite side.
     * @returns {SumToZeroNode|null} if the drag results in terms on the opposite plate summing to zero
     * @protected
     * @override
     */
    endOpposite: function() {
      assert && assert( this.termCreator.lockedProperty.value, 'endOpposite should only be called when lock is on' );

      // put equivalent term in an empty cell
      var emptyCell = this.oppositePlate.getBestEmptyCell( this.equivalentTerm.locationProperty.value );
      this.equivalentTermCreator.putTermOnPlate( this.equivalentTerm, emptyCell );

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

        var self = this;

        // the target cell and its location
        var cell = this.plate.getBestEmptyCell( this.term.locationProperty.value );
        var cellLocation = this.plate.getLocationOfCell( cell );

        this.term.pickableProperty.value = this.pickableWhileAnimating;

        this.term.animateTo( cellLocation, {

          // On each animation step...
          animationStepCallback: function() {

            // If the target cell has become occupied, choose another cell.
            if ( !self.plate.isEmptyCell( cell ) ) {
              self.animateToEmptyCell();
            }
          },

          // When the term reaches the cell...
          animationCompletedCallback: function() {

            assert && assert( !self.plate.isFull(), 'plate is full' );
            assert && assert( !( self.equivalentTerm && self.oppositePlate.isFull() ), 'opposite plate is full' );

            // Compute cell again, in case a term has been removed below the cell that we were animating to.
            cell = self.plate.getBestEmptyCell( self.term.locationProperty.value );

            // Put the term on the plate
            self.termCreator.putTermOnPlate( self.term, cell );
            self.term.pickableProperty.value = true;

            // Handle related terms on opposite side
            if ( self.equivalentTerm ) {
              if ( self.inverseTerm ) {

                // Equivalent and inverse term cancel each other out.
                self.inverseTerm.dispose();
                self.inverseTerm = null;
                self.equivalentTerm.dispose();
                self.equivalentTerm = null;
              }
              else {

                // Put equivalent term on the opposite plate
                var equivalentCell = self.oppositePlate.getBestEmptyCell( self.equivalentTerm.locationProperty.value );
                self.equivalentTermCreator.putTermOnPlate( self.equivalentTerm, equivalentCell );
                //TODO #90 next line should be unnecessary, but location is wrong when putting equivalentTerm on right plate
                self.equivalentTerm.moveTo( self.oppositePlate.getLocationOfCell( equivalentCell ) );
              }
              self.detachRelatedTerms();
            }
          }
        } );
      }
    }
  } );
} );