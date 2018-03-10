// Copyright 2017-2018, University of Colorado Boulder

/**
 * A rectangular 2D grid of cells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var DEFAULT_CELL_SIZE = new Dimension2( 5, 5 );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function GridNode( options ) {

    options = _.extend( {
      rows: 1,
      columns: 1,
      cellSize: DEFAULT_CELL_SIZE, // {Dimension2} uniform width and height of each cell
      stroke: 'rgb( 160, 160, 160 )',
      lineWidth: 0.25
    }, options );

    var gridWidth = options.columns * options.cellSize.width;
    var gridHeight = options.rows * options.cellSize.height;

    // border
    var gridShape = new Shape().rect( 0, 0, gridWidth, gridHeight );

    // horizontal lines
    for ( var row = 1; row < options.rows; row++ ) {
      gridShape.moveTo( 0, row * options.cellSize.height ).lineTo( gridWidth, row * options.cellSize.height );
    }

    // vertical lines
    for ( var column = 1; column < options.columns; column++ ) {
      gridShape.moveTo( column * options.cellSize.width, 0 ).lineTo( column * options.cellSize.width, gridHeight );
    }

    Path.call( this, gridShape, options );
  }

  equalityExplorer.register( 'GridNode', GridNode );

  return inherit( Path, GridNode );
} );
