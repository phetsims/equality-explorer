// Copyright 2017-2020, University of Colorado Boulder

/**
 * The balance scale used throughout Equality Explorer.
 * Origin is at the point where the beam is balanced on the fulcrum.
 * Do not attempt to position this Node via options; it positions itself based on model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import BoxNode from './BoxNode.js';
import ClearScaleButton from './ClearScaleButton.js';
import OrganizeButton from './OrganizeButton.js';
import PlateNode from './PlateNode.js';

// base
const BASE_WIDTH = 200;
const BASE_HEIGHT = 40;
const BASE_DEPTH = 10;

// beam
const BEAM_HEIGHT = 5;
const BEAM_DEPTH = 8;

// fulcrum that the beam is balanced on
const FULCRUM_HEIGHT = 52;
const FULCRUM_TOP_WIDTH = 15;
const FULCRUM_BOTTOM_WIDTH = 25;

// arrow
const ARROW_LENGTH = 75;

class BalanceScaleNode extends Node {

  /**
   * @param {BalanceScale} scale
   * @param {Object} [options]
   */
  constructor( scale, options ) {

    options = merge( {
      clearScaleButtonVisible: true,
      organizeButtonVisible: true,
      disposeTermsNotOnScale: null // {function|null} call this to dispose of terms that are NOT on the scale
    }, options );

    options.x = scale.position.x;
    options.y = scale.position.y;

    // the fulcrum that the beam balances on
    const fulcrumTaper = FULCRUM_BOTTOM_WIDTH - FULCRUM_TOP_WIDTH;
    const fulcrumShape = new Shape().polygon( [
      new Vector2( 0, 0 ),
      new Vector2( FULCRUM_TOP_WIDTH, 0 ),
      new Vector2( FULCRUM_TOP_WIDTH + fulcrumTaper / 2, FULCRUM_HEIGHT ),
      new Vector2( -fulcrumTaper / 2, FULCRUM_HEIGHT )
    ] );
    const fulcrumNode = new Path( fulcrumShape, {
      stroke: 'black',
      fill: EqualityExplorerColors.SCALE_FULCRUM_FILL,

      // origin is at center-top of fulcrum
      centerX: 0,
      top: 0
    } );

    // the base the supports the entire scale
    const baseNode = new BoxNode( {
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
    const beamNode = new BoxNode( {
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
    const arrowNode = new ArrowNode( 0, 0, 0, -ARROW_LENGTH, {
      headHeight: 20,
      headWidth: 15,
      centerX: beamNode.centerX,
      bottom: 0
    } );

    // A dashed line that is perpendicular to the base.
    // When the scale is balanced, the arrow will be aligned with this line.
    const dashedLine = new Line( 0, 0, 0, 1.2 * ARROW_LENGTH, {
      lineDash: [ 4, 4 ],
      stroke: 'black',
      centerX: beamNode.centerX,
      bottom: 0
    } );

    // left plate
    const leftPlateNode = new PlateNode( scale.leftPlate, {
      center: beamNode.center // correct position will be set later in constructor
    } );

    // right plate
    const rightPlateNode = new PlateNode( scale.rightPlate, {
      center: beamNode.center // correct position will be set later in constructor
    } );

    // pressing this button clears all terms from the scale
    const clearScaleButton = new ClearScaleButton( scale.clear.bind( scale ), {
      visible: options.clearScaleButtonVisible
    } );

    // pressing this button organizes terms on the scale, grouping like terms together
    const organizeButton = new OrganizeButton( scale.organize.bind( scale ), {
      visible: options.organizeButtonVisible
    } );

    // Pressing either button disposes of any terms that are not already on the scale.
    // removeListener not needed.
    if ( options.disposeTermsNotOnScale ) {
      clearScaleButton.addListener( options.disposeTermsNotOnScale );
      organizeButton.addListener( options.disposeTermsNotOnScale );
    }

    // Disable ClearScaleButton and OrganizeButton when the scale is empty. unlink not required.
    scale.numberOfTermsProperty.link( numberOfTerms => {
      const enabled = ( numberOfTerms !== 0 );
      clearScaleButton.enabled = enabled;
      organizeButton.enabled = enabled;
    } );

    // buttons on the front face of the base
    const buttonsParent = new HBox( {
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

    super( options );

    // Adjust parts of the scale that depend on angle. unlink not required.
    scale.angleProperty.link( ( angle, oldAngle ) => {

      const deltaAngle = angle - oldAngle;

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
    scale.leftPlate.positionProperty.link( position => {
      leftPlateNode.x = position.x - scale.position.x;
      leftPlateNode.y = position.y - scale.position.y;
    } );

    // Move the right plate. unlink not required.
    scale.rightPlate.positionProperty.link( position => {
      rightPlateNode.x = position.x - scale.position.x;
      rightPlateNode.y = position.y - scale.position.y;
    } );
  }
}

equalityExplorer.register( 'BalanceScaleNode', BalanceScaleNode );

export default BalanceScaleNode;