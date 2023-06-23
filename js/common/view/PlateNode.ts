// Copyright 2017-2023, University of Colorado Boulder

/**
 * A plate on the balance scale. Includes both the plate and the vertical support that attaches
 * the plate to the balance beam, since they move together.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Circle, Color, Line, Node, NodeOptions, NodeTranslationOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerQueryParameters from '../EqualityExplorerQueryParameters.js';
import Plate from '../model/Plate.js';
import GridNode from './GridNode.js';

type SelfOptions = {
  color?: Color | string; // color of the outside of the plate
  pivotRadius?: number;  // radius of the pivot point that attaches to the balance beam
};

type PlateNodeOptions = SelfOptions & NodeTranslationOptions;

export default class PlateNode extends Node {

  public constructor( plate: Plate, providedOptions?: PlateNodeOptions ) {

    const options = optionize<PlateNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      color: EqualityExplorerColors.PLATE_OUTSIDE_FILL, // {Color|string} color of the outside of the plate
      pivotRadius: 8  // {number} radius of the pivot point that attaches to the balance beam
    }, providedOptions );

    // Outside surface of the plate.
    // Path description (d= field) from assets/scale/plate-outside.svg
    // See assets/README.md for more details.
    const outsideSVG = 'M245.633,70.359c-1.15,1.836-1.764,1.672-7.195,3.125c-20.375,5.45-68.705,9-137.838,9c-65.326,0-110.102-2.84-131.033-7.493c-7.123-1.584-9.441-1.76-11.35-4.132c-1.295-1.611-11.043-3.625-8.484-8.625c2.043-3.994,79.203-6.75,150.867-6.75c72.723,0,147.553,1.775,150.016,5.75C254.025,66.734,246.588,68.836,245.633,70.359';
    const outsideNode = new Path( outsideSVG, {
      fill: options.color,
      stroke: 'black',
      lineWidth: 1
    } );

    // Inside bottom surface of the plate, were terms will sit.
    // Path description (d= field) from assets/scale/plate-surface.svg
    // See assets/README.md for more details.
    const surfaceSVG = 'M243.527,69.984c0,2.25-64.234,8.75-143,8.75c-78.764,0-142.25-5.988-142.25-9.25c0-5.25,63.836-10.462,142.602-10.462S243.527,64.484,243.527,69.984';
    const surfaceNode = new Path( surfaceSVG, {
      fill: EqualityExplorerColors.PLATE_SURFACE_FILL,
      centerX: outsideNode.centerX,
      top: outsideNode.top
    } );

    // Inside wall of the plate.
    // Path description (d= field) from assets/scale/rim.svg
    // See assets/README.md for more details.
    const insideSVG = 'M251.869,68.484c0,7.364-67.6,13.333-150.99,13.333c-83.389,0-150.988-5.969-150.988-13.333c0-7.363,67.6-13.333,150.988-13.333C184.27,55.151,251.869,61.121,251.869,68.484';
    const wallNode = new Path( insideSVG, {
      fill: EqualityExplorerColors.PLATE_INSIDE_FILL,
      centerX: outsideNode.centerX,
      bottom: surfaceNode.bottom
    } );

    // Rim around the top of the plate, colored the same as the outside surface of the plate.
    const rimNode = new Path( insideSVG, {
      stroke: options.color,
      center: wallNode.center
    } );

    // Put all of the parts of the plate together
    const plateNode = new Node( {
      children: [ outsideNode, wallNode, surfaceNode, rimNode ],
      centerX: 0,
      centerY: 0
    } );
    plateNode.setScaleMagnitude( plate.diameter / plateNode.width, 1 );
    assert && assert( plateNode.width === plate.diameter, 'programming error in scaling' );

    // Vertical support that attaches the plate to the pivot point
    const supportNode = new Rectangle( 0, 0, 10, plate.supportHeight - options.pivotRadius, {
      fill: EqualityExplorerColors.PLATE_SUPPORT_FILL,
      stroke: 'black',
      centerX: plateNode.centerX,
      top: plateNode.centerY
    } );

    // Pivot point that connects to the balance beam
    const pivotNode = new Circle( options.pivotRadius, {
      fill: EqualityExplorerColors.PLATE_SUPPORT_FILL,
      stroke: 'black',
      centerX: supportNode.centerX,
      centerY: supportNode.bottom
    } );

    options.children = [ supportNode, pivotNode, plateNode ];

    // Grid where terms appear
    if ( EqualityExplorerQueryParameters.showGrid ) {
      options.children.push( new GridNode( {
        rows: plate.gridRows,
        columns: plate.gridColumns,
        cellSize: plate.cellSize,
        centerX: 0,
        bottom: 0
      } ) );
    }

    if ( phet.chipper.queryParameters.dev ) {

      // Red dot at the origin
      options.children.push( new Circle( 2, { fill: 'red' } ) );

      // Cutoff line for determine on vs off the plate when dragging terms
      options.children.push( new Line( 0, 0, plateNode.width, 0, {
        centerX: plateNode.centerX,
        centerY: plateNode.centerY + EqualityExplorerQueryParameters.plateYOffset,
        stroke: 'red',
        lineWidth: 0.25
      } ) );
    }

    super( options );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

equalityExplorer.register( 'PlateNode', PlateNode );