// Copyright 2017, University of Colorado Boulder

//TODO make plate look like design doc
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
      color: 'black'
    }, options );

    var plateShape = new Shape().ellipse( 0, 0, options.radiusX, options.radiusY, 0 );

    var plateNode = new Path( plateShape, {
      fill: 'rgb( 230, 230, 230 )',
      stroke: options.color,
      lineWidth: 3
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ plateNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'PlateNode', PlateNode );

  return inherit( Node, PlateNode );
} );
