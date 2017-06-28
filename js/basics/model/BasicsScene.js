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
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Node} icon
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @constructor
   */
  function BasicsScene( icon, leftItemCreators, rightItemCreators ) {

    // @public (read-only) {Node} used to represent the scene
    // wrap the icon since we're using scenery DAG feature
    this.icon = new Node( { children: [ icon ] } );

    // @public (read-only) {ItemCreator[]} creators for items on left side of scale
    this.leftItemCreators = leftItemCreators;

    // @public (read-only) {ItemCreator[]} creators for items on right side of scale
    this.rightItemCreators = rightItemCreators;

    // @public (read-only)
    this.scale = new BalanceScale( this.leftItemCreators, this.rightItemCreators, {
      location: new Vector2( 380, 425 )
    } );

    // @public {Property.<boolean>} whether the couplers that connects the 2 sides of the scale are coupled
    this.coupledProperty = new Property( false );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  return inherit( Object, BasicsScene, {

    // @public
    reset: function() {
      this.coupledProperty.reset();
    },

    /**
     * Updates time-dependent parts of the scene.
     * @param {number} dt - time since the previous step, in seconds
     */
    step: function( dt ) {
      //TODO animate Items
    }
  } );
} );

