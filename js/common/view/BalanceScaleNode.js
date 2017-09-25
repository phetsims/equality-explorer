// Copyright 2017, University of Colorado Boulder

/**
 * The balance scale used throughout Equality Explorer.
 * Origin is at the point where the beam is balanced on the fulcrum.
 * Do not attempt to position this Node via options; it positions itself based on model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var BoxNode = require( 'EQUALITY_EXPLORER/common/view/BoxNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ClearScaleButton = require( 'EQUALITY_EXPLORER/common/view/ClearScaleButton' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OrganizeButton = require( 'EQUALITY_EXPLORER/common/view/OrganizeButton' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlateNode = require( 'EQUALITY_EXPLORER/common/view/PlateNode' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // colors
  var TOP_FACE_FILL = 'rgb( 177, 177, 177 )';
  var FRONT_FACE_FILL = 'rgb( 100, 100, 100 )';
  var FULCRUM_FILL = 'rgb( 204, 204, 204 )';

  // base
  var BASE_WIDTH = 200;
  var BASE_HEIGHT = 40;
  var BASE_DEPTH = 10;
  
  // beam
  var BEAM_HEIGHT = 5;
  var BEAM_DEPTH = 8;
  
  // beam pivot
  var FULCRUM_HEIGHT = EqualityExplorerQueryParameters.fulcrumHeight;
  var FULCRUM_TOP_WIDTH = 15;
  var FULCRUM_BOTTOM_WIDTH = 25;

  // arrow
  var ARROW_LENGTH = 75;

  /**
   * @param {BalanceScale} scale
   * @param {Object} [options]
   * @constructor
   */
  function BalanceScaleNode( scale, options ) {

    options = _.extend( {

      // {Color|string} used to color-code the scale's plates
      leftPlateFill: EqualityExplorerColors.LEFT_PLATE_COLOR,
      rightPlateFill: EqualityExplorerColors.RIGHT_PLATE_COLOR
    }, options );

    options.x = scale.location.x;
    options.y = scale.location.y;

    // the fulcrum that the beam balances on
    var fulcrumTaper = FULCRUM_BOTTOM_WIDTH - FULCRUM_TOP_WIDTH;
    var fulcrumShape = new Shape().polygon( [
      new Vector2( 0, 0 ),
      new Vector2( FULCRUM_TOP_WIDTH, 0 ),
      new Vector2( FULCRUM_TOP_WIDTH + fulcrumTaper / 2, FULCRUM_HEIGHT ),
      new Vector2( -fulcrumTaper / 2, FULCRUM_HEIGHT )
    ] );
    var fulcrumNode = new Path( fulcrumShape, {
      stroke: 'black',
      fill: FULCRUM_FILL,

      // origin is at center-top of fulcrum
      centerX: 0,
      top: 0
    } );

    // the base the supports the entire scale
    var baseNode = new BoxNode( {
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      depth: BASE_DEPTH,
      stroke: 'black',
      topFill: TOP_FACE_FILL,
      frontFill: FRONT_FACE_FILL,
      centerX: fulcrumNode.centerX,
      top: fulcrumNode.bottom - ( BASE_DEPTH / 2 )
    } );

    // the beam that supports a plate on either end
    var beamNode = new BoxNode( {
      width: scale.beamWidth,
      height: BEAM_HEIGHT,
      depth: BEAM_DEPTH,
      stroke: 'black',
      topFill: TOP_FACE_FILL,
      frontFill: FRONT_FACE_FILL,
      centerX: baseNode.centerX,
      top: fulcrumNode.top - ( 0.5 * BEAM_DEPTH )
    } );

    // dashed line that is perpendicular to the base
    var dashedLine = new Line( 0, 0, 0, 1.2 * ARROW_LENGTH, {
      lineDash: [ 4, 4 ],
      stroke: 'black',
      centerX: beamNode.centerX,
      bottom: 0
    } );

    // arrow at the center on the beam, points perpendicular to the beam
    var arrowNode = new ArrowNode( 0, 0, 0, -ARROW_LENGTH, {
      headHeight: 20,
      headWidth: 15,
      centerX: beamNode.centerX,
      bottom: 0
    } );

    // left plate
    var leftPlateNode = new PlateNode( scale.leftPlate, {
      color: options.leftPlateFill,
      center: beamNode.center // correct location will be set later in constructor
    } );

    // right plate
    var rightPlateNode = new PlateNode( scale.rightPlate, {
      color: options.rightPlateFill,
      center: beamNode.center // correct location will be set later in constructor
    } );

    // pressing this button clears all Items from the scale
    var clearScaleButton = new ClearScaleButton( scale );

    // pressing this button organizes Items on the scale, grouping like Items together
    var organizeButton = new OrganizeButton( scale );

    // disable ClearScaleButton and OrganizeButton when scale is empty. unlink is unnecessary.
    Property.multilink( [ scale.leftPlate.weightProperty, scale.rightPlate.weightProperty ],
      function( leftWeight, rightWeight ) {
        var enabled = ( ( leftWeight + rightWeight ) > 0 );
        clearScaleButton.enabled = enabled;
        organizeButton.enabled = enabled;
      } );

    // buttons on the front face of the base
    var buttonsParent = new HBox( {
      children: [ clearScaleButton, organizeButton ],
      spacing: 100,
      centerX: baseNode.centerX,
      centerY: baseNode.bottom - ( BASE_HEIGHT / 2 )
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [
      baseNode,
      buttonsParent,
      fulcrumNode,
      dashedLine,
      arrowNode,
      beamNode,
      leftPlateNode,
      rightPlateNode
    ];

    // draw a red dot at the origin
    if ( EqualityExplorerQueryParameters.showOrigin ) {
      options.children.push( new Circle( 4, { fill: 'red' } ) );
    }

    Node.call( this, options );

    // adjust parts of the scale that depend on angle, unlink unnecessary
    scale.angleProperty.link( function( angle, oldAngle ) {

      var deltaAngle = angle - oldAngle;

      // rotate the beam about its pivot point
      beamNode.rotateAround( new Vector2( beamNode.centerX, beamNode.centerY ), deltaAngle );

      // rotate and fill the arrow
      arrowNode.rotateAround( new Vector2( arrowNode.centerX, arrowNode.bottom ), deltaAngle );
      arrowNode.fill = ( angle === 0 ) ? EqualityExplorerColors.SCALE_ARROW_BALANCED : EqualityExplorerColors.SCALE_ARROW_UNBALANCED;
    } );

    // move the left plate, unlink unnecessary
    scale.leftPlate.locationProperty.link( function( location ) {
      leftPlateNode.x = location.x - scale.location.x;
      leftPlateNode.y = location.y - scale.location.y;
    } );

    // move the right plate, unlink unnecessary
    scale.rightPlate.locationProperty.link( function( location ) {
      rightPlateNode.x = location.x - scale.location.x;
      rightPlateNode.y = location.y - scale.location.y;
    } );
  }

  equalityExplorer.register( 'BalanceScaleNode', BalanceScaleNode );

  return inherit( Node, BalanceScaleNode );
} );
