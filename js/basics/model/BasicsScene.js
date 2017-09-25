// Copyright 2017, University of Colorado Boulder

/**
 * Base type for a scene in the 'Basics' screen.
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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DRAG_BOUNDS_X_MARGIN = 20;
  var DRAG_BOUNDS_Y_MARGIN = 10;
  var DRAG_BOUNDS_MIN_Y = 100;
  var DRAG_BOUNDS_MAX_Y = EqualityExplorerConstants.SCREEN_VIEW_LAYOUT_BOUNDS.maxY - DRAG_BOUNDS_Y_MARGIN;

  /**
   * @param {Node} icon
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @constructor
   */
  function BasicsScene( icon, leftItemCreators, rightItemCreators ) {

    var self = this;

    // @public (read-only) {Node} used to represent the scene
    // wrap the icon since we're using scenery DAG feature
    this.icon = new Node( { children: [ icon ] } );

    // @public (read-only) {ItemCreator[]} creators for items on left side of scale
    this.leftItemCreators = leftItemCreators;

    // @public (read-only) {ItemCreator[]} creators for items on right side of scale
    this.rightItemCreators = rightItemCreators;

    // @public (read-only)
    this.scale = new BalanceScale( this.leftItemCreators, this.rightItemCreators, {
      location: new Vector2( 355, EqualityExplorerQueryParameters.scaleY )
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

    // @public {Property.<boolean>} whether the couplers that connects the 2 sides of the scale are coupled
    this.coupledProperty = new Property( false );

    // Wire up enable/disable for ItemCreators, based on capacity of the scale's plates
    enableItemCreators( leftItemCreators, this.scale.leftPlate.numberOfCells );
    enableItemCreators( rightItemCreators, this.scale.rightPlate.numberOfCells );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  /**
   * Wires up an ItemCreator's enabled Property, so that it can't create more than some max number of Items.
   * @param {ItemCreator[]} itemCreators
   * @param {number} maxItems
   */
  function enableItemCreators( itemCreators, maxItems ) {

    // Get Properties needed to total up all Items
    var numberOfItemsProperties = [];
    itemCreators.forEach( function( itemCreator ) {
      numberOfItemsProperties.push( itemCreator.numberOfItemsProperty );
    } );

    // Disable all ItemCreators if the maximum number of Items is reached, unmultilink unnecessary
    Property.multilink( numberOfItemsProperties, function() {
      var totalItems = 0;
      for ( var i = 0; i < numberOfItemsProperties.length; i++ ) {
        totalItems += numberOfItemsProperties[ i ].value;
      }
      for ( i = 0; i < itemCreators.length; i++ ) {
        itemCreators[ i ].enabledProperty.value = ( totalItems < maxItems );
      }
    } );
  }

  return inherit( Object, BasicsScene, {

    // @public
    reset: function() {
      this.deleteAllItems();
      this.coupledProperty.reset();
    },

    // @private deletes all Items
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
    }
  } );
} );

