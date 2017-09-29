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
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @param {Node} icon - icon used to represent the scene
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function BasicsScene( icon, leftItemCreators, rightItemCreators, options ) {

    options = options || {};

    assert && assert( !options.icon, 'subtype handles its own icon' );
    options.icon = new Node( { children: [ icon ] } ); // wrap the icon, since we're using scenery's DAG feature

    Scene.call( this, leftItemCreators, rightItemCreators, options );

    this.coupledProperty.link( function( coupled ) {
      assert && assert( !coupled, 'coupled is not supported in the Basics screen' );
    } );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  return inherit( Scene, BasicsScene );
} );

