// Copyright 2017-2018, University of Colorado Boulder

/**
 * The balance scale used throughout Equality Explorer.
 * Origin is at the point where the beam is balanced on the fulcrum.
 * Do not attempt to position this Node via options; it positions itself based on model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BoxNode = require( 'EQUALITY_EXPLORER/common/view/BoxNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const ClearScaleButton = require( 'EQUALITY_EXPLORER/common/view/ClearScaleButton' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OrganizeButton = require( 'EQUALITY_EXPLORER/common/view/OrganizeButton' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PlateNode = require( 'EQUALITY_EXPLORER/common/view/PlateNode' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );

  // base
  var BASE_WIDTH = 200;
  var BASE_HEIGHT = 40;
  var BASE_DEPTH = 10;

  // beam
  var BEAM_HEIGHT = 5;
  var BEAM_DEPTH = 8;

  // fulcrum that the beam is balanced on
  var FULCRUM_HEIGHT = 52;
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
      clearScaleButtonVisible: true,
      organizeButtonVisible: true,
      disposeTermsNotOnScale: null // {function|null} call this to dispose of terms that are NOT on the scale
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
      fill: EqualityExplorerColors.SCALE_FULCRUM_FILL,

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
      topFill: EqualityExplorerColors.SCALE_TOP_FACE_FILL,
      frontFill: EqualityExplorerColors.SCALE_FRONT_FACE_FILL,
      centerX: fulcrumNode.centerX,
      top: fulcrumNode.bottom - ( BASE_DEPTH / 2 )
    } );

    // the beam that supports a plate on either end
    var beamNode = new BoxNode( {
      width: scale.beamWidth,
      height: BEAM_HEIGHT,
      depth: BEAM_DEPTH,
      stroke: 'black',
      topFill: EqualityExplorerColors.SCALE_TOP_FACE_FILL,
      frontFill: EqualityExplorerColors.SCALE_FRONT_FACE_FILL,
      centerX: baseNode.centerX,
      top: fulcrumNode.top - ( 0.5 * BEAM_DEPTH )
    } );

    // arrow at the center on the beam, points perpendicular to the beam
    var arrowNode = new ArrowNode( 0, 0, 0, -ARROW_LENGTH, {
      headHeight: 20,
      headWidth: 15,
      centerX: beamNode.centerX,
      bottom: 0
    } );

    // A dashed line that is perpendicular to the base.
    // When the scale is balanced, the arrow will be aligned with this line.
    var dashedLine = new Line( 0, 0, 0, 1.2 * ARROW_LENGTH, {
      lineDash: [ 4, 4 ],
      stroke: 'black',
      centerX: beamNode.centerX,
      bottom: 0
    } );

    // left plate
    var leftPlateNode = new PlateNode( scale.leftPlate, {
      center: beamNode.center // correct location will be set later in constructor
    } );

    // right plate
    var rightPlateNode = new PlateNode( scale.rightPlate, {
      center: beamNode.center // correct location will be set later in constructor
    } );

    // pressing this button clears all terms from the scale
    var clearScaleButton = new ClearScaleButton( scale.clear.bind( scale ), {
      visible: options.clearScaleButtonVisible
    } );

    // pressing this button organizes terms on the scale, grouping like terms together
    var organizeButton = new OrganizeButton( scale.organize.bind( scale ), {
      visible: options.organizeButtonVisible
    } );

    // Pressing either button disposes of any terms that are not already on the scale.
    // removeListener not needed.
    if ( options.disposeTermsNotOnScale ) {
      clearScaleButton.addListener( options.disposeTermsNotOnScale );
      organizeButton.addListener( options.disposeTermsNotOnScale );
    }

    // Disable ClearScaleButton and OrganizeButton when the scale is empty. unlink not required.
    scale.numberOfTermsProperty.link( function( numberOfTerms ) {
      var enabled = ( numberOfTerms !== 0 );
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

    assert && assert( !options.children, 'BalanceNode sets children' );
    options.children = [
      baseNode,
      buttonsParent,
      fulcrumNode,
      dashedLine,
      beamNode,
      arrowNode,
      leftPlateNode,
      rightPlateNode
    ];

    // draw a red dot at the origin
    if ( phet.chipper.queryParameters.dev ) {
      options.children.push( new Circle( 2, { fill: 'red' } ) );
    }

    Node.call( this, options );

    // Adjust parts of the scale that depend on angle. unlink not required.
    scale.angleProperty.link( function( angle, oldAngle ) {

      var deltaAngle = angle - oldAngle;

      // rotate the beam about its pivot point
      beamNode.rotateAround( new Vector2( beamNode.centerX, beamNode.centerY ), deltaAngle );

      // rotate and fill the arrow
      arrowNode.rotateAround( new Vector2( beamNode.centerX, 0 ), deltaAngle );
      if ( angle === 0 ) {
        arrowNode.fill = EqualityExplorerColors.SCALE_ARROW_BALANCED; // the scale is balanced
      }
      else if ( Math.abs( angle ) === scale.maxAngle ) {
        arrowNode.fill = EqualityExplorerColors.SCALE_ARROW_BOTTOMED_OUT; // the scale is bottomed out
      }
      else {
        arrowNode.fill = EqualityExplorerColors.SCALE_ARROW_UNBALANCED; // the scale is unbalanced, but not bottomed out
      }
    } );

    // Move the left plate. unlink not required.
    scale.leftPlate.locationProperty.link( function( location ) {
      leftPlateNode.x = location.x - scale.location.x;
      leftPlateNode.y = location.y - scale.location.y;
    } );

    // Move the right plate. unlink not required.
    scale.rightPlate.locationProperty.link( function( location ) {
      rightPlateNode.x = location.x - scale.location.x;
      rightPlateNode.y = location.y - scale.location.y;
    } );
  }

  equalityExplorer.register( 'BalanceScaleNode', BalanceScaleNode );

  return inherit( Node, BalanceScaleNode );
} );
