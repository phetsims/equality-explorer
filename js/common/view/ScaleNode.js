// Copyright 2017, University of Colorado Boulder

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
  var ClearScaleButton = require( 'EQUALITY_EXPLORER/common/view/ClearScaleButton' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OrganizeButton = require( 'EQUALITY_EXPLORER/common/view/OrganizeButton' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlateNode = require( 'EQUALITY_EXPLORER/common/view/PlateNode' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // colors
  var TOP_FACE_FILL = 'rgb( 177, 177, 177 )';
  var FRONT_FACE_FILL = 'rgb( 100, 100, 100 )';
  var BEAM_PIVOT_FILL = 'rgb( 204, 204, 204 )';
  var PLATE_PIVOT_FILL = 'rgb( 204, 204, 204 )';

  // base
  var BASE_WIDTH = 200;
  var BASE_HEIGHT = 40;
  var BASE_DEPTH = 20;
  
  // beam
  var BEAM_WIDTH = 450;
  var BEAM_HEIGHT = 10;
  var BEAM_DEPTH = 10;
  
  // beam pivot
  var BEAM_PIVOT_HEIGHT = 60;
  var BEAM_PIVOT_TOP_WIDTH = 15;
  var BEAM_PIVOT_BOTTOM_WIDTH = 25;

  // plate pivots
  var PLATE_PIVOT_X_OFFSET = 45; // from the ends of the beam
  var PLATE_PIVOT_DIAMETER = 16;
  var PLATE_PIVOT_OPTIONS = {
    fill: PLATE_PIVOT_FILL,
    stroke: 'black'
  };

  // arrow
  var ARROW_LENGTH = 75;

  /**
   * @param {Property.<number>} angleProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( angleProperty, options ) {

    var self = this;

    options = _.extend( {
      leftPlateFill: EqualityExplorerColors.LEFT_PLATE_COLOR,
      rightPlateFill: EqualityExplorerColors.RIGHT_PLATE_COLOR
    }, options );

    // the base the supports the entire scale
    var baseNode = new BoxNode( {
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      depth: BASE_DEPTH,
      stroke: 'black',
      topFill: TOP_FACE_FILL,
      frontFill: FRONT_FACE_FILL
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
      fill: BEAM_PIVOT_FILL,
      centerX: baseNode.centerX,
      bottom: baseNode.top + ( BASE_DEPTH / 2 )
    } );

    // the beam that supports a plate on either end
    var beamNode = new BoxNode( {
      width: BEAM_WIDTH,
      height: BEAM_HEIGHT,
      depth: BEAM_DEPTH,
      stroke: 'black',
      topFill: TOP_FACE_FILL,
      frontFill: FRONT_FACE_FILL,
      centerX: baseNode.centerX,
      y: beamPivotNode.top
    } );

    // dashed line that is perpendicular to the base
    var dashedLine = new Line( 0, 0, 0, ARROW_LENGTH, {
      lineDash: [ 4, 4 ],
      stroke: 'black',
      centerX: beamNode.centerX,
      bottom: beamNode.top + ( 0.65 * BEAM_DEPTH )
    } );

    // arrow at the center on the beam, points perpendicular to the beam
    var arrowNode = new ArrowNode( 0, 0, 0, -ARROW_LENGTH, {
      headHeight: 20,
      headWidth: 15,
      centerX: beamNode.centerX,
      bottom: beamNode.top + ( 0.65 * BEAM_DEPTH )
    } );

    // pivot points that connect the plates to the beam
    var platePivotShape = new Shape().circle( 0, 0, PLATE_PIVOT_DIAMETER / 2 );
    var leftPlatePivotNode = new Path( platePivotShape, _.extend( {}, PLATE_PIVOT_OPTIONS,  {
      bottom: -0.35 * BEAM_DEPTH,
      centerX: PLATE_PIVOT_X_OFFSET
    } ) );
    beamNode.addChild( leftPlatePivotNode );
    var rightPlatePivotNode = new Path( platePivotShape, _.extend( {}, PLATE_PIVOT_OPTIONS, {
      bottom: leftPlatePivotNode.bottom,
      centerX: beamNode.width - PLATE_PIVOT_X_OFFSET
    } ) );
    beamNode.addChild( rightPlatePivotNode );

    // plates
    var leftPlateNode = new PlateNode( {
      color: options.leftPlateFill,
      center: beamNode.center // correct location handled by angleProperty observer
    } );
    var rightPlateNode = new PlateNode( {
      color: options.rightPlateFill,
      center: beamNode.center // correct location handled by angleProperty observer
    } );

    var clearScaleButton = new ClearScaleButton( {
      //TODO add ClearScaleButton listener
      //TODO disable ClearScaleButton when scale is empty
    } );

    var organizeButton = new OrganizeButton( {
      //TODO disable OrganizeButton when scale is empty or organized
    } );

    // buttons in the front face of the base
    var buttonsParent = new HBox( {
      children: [ clearScaleButton, organizeButton ],
      spacing: 25,
      centerX: baseNode.centerX,
      centerY: baseNode.bottom - ( BASE_HEIGHT / 2 )
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [
      leftPlateNode, rightPlateNode,
      baseNode, buttonsParent,
      beamPivotNode, dashedLine, arrowNode, beamNode
    ];

    Node.call( this, options );

    // unlink unnecessary, ScaleNode exists for lifetime of sim
    angleProperty.link( function( angle, oldAngle ) {

      var deltaAngle = angle - oldAngle;

      // rotate the beam about its pivot point
      beamNode.rotateAround( new Vector2( beamNode.centerX, beamNode.centerY ), deltaAngle );

      // rotate and fill the arrow
      arrowNode.rotateAround( new Vector2( arrowNode.centerX, arrowNode.bottom ), deltaAngle );
      arrowNode.fill = ( angle === 0 ) ? 'green' : 'orange';

      // left plate
      var leftPlatePivotCenter = self.globalToLocalPoint( beamNode.localToGlobalPoint( leftPlatePivotNode.center ) );
      leftPlateNode.centerX = leftPlatePivotCenter.x;
      leftPlateNode.bottom = leftPlatePivotCenter.y;

      // right plate
      var rightPlatePivotCenter = self.globalToLocalPoint( beamNode.localToGlobalPoint( rightPlatePivotNode.center ) );
      rightPlateNode.centerX = rightPlatePivotCenter.x;
      rightPlateNode.bottom = rightPlatePivotCenter.y;
    } );
  }

  equalityExplorer.register( 'ScaleNode', ScaleNode );

  return inherit( Node, ScaleNode );
} );
