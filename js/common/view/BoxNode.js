// Copyright 2017-2020, University of Colorado Boulder

/**
 * A pseudo-3D box, with perspective. The front and top faces are visible.
 * Used for various parts of the scale in Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import equalityExplorer from '../../equalityExplorer.js';

class BoxNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      width: 200, // width of the top face at it's center
      height: 10, // height of the front face
      depth: 20,  // depth of the top face after flattening to 2D
      vanishingPointDistance: 100, // distance of the vanishing point from the center of the top face
      topFill: 'white', // {Color|string} fill for the top face of the box
      frontFill: 'white', // {Color|string} fill fo the front face of the box
      stroke: 'black' // {Color|string} stroke used for both faces of the box
    }, options );

    const hypotenuse = Math.sqrt( options.vanishingPointDistance * options.vanishingPointDistance +
                                  ( options.width / 2 ) * ( options.width / 2 ) );
    const perspectiveXOffset = hypotenuse * ( options.depth / options.vanishingPointDistance );

    // options.width is the width at the midpoint of the box's top face, compute the foreground and background widths
    const foregroundWidth = options.width + perspectiveXOffset;
    const backgroundWidth = options.width - perspectiveXOffset;

    // top face: describe clockwise, starting at front-left corner, in pseudo-3D using parallel perspective
    const topShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( perspectiveXOffset, -options.depth )
      .lineTo( perspectiveXOffset + backgroundWidth, -options.depth )
      .lineTo( foregroundWidth, 0 );
    const topNode = new Path( topShape, {
      fill: options.topFill,
      stroke: options.stroke
    } );

    // front face
    const frontShape = new Shape().rect( 0, 0, options.width + perspectiveXOffset, options.height );
    const frontNode = new Path( frontShape, {
      fill: options.frontFill,
      stroke: options.stroke
    } );

    assert && assert( !options.children, 'BoxNode sets children' );
    options.children = [ topNode, frontNode ];

    super( options );
  }
}

equalityExplorer.register( 'BoxNode', BoxNode );

export default BoxNode;