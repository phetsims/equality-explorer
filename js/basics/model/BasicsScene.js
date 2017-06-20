// Copyright 2017, University of Colorado Boulder

/**
 * Base type for a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );

  // constants
  var MAX_SCALE_ANGLE = Math.PI / 15; // maximum rotation angle of the scale

  /**
   * @param {Node} icon
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @constructor
   */
  function BasicsScene( icon, leftItemCreators, rightItemCreators ) {

    var self = this;

    // @public (read-only) {Node} used to represent the scene
    this.icon = new Node( { children: [ icon ] } );

    // @public (read-only) {ItemCreator[]} creators for items on left side of scale
    this.leftItemCreators = leftItemCreators;

    // @public (read-only) {ItemCreator[]} creators for items on right side of scale
    this.rightItemCreators = rightItemCreators;

    // @public
    this.equationAccordionBoxExpandedProperty = new Property( true ); //TODO move to view
    this.snapshotsAccordionBoxExpandedProperty = new Property( true ); //TODO move to view

    // @public {Property.<boolean>} whether the couplers that connects the 2 sides of the scale are coupled
    this.coupledProperty = new Property( false );

    // @public (read-only) dimensions for the grid of items on each plate of the scale
    this.scaleGridSize = new Dimension2( 6, 6 );
    var numberOfCells = this.scaleGridSize.width * this.scaleGridSize.height;

    // lengthProperty for each ObservableArray.<Item>
    var lengthProperties = [];
    this.leftItemCreators.forEach( function( itemCreator ) {
      lengthProperties.push( itemCreator.items.lengthProperty );
    } );
    this.rightItemCreators.forEach( function( itemCreator ) {
      lengthProperties.push( itemCreator.items.lengthProperty );
    } );

    //TODO support dynamic weight for changing value of x
    var maxItemWeight = 0;
    this.leftItemCreators.forEach( function( itemCreator ) {
      maxItemWeight = Math.max( maxItemWeight, itemCreator.weightProperty.value );
    } );
    this.rightItemCreators.forEach( function( itemCreator ) {
      maxItemWeight = Math.max( maxItemWeight, itemCreator.weightProperty.value );
    } );
    var maxWeight = maxItemWeight * numberOfCells;

    // @public (read-only) {DerivedProperty.<number>} angle of the scale in radians, zero is balanced
    this.scaleAngleProperty = new DerivedProperty( lengthProperties, function() {

      // sum of lengthProperties <= number of cells
      assert && assert( _.reduce( lengthProperties,
          function( numberOfItems, lengthProperty ) {
            return numberOfItems + lengthProperty.value;
          }, 0 ) <= numberOfCells, 'more items than cells' );

      var totalWeight = 0;
      self.leftItemCreators.forEach( function( itemCreator ) {
        totalWeight -= itemCreator.total; // subtract
      } );
      self.rightItemCreators.forEach( function( itemCreator ) {
        totalWeight += itemCreator.total; // add
      } );

      var scaleAngle = ( totalWeight / maxWeight ) * MAX_SCALE_ANGLE;
      assert && assert( Math.abs( scaleAngle ) <= MAX_SCALE_ANGLE, 'scaleAngle out of range: ' + scaleAngle );

      return scaleAngle;
    } );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  return inherit( Object, BasicsScene, {

    // @public
    reset: function() {
      this.equationAccordionBoxExpandedProperty.reset();
      this.snapshotsAccordionBoxExpandedProperty.reset();
      this.coupledProperty.reset();
    },

    /**
     * Updates time-dependent parts of the scene.
     * @param {number} dt - time since the previous step, in seconds
     */
    step: function( dt ) {
      //TODO animate rotation of the scale to its desired angle
    }
  } );
} );

