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
  var Line = require( 'SCENERY/nodes/Line' );
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
  
  // flanges connected to the bottom of each plate
  var FLANGE_WIDTH = 0.6 * PLATE_PIVOT_DIAMETER;
  var FLANGE_HEIGHT = 35; // from center of plate to center to pivot
  var FLANGE_X_OFFSET = 45; // from the ends of the beam
  var FLANGE_OPTIONS = {
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

    // the base the supports the entire scale
    var baseNode = new BoxNode( {
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      depth: BASE_DEPTH,
      stroke: 'black',
      topFill: 'rgb( 153, 153, 153 )',
      frontFill: 'rgb( 72, 72, 72 )'
    } );

    // the pivot that connects the beam to the base
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

    // the beam that supports a plate on either end
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

    // dashed line that is perpendicular to the base
    var dashedLine = new Line( 0, 0, 0, 75, {
      lineDash: [ 4, 4 ],
      stroke: 'black',
      bottom: beamNode.top + ( 0.65 * BEAM_DEPTH ),
      centerX: beamNode.centerX
    } );

    //TODO arrow color changes to 'rgb(247,112,62)' when not balanced
    // arrow at the center on the beam, points perpendicular to the beam
    var arrowNode = new ArrowNode( 0, 0, 0, -75, {
      fill: 'rgb( 0, 187, 100 )',
      headHeight: 20,
      headWidth: 15,
      bottom: beamNode.top + ( 0.65 * BEAM_DEPTH ),
      centerX: beamNode.centerX
    } );

    // pivot points the connect the plates to the beam
    var platePivotShape = new Shape().circle( 0, 0, PLATE_PIVOT_DIAMETER / 2 );
    var leftPlatePivotNode = new Path( platePivotShape, _.extend( {}, PLATE_PIVOT_OPTIONS,  {
      bottom: beamNode.top + ( 0.65 * BEAM_DEPTH ),
      centerX: beamNode.left + FLANGE_X_OFFSET
    } ) );
    var rightPlatePivotNode = new Path( platePivotShape, _.extend( {}, PLATE_PIVOT_OPTIONS, {
      bottom: leftPlatePivotNode.bottom,
      centerX: beamNode.right - FLANGE_X_OFFSET
    } ) );

    // flange on the bottom of each plate that connects it to a pivot point
    var flangeShape = new Shape().rect( 0, 0, FLANGE_WIDTH, FLANGE_HEIGHT );
    var leftFlangeNode = new Path( flangeShape, _.extend( {}, FLANGE_OPTIONS, {
      centerX: leftPlatePivotNode.centerX,
      bottom: leftPlatePivotNode.centerY
    } ) );
    var rightFlangeNode = new Path( flangeShape, _.extend( {}, FLANGE_OPTIONS, {
      centerX: rightPlatePivotNode.centerX,
      bottom: rightPlatePivotNode.centerY
    } ) );

    // plates
    var leftPlateNode = new PlateNode( {
      color: options.leftPlateFill,
      centerX: leftPlatePivotNode.centerX,
      centerY: leftFlangeNode.top
    } );
    var rightPlateNode = new PlateNode( {
      color: options.rightPlateFill,
      centerX: rightPlatePivotNode.centerX,
      centerY: rightFlangeNode.top
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [
      baseNode, beamPivotNode, beamNode,
      dashedLine, arrowNode,
      leftFlangeNode, rightFlangeNode,
      leftPlatePivotNode, rightPlatePivotNode,
      leftPlateNode, rightPlateNode
    ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'ScaleNode', ScaleNode );

  return inherit( Node, ScaleNode );
} );
