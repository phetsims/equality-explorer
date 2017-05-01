// Copyright 2017, University of Colorado Boulder

/**
 * A plate on the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function PlateNode( options ) {

    options = _.extend( {
      radiusX: 150,
      radiusY: 15,
      fill: 'black',
      stroke: 'black'
    }, options );

    var outerShape = new Shape().ellipse( 0, 0, options.radiusX, options.radiusY, 0 );
    var outerNode = new Path( outerShape, {
      fill: options.fill,
      stroke: options.stroke
    } );
    
    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ outerNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'PlateNode', PlateNode );

  return inherit( Node, PlateNode );
} );
