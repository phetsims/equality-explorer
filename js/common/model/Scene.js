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
  var Bounds2 = require( 'DOT/Bounds2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );
  var Snapshots = require( 'EQUALITY_EXPLORER/common/model/Snapshots' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DRAG_BOUNDS_X_MARGIN = 20;
  var DRAG_BOUNDS_Y_MARGIN = 10;
  var DRAG_BOUNDS_MIN_Y = 100;
  var DRAG_BOUNDS_MAX_Y = EqualityExplorerConstants.SCREEN_VIEW_LAYOUT_BOUNDS.maxY - DRAG_BOUNDS_Y_MARGIN;

  /**
   * @param {string} debugName - internal name, not displayed to the user
   * @param {TermCreator[]} leftTermCreators - in the order that they appear in the left panel and left side of equations
   * @param {TermCreator[]} rightTermCreators - in the order that they appear in the right panel and right side of equations
   * @param {Object} [options]
   * @constructor
   */
  function Scene( debugName, leftTermCreators, rightTermCreators, options ) {

    var self = this;

    options = _.extend( {
      debugName: null,
      icon: null, // {Node|null} optional icon used to represent the scene
      maxWeight: 30, // maximum weight at which a plate 'bottoms out', and won't move when more weight is added to it,
      gridRows: 6, // {number} rows in the grid on the scale
      gridColumns: 6, // {number} columns in the grid on the scale
      iconSize: null // {Dimension2|null} size of term icons, computed if null
    }, options );

    phet.log && phet.log( debugName + ': maxWeight=' + options.maxWeight );

    // @public (read-only)
    this.debugName = debugName;

    // @public (read-only) {Node} used to represent the scene
    this.icon = options.icon;

    // @public (read-only) {TermCreator[]} creators for terms on left side of scale
    this.leftTermCreators = leftTermCreators;

    // @public (read-only) {TermCreator[]} creators for terms on right side of scale
    this.rightTermCreators = rightTermCreators;

    // @public (read-only)
    this.scale = new BalanceScale( this.leftTermCreators, this.rightTermCreators, {
      location: new Vector2( 355, 420 ),
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
    this.snapshots = new Snapshots();
  }

  equalityExplorer.register( 'Scene', Scene );

  return inherit( Object, Scene, {

    // @public
    reset: function() {

      // delete all terms
      this.leftTermCreators.forEach( function( termCreator ) {
        termCreator.disposeAllTerms();
      } );
      this.rightTermCreators.forEach( function( termCreator ) {
        termCreator.disposeAllTerms();
      } );

      // clears all snapshots
      this.snapshots.reset();
    },

    /**
     * Updates time-dependent parts of the scene.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {

      // step all terms
      this.leftTermCreators.forEach( function( termCreator ) {
        termCreator.step( dt );
      } );
      this.rightTermCreators.forEach( function( termCreator ) {
        termCreator.step( dt );
      } );
    },

    /**
     * Saves a snapshot of the scene. Restore is handled by the snapshot.
     * @returns {Snapshot}
     * @public
     */
    save: function() {
      return new Snapshot( this );
    }
  } );
} );

