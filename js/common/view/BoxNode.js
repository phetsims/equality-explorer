// Copyright 2017, University of Colorado Boulder

//TODO migrate to common code?
/**
 * A pseudo-3D box with perspective
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
   * @constructor
   */
  function BoxNode( options ) {

    options = _.extend( {
      width: 200,
      height: 10,
      depth: 20,
      perspectiveXOffset: 20, //TODO replace this with vanishingPointDistance
      stroke: 'black',
      topFill: 'white',
      frontFill: 'white'
    }, options );

    // options.width is the width at the midpoint of the box's top face, compute the foreground and background widths
    var foregroundWidth = options.width + options.perspectiveXOffset;
    var backgroundWidth = options.width - options.perspectiveXOffset;

    // top face: describe clockwise, starting at front-left corner, in pseudo-3D using parallel perspective
    var topShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( options.perspectiveXOffset, -options.depth )
      .lineTo( options.perspectiveXOffset + backgroundWidth, -options.depth )
      .lineTo( foregroundWidth, 0 );
    var topNode = new Path( topShape, {
      fill: options.topFill,
      stroke: options.stroke
    } );

    // front face
    var frontShape = new Shape().rect( 0, 0, options.width + options.perspectiveXOffset, options.height );
    var frontNode = new Path( frontShape, {
      fill: options.frontFill,
      stroke: options.stroke
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ topNode, frontNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'BoxNode', BoxNode );

  return inherit( Node, BoxNode );
} );
