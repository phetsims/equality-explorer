// Copyright 2017-2018, University of Colorado Boulder

/**
 * Base type for a scene in Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalanceScale = require( 'EQUALITY_EXPLORER/common/model/BalanceScale' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );
  var SnapshotsCollection = require( 'EQUALITY_EXPLORER/common/model/SnapshotsCollection' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DEFAULT_SCALE_LOCATION = new Vector2( 355, 420 );
  var DRAG_BOUNDS_X_MARGIN = 20;
  var DRAG_BOUNDS_Y_MARGIN = 10;
  var DRAG_BOUNDS_MIN_Y = 100;
  var DRAG_BOUNDS_MAX_Y = EqualityExplorerConstants.SCREEN_VIEW_LAYOUT_BOUNDS.maxY - DRAG_BOUNDS_Y_MARGIN;

  /**
   * @param {TermCreator[]} leftTermCreators - in the order that they appear in the left toolbox and left side of equations
   * @param {TermCreator[]} rightTermCreators - in the order that they appear in the right toolbox and right side of equations
   * @param {Object} [options]
   * @constructor
   */
  function Scene( leftTermCreators, rightTermCreators, options ) {

    var self = this;

    options = _.extend( {
      debugName: null, // internal name, not displayed to the user
      scaleLocation: DEFAULT_SCALE_LOCATION, // determined empirically
      lockable: true, // is the lock feature supported for this scene?
      icon: null, // {Node|null} optional icon used to represent the scene in the scene control (radio buttons)
      maxWeight: 30, // maximum weight at which a plate 'bottoms out', and won't move when more weight is added to it,
      gridRows: EqualityExplorerQueryParameters.rows, // rows in the grid on the scale
      gridColumns: EqualityExplorerQueryParameters.columns, // columns in the grid on the scale
      iconSize: null // {Dimension2|null} size of term icons on the scale, computed if null
    }, options );

    // @public (read-only)
    this.debugName = options.debugName;
    phet.log && phet.log( 'Scene: ' + this.debugName + ', maxWeight=' + options.maxWeight );

    // @private {Node|null} used to represent the scene. See ES5 getter.
    this._icon = options.icon;

    // Check for potential bad combinations of term creators
    assert && validateTermCreators( leftTermCreators );
    assert && validateTermCreators( rightTermCreators );

    // @public (read-only) {TermCreator[]} creators for terms on left and right sides of scale
    this.leftTermCreators = leftTermCreators;
    this.rightTermCreators = rightTermCreators;

    // @public (read-only) for operations that need to be performed on all term creators
    this.allTermCreators = leftTermCreators.concat( rightTermCreators );

    // @public (read-only)
    this.scale = new BalanceScale( this.leftTermCreators, this.rightTermCreators, {
      location: options.scaleLocation,
      gridRows: options.gridRows,
      gridColumns: options.gridColumns,
      iconSize: options.iconSize,
      maxWeight: options.maxWeight
    } );

    // @public (read-only, for debugging) drag bounds for left plate
    this.leftDragBounds = new Bounds2( DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.location.x - DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MAX_Y );
    leftTermCreators.forEach( function( termCreator ) {
      termCreator.dragBounds = self.leftDragBounds;
    } );

    // @public (read-only, for debugging) drag bounds for right plate
    this.rightDragBounds = new Bounds2( this.scale.location.x + DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.location.x + DRAG_BOUNDS_X_MARGIN + this.leftDragBounds.width, DRAG_BOUNDS_MAX_Y );
    rightTermCreators.forEach( function( termCreator ) {
      termCreator.dragBounds = self.rightDragBounds;
    } );

    // @public collection of snapshots, for saving/restoring the state of a Scene
    this.snapshotsCollection = new SnapshotsCollection();

    // @public {BooleanProperty|null} locks equivalent terms, null if this feature is not supported
    this.lockedProperty = null;

    // if the 'lock' feature is supported...
    if ( options.lockable ) {

      this.lockedProperty = new BooleanProperty( false );

      // update the lockedProperty of all term creators.
      // unlink not needed.
      this.lockedProperty.link( function( locked ) {
        for ( var i = 0; i < self.allTermCreators.length; i++ ) {
          self.allTermCreators[ i ].lockedProperty.value = locked;
        }
      } );

      // Associate each term creator with a 'like term' creator on the opposite side of the scale,
      // for creating equivalent terms when the lock feature is enabled.
      assert && assert( leftTermCreators.length === rightTermCreators.length,
        'the same number of term creators are required on both sides of the scale' );
      for ( var i = 0; i < leftTermCreators.length; i++ ) {
        assert && assert( leftTermCreators[ i ].isLikeTermCreator( rightTermCreators[ i ] ),
          'like term creators must have the same indices on both sides of the scale' );
        leftTermCreators[ i ].equivalentTermCreator = rightTermCreators[ i ];
        rightTermCreators[ i ].equivalentTermCreator = leftTermCreators[ i ];
      }
    }
  }

  equalityExplorer.register( 'Scene', Scene );

  /**
   * Verifies that none of the specified term creators are 'like term' creators.
   * Like term creators are not allowed on the same side of the equation.
   * For example, there should not be 2 creators for constants, or 2 creators for 'x'.
   * @param {TermCreator[]} termCreators
   */
  function validateTermCreators( termCreators ) {
    for ( var i = 0; i < termCreators.length; i++ ) {
      for ( var j = 0; j < termCreators.length; j++ ) {
        
        // skip comparisons to self
        if ( termCreators[ i ] !== termCreators[ j ] ) {
          assert && assert( !( termCreators[ i ].isLikeTermCreator( termCreators[ j ] ) ),
            'like term creators are not allowed on the same side of the equation' );
        }
      }
    }
  }

  return inherit( Object, Scene, {

    /**
     * Gets the icon used to represent this scene.
     * Since this icon is used in multiple places in the scenery DAG, it must be wrapped.
     * @returns {Node}
     * @public
     */
    get icon() {
      return new Node( { children: [ this._icon ] } );
    },

    // @public
    reset: function() {

      // delete all terms
      this.allTermCreators.forEach( function( termCreator ) {
        termCreator.disposeAllTerms();
      } );

      // clear all snapshots
      this.snapshotsCollection.reset();
    },

    /**
     * Disposes of all terms that are not on the scale.
     * @public
     */
    disposeTermsNotOnScale: function() {
      this.allTermCreators.forEach( function( termCreator ) {
        termCreator.disposeTermsNotOnPlate();
      } );
    },

    /**
     * Updates time-dependent parts of the scene.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {

      // step all terms
      this.allTermCreators.forEach( function( termCreator ) {
        termCreator.step( dt );
      } );
    },

    /**
     * Creates a snapshot of the scene.
     * @returns {Snapshot}
     * @public
     */
    createSnapshot: function() {
      return new Snapshot( this );
    }
  } );
} );

