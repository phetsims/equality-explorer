// Copyright 2017, University of Colorado Boulder

//TODO make the scale pivot
/**
 * The scale used throughout Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var BoxNode = require( 'EQUALITY_EXPLORER/common/view/BoxNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlateNode = require( 'EQUALITY_EXPLORER/common/view/PlateNode' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( options ) {

    options = _.extend( {
      leftPlateFill: 'rgb( 207, 60, 63 )',
      rightPlateFill: 'rgb( 62, 72, 158 )'
    }, options );

    var baseNode = new BoxNode( {
      width: 200,
      height: 10,
      depth: 20,
      perspectiveXOffset: 20, //TODO replace with vanishingPointDistance
      stroke: 'black',
      topFill: 'rgb( 153, 153, 153 )',
      frontFill: 'rgb( 72, 72, 72 )'
    } );

    var PIVOT_HEIGHT = 50;
    var PIVOT_TOP_WIDTH = 15;
    var PIVOT_BOTTOM_WIDTH = 25;
    var PIVOT_TAPER = PIVOT_BOTTOM_WIDTH - PIVOT_TOP_WIDTH;
    var pivotShape = new Shape().polygon( [
      new Vector2( 0, 0 ),
      new Vector2( PIVOT_TOP_WIDTH, 0 ),
      new Vector2( PIVOT_TOP_WIDTH + PIVOT_TAPER / 2, PIVOT_HEIGHT ),
      new Vector2( -PIVOT_TAPER / 2, PIVOT_HEIGHT )
    ] );
    var pivotNode = new Path( pivotShape, {
      stroke: 'black',
      fill: 'rgb( 204, 204, 204 )',
      centerX: baseNode.centerX,
      bottom: baseNode.top + 10 //TODO 0.5 * baseNode depth
    });

    var beamNode = new BoxNode( {
      width: 450,
      height: 10,
      depth: 10,
      perspectiveXOffset: 20, //TODO replace with vanishingPointDistance
      stroke: 'black',
      topFill: 'rgb( 153, 153, 153 )',
      frontFill: 'rgb( 72, 72, 72 )',
      centerX: baseNode.centerX,
      y: pivotNode.top
    });

    var arrowNode = new ArrowNode( 0, 0, 0, -75, {
      fill: 'rgb( 0, 187, 100 )',
      headHeight: 20,
      headWidth: 15,
      bottom: beamNode.top + 5, //TODO 0.5 * beamNode depth
      centerX: beamNode.centerX
    } );

    var PLATE_HINGE_X_OFFSET = 45;
    var platPivotShape = new Shape().circle( 0, 0, 8 ); //TODO factor out radius
    var leftPlatePivotNode = new Path( platPivotShape, {
      fill: 'rgb( 204, 204, 204 )',
      stroke: 'black',
      bottom: beamNode.top + 5, //TODO 0.5 * beamNode depth
      centerX: beamNode.left + PLATE_HINGE_X_OFFSET
    } );
    var rightPlatePivotNode = new Path( platPivotShape, {
      fill: 'rgb( 204, 204, 204 )',
      stroke: 'black',
      bottom: beamNode.top + 5, //TODO 0.5 * beamNode depth
      centerX: beamNode.right - PLATE_HINGE_X_OFFSET
    } );

    var plateHingeShape = new Shape().rect( 0, 0, 10, 30 ); //TODO magic numbers, width related to platPivotShape radius
    var leftPlateHingeNode = new Path( plateHingeShape, {
      fill: 'rgb( 204, 204, 204 )',
      stroke: 'black',
      centerX: leftPlatePivotNode.centerX,
      bottom: leftPlatePivotNode.centerY
    } );
    var rightPlateHingeNode = new Path( plateHingeShape, {
      fill: 'rgb( 204, 204, 204 )', //TODO same as leftPlateHingeNode
      stroke: 'black', //TODO same as leftPlateHingeNode
      centerX: rightPlatePivotNode.centerX,
      bottom: rightPlatePivotNode.centerY
    } );

    var leftPlateNode = new PlateNode( {
      color: options.leftPlateFill,
      centerX: leftPlatePivotNode.centerX,
      centerY: leftPlateHingeNode.top
    } );

    var rightPlateNode = new PlateNode( {
      color: options.rightPlateFill,
      centerX: rightPlatePivotNode.centerX,
      centerY: rightPlateHingeNode.top
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [
      baseNode, pivotNode, beamNode, arrowNode,
      leftPlateHingeNode, rightPlateHingeNode,
      leftPlatePivotNode, rightPlatePivotNode,
      leftPlateNode, rightPlateNode
    ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'ScaleNode', ScaleNode );

  return inherit( Node, ScaleNode );
} );
