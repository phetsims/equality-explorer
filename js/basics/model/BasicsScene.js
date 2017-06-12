// Copyright 2017, University of Colorado Boulder

/**
 * Base type for a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Node} icon
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @constructor
   */
  function BasicsScene( icon, leftItemCreators, rightItemCreators ) {

    // @public (read-only) {Node} used to represent the scene
    this.icon = new Node( { children: [ icon ] } );

    // @public (read-only) {ItemCreator[]} creators for items on left side of scale
    this.leftItemCreators = leftItemCreators;

    // @public (read-only) {ItemCreator[]} creators for items on right side of scale
    this.rightItemCreators = rightItemCreators;

    // @public (read-only) {Property.<number>} angle of the scale in radians, zero is balanced
    this.scaleAngleProperty = new Property( 0 );

    // @private {number} determines whether the scale rotates clockwise (1) or counterclockwise (-1)
    this.rotationMultiplier = 1;

    // @public
    this.equationAccordionBoxExpandedProperty = new Property( true ); //TODO move to view
    this.snapshotsAccordionBoxExpandedProperty = new Property( true ); //TODO move to view

    // @public {Property.<boolean>} whether the couplers that connects the 2 sides of the scale are coupled
    this.coupledProperty = new Property( false );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  return inherit( Object, BasicsScene, {

    // @public
    reset: function() {
      this.scaleAngleProperty.reset();
      this.equationAccordionBoxExpandedProperty.reset();
      this.snapshotsAccordionBoxExpandedProperty.reset();
      this.coupledProperty.reset();
    },

    /**
     * Updates time-dependent parts of the scene.
     * @param {number} dt - time since the previous step, in seconds
     */
    step: function( dt ) {
      this.rotateScale();
    },

    // @private
    rotateScale: function() {
      //TODO compute the angle based on the items on the scale
    }
  } );
} );

