// Copyright 2017, University of Colorado Boulder

//TODO migrate to common code?
/**
 * A pseudo-3D box, with perspective. The front and top faces are visible.
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
  function BoxNode( options ) {

    options = _.extend( {
      width: 200, // {number} width of the top face at it's center
      height: 10, // {number} height of the front face
      depth: 20,  // {number} depth of the top face after flattening to 2D
      vanishingPointDistance: 100, // distance of the vanishing point from the center of the top face
      topFill: 'white', // {Color|string} fill for the top face of the box
      frontFill: 'white', // {Color|string} fill fo the front face of the box
      stroke: 'black' // {Color|string} stroke used for both faces of the box
    }, options );

    var hypotenuse = Math.sqrt( options.vanishingPointDistance * options.vanishingPointDistance + ( options.width / 2 ) * ( options.width/ 2 ) );
    var perspectiveXOffset = hypotenuse * ( options.depth / options.vanishingPointDistance );

    // options.width is the width at the midpoint of the box's top face, compute the foreground and background widths
    var foregroundWidth = options.width + perspectiveXOffset;
    var backgroundWidth = options.width - perspectiveXOffset;

    // top face: describe clockwise, starting at front-left corner, in pseudo-3D using parallel perspective
    var topShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( perspectiveXOffset, -options.depth )
      .lineTo( perspectiveXOffset + backgroundWidth, -options.depth )
      .lineTo( foregroundWidth, 0 );
    var topNode = new Path( topShape, {
      fill: options.topFill,
      stroke: options.stroke
    } );

    // front face
    var frontShape = new Shape().rect( 0, 0, options.width + perspectiveXOffset, options.height );
    var frontNode = new Path( frontShape, {
      fill: options.frontFill,
      stroke: options.stroke
    } );

    assert && assert( !options.children, 'children is set by this Node' );
    options.children = [ topNode, frontNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'BoxNode', BoxNode );

  return inherit( Node, BoxNode );
} );
