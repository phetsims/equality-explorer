// Copyright 2017, University of Colorado Boulder

/**
 * Base type for a scene in Equality Explorer sim.  A scene is a collection of items.
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
   * @param {AbstractItemCreator[]} leftItemCreators - in the order that they appear in the left panel and left side of equations
   * @param {AbstractItemCreator[]} rightItemCreators - in the order that they appear in the right panel and right side of equations
   * @param {Object} [options]
   * @constructor
   */
  function Scene( debugName, leftItemCreators, rightItemCreators, options ) {

    var self = this;

    options = _.extend( {
      debugName: null,
      icon: null, // {Node|null} optional icon used to represent the scene
      maxWeight: 30 // maximum weight at which a plate 'bottoms out', and won't move when more weight is added to it
    }, options );

    phet.log && phet.log( debugName + ': maxWeight=' + options.maxWeight );

    // @public (read-only)
    this.debugName = debugName;

    // @public (read-only) {Node} used to represent the scene
    this.icon = options.icon;

    // @public (read-only) {AbstractItemCreator[]} creators for items on left side of scale
    this.leftItemCreators = leftItemCreators;

    // @public (read-only) {AbstractItemCreator[]} creators for items on right side of scale
    this.rightItemCreators = rightItemCreators;

    // @public (read-only)
    this.scale = new BalanceScale( this.leftItemCreators, this.rightItemCreators, {
      location: new Vector2( 355, 420 ),
      maxWeight: options.maxWeight
    } );

    // @public (read-only, for debugging) drag bounds for left plate
    this.leftDragBounds = new Bounds2( DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.location.x - DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MAX_Y );
    leftItemCreators.forEach( function( itemCreator ) {
      itemCreator.dragBounds = self.leftDragBounds;
    } );

    // @public (read-only, for debugging) drag bounds for right plate
    this.rightDragBounds = new Bounds2( this.scale.location.x + DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.location.x + DRAG_BOUNDS_X_MARGIN + this.leftDragBounds.width, DRAG_BOUNDS_MAX_Y );
    rightItemCreators.forEach( function( itemCreator ) {
      itemCreator.dragBounds = self.rightDragBounds;
    } );

    // @public whether the 2 sides of the equation are locked
    this.lockedProperty = new BooleanProperty( false );

    // @public collection of snapshots, for saving/restoring the state of a Scene
    this.snapshots = new Snapshots();
  }

  equalityExplorer.register( 'Scene', Scene );

  return inherit( Object, Scene, {

    // @public
    reset: function() {
      this.deleteAllItems();
      this.lockedProperty.reset();
      this.snapshots.reset();
    },

    // @private deletes all items
    deleteAllItems: function() {
      this.leftItemCreators.forEach( function( itemCreator ) {
        itemCreator.reset();
      } );
      this.rightItemCreators.forEach( function( itemCreator ) {
        itemCreator.reset();
      } );
    },

    /**
     * Updates time-dependent parts of the scene.
     * @param {number} dt - time since the previous step, in seconds
     */
    step: function( dt ) {

      this.leftItemCreators.forEach( function( itemCreator ) {
        itemCreator.step( dt );
      } );

      this.rightItemCreators.forEach( function( itemCreator ) {
        itemCreator.step( dt );
      } );
    },

    /**
     * Saves a snapshot of the scene.
     * @returns {Snapshot}
     * @public
     */
    save: function() {
      return new Snapshot( this );
    },

    /**
     * Restores a snapshot of the scene.
     * @param {Snapshot} snapshot
     */
    restore: function( snapshot ) {
      assert && assert( snapshot instanceof Snapshot, 'oops, not a Snapshot' );

      // clear the scale
      this.scale.clear();

      // restore the left plate
      this.leftItemCreators.forEach( function( itemCreator ) {
        var cells = snapshot.getLeftCells( itemCreator ); // {number[]}
        cells.forEach( function( cellIndex ) {
          itemCreator.createItemOnScale( cellIndex );
        } );
      } );

      // restore the right plate
      this.rightItemCreators.forEach( function( itemCreator ) {
        var cells = snapshot.getRightCells( itemCreator ); // {number[]}
        cells.forEach( function( cellIndex ) {
          itemCreator.createItemOnScale( cellIndex );
        } );
      } );
    }
  } );
} );

