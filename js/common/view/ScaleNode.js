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

  // base
  var BASE_WIDTH = 200;
  var BASE_HEIGHT = 10;
  var BASE_DEPTH = 20;
  
  // beam
  var BEAM_WIDTH = 450;
  var BEAM_HEIGHT = 10;
  var BEAM_DEPTH = 10;
  
  // beam pivot
  var BEAM_PIVOT_HEIGHT = 50;
  var BEAM_PIVOT_TOP_WIDTH = 15;
  var BEAM_PIVOT_BOTTOM_WIDTH = 25;
  
  // plate pivots
  var PLATE_PIVOT_DIAMETER = 16;
  var PLATE_PIVOT_OPTIONS = {
    fill: 'rgb( 204, 204, 204 )',
    stroke: 'black'
  };
  
  // plate hinges
  var PLATE_HINGE_WIDTH = 0.6 * PLATE_PIVOT_DIAMETER;
  var PLATE_HINGE_HEIGHT = 35;
  var PLATE_HINGE_X_OFFSET = 45;
  var PLATE_HINGE_OPTIONS = {
    fill: 'rgb( 204, 204, 204 )',
    stroke: 'black'
  };

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
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      depth: BASE_DEPTH,
      stroke: 'black',
      topFill: 'rgb( 153, 153, 153 )',
      frontFill: 'rgb( 72, 72, 72 )'
    } );

    var beamPivotTaper = BEAM_PIVOT_BOTTOM_WIDTH - BEAM_PIVOT_TOP_WIDTH;
    var beamPivotShape = new Shape().polygon( [
      new Vector2( 0, 0 ),
      new Vector2( BEAM_PIVOT_TOP_WIDTH, 0 ),
      new Vector2( BEAM_PIVOT_TOP_WIDTH + beamPivotTaper / 2, BEAM_PIVOT_HEIGHT ),
      new Vector2( -beamPivotTaper / 2, BEAM_PIVOT_HEIGHT )
    ] );
    var beamPivotNode = new Path( beamPivotShape, {
      stroke: 'black',
      fill: 'rgb( 204, 204, 204 )',
      centerX: baseNode.centerX,
      bottom: baseNode.top + ( BASE_DEPTH / 2 )
    } );

    var beamNode = new BoxNode( {
      width: BEAM_WIDTH,
      height: BEAM_HEIGHT,
      depth: BEAM_DEPTH,
      stroke: 'black',
      topFill: 'rgb( 153, 153, 153 )',
      frontFill: 'rgb( 72, 72, 72 )',
      centerX: baseNode.centerX,
      y: beamPivotNode.top
    } );

    var arrowNode = new ArrowNode( 0, 0, 0, -75, {
      fill: 'rgb( 0, 187, 100 )',
      headHeight: 20,
      headWidth: 15,
      bottom: beamNode.top + ( 0.65 * BEAM_DEPTH ),
      centerX: beamNode.centerX
    } );

    var platePivotShape = new Shape().circle( 0, 0, PLATE_PIVOT_DIAMETER / 2 );
    var leftPlatePivotNode = new Path( platePivotShape, _.extend( {}, PLATE_PIVOT_OPTIONS,  {
      bottom: beamNode.top + ( 0.65 * BEAM_DEPTH ),
      centerX: beamNode.left + PLATE_HINGE_X_OFFSET
    } ) );
    var rightPlatePivotNode = new Path( platePivotShape, _.extend( {}, PLATE_PIVOT_OPTIONS, {
      bottom: leftPlatePivotNode.bottom,
      centerX: beamNode.right - PLATE_HINGE_X_OFFSET
    } ) );

    var plateHingeShape = new Shape().rect( 0, 0, PLATE_HINGE_WIDTH, PLATE_HINGE_HEIGHT );
    var leftPlateHingeNode = new Path( plateHingeShape, _.extend( {}, PLATE_HINGE_OPTIONS, {
      centerX: leftPlatePivotNode.centerX,
      bottom: leftPlatePivotNode.centerY
    } ) );
    var rightPlateHingeNode = new Path( plateHingeShape, _.extend( {}, PLATE_HINGE_OPTIONS, {
      centerX: rightPlatePivotNode.centerX,
      bottom: rightPlatePivotNode.centerY
    } ) );

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
      baseNode, beamPivotNode, beamNode, arrowNode,
      leftPlateHingeNode, rightPlateHingeNode,
      leftPlatePivotNode, rightPlatePivotNode,
      leftPlateNode, rightPlateNode
    ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'ScaleNode', ScaleNode );

  return inherit( Node, ScaleNode );
} );
