// Copyright 2017-2021, University of Colorado Boulder

/**
 * A rectangular 2D grid of cells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import { Path } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';

// constants
const DEFAULT_CELL_SIZE = new Dimension2( 5, 5 );

class GridNode extends Path {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      rows: 1,
      columns: 1,
      cellSize: DEFAULT_CELL_SIZE, // {Dimension2} uniform width and height of each cell

      // Path options
      stroke: EqualityExplorerColors.GRID_STROKE,
      lineWidth: 0.5
    }, options );

    const gridWidth = options.columns * options.cellSize.width;
    const gridHeight = options.rows * options.cellSize.height;

    // border
    const gridShape = new Shape().rect( 0, 0, gridWidth, gridHeight );

    // horizontal lines
    for ( let row = 1; row < options.rows; row++ ) {
      gridShape.moveTo( 0, row * options.cellSize.height ).lineTo( gridWidth, row * options.cellSize.height );
    }

    // vertical lines
    for ( let column = 1; column < options.columns; column++ ) {
      gridShape.moveTo( column * options.cellSize.width, 0 ).lineTo( column * options.cellSize.width, gridHeight );
    }

    super( gridShape, options );
  }
}

equalityExplorer.register( 'GridNode', GridNode );

export default GridNode;