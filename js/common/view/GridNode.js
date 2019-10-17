// Copyright 2017-2019, University of Colorado Boulder

/**
 * A rectangular 2D grid of cells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  // constants
  const DEFAULT_CELL_SIZE = new Dimension2( 5, 5 );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function GridNode( options ) {

    options = merge( {
      rows: 1,
      columns: 1,
      cellSize: DEFAULT_CELL_SIZE, // {Dimension2} uniform width and height of each cell

      // Path options
      stroke: EqualityExplorerColors.GRID_STROKE,
      lineWidth: 0.25
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

    Path.call( this, gridShape, options );
  }

  equalityExplorer.register( 'GridNode', GridNode );

  return inherit( Path, GridNode );
} );
