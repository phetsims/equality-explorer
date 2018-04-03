// Copyright 2017-2018, University of Colorado Boulder

/**
 * 2D grid on a plate on the balance scale.
 *
 * A grid contains terms. The grid is filled from the bottom up, so that there are no empty cells
 * below an occupied cell. Origin is at the bottom center.
 *
 * A cell in the grid is identified by an integer index. The client doesn't need to know how to interpret
 * this identifier. It gets a cell identifier from the grid, and uses the identifier to refer to the cell.
 *
 * Using an integer index has a couple of advantages: fast lookup of terms in the grid, and low memory footprint.
 * The main disadvantage is the need to map between (row,column) and index, but that need is totally internal
 * to Grid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NO_TERM = null; // occupies all empty cells in the grid

  /**
   * @param {Property.<Vector2>} locationProperty
   * @param {Object} [options]
   * @constructor
   */
  function Grid( locationProperty, options ) {

    var self = this;

    options = _.extend( {
      rows: 10,
      columns: 10,
      cellWidth: 5,
      cellHeight: 5
    }, options );

    // @private (read-only)
    this.locationProperty = locationProperty;

    // @public (read-only)
    this.rows = options.rows;
    this.columns = options.columns;

    // @private
    this.cellWidth = options.cellWidth;
    this.cellHeight = options.cellHeight;

    // @private The 2D grid is stored as a 1D array, in row-major order (left-to-right, top-to-bottom).
    // Each entry in this array is a cell in the grid.  Empty cells contain NO_TERM.
    // Storing as a 1D array makes it easy for snapshots to save/restore the location of terms in the grid.
    // See rowColumnToCell, cellToRow, cellToColumn for mapping between index and (row,column).
    this.cells = [];
    var numberOfCells = options.rows * options.columns;
    for ( var i = 0; i < numberOfCells; i++ ) {
      this.cells[ i ] = NO_TERM;
    }

    // @private bounds of the grid, initialized in locationProperty listener
    this.bounds = new Bounds2( 0, 1, 0, 1 );

    // When the grid moves ...
    // unlink not required.
    this.locationProperty.link( function( location ) {

      // recompute the grid's bounds, origin (x,y) is at bottom center
      self.bounds.setMinMax(
        location.x - ( self.columns * self.cellWidth / 2 ), // minX
        location.y - ( self.rows * self.cellHeight ), // minY
        location.x + ( self.columns * self.cellWidth / 2 ), // maxX
        location.y // maxY
      );

      // move the terms
      for ( var i = 0; i < self.cells.length; i++ ) {
        if ( self.cells[ i ] !== NO_TERM ) {
          self.cells[ i ].moveTo( self.getLocationOfCell( i ) );
        }
      }
    } );
  }

  equalityExplorer.register( 'Grid', Grid );

  return inherit( Object, Grid, {

    /**
     * Is the specified cell empty?
     * @param {number} cell
     * @returns {boolean}
     * @public
     */
    isEmptyCell: function( cell ) {
      assert && assert( this.isValidCell( cell ), 'invalid cell: ' + cell );
      return ( this.getTermInCell( cell ) === NO_TERM );
    },

    /**
     * Clears the specified cell
     * @param cell
     * @public
     */
    clearCell: function( cell ) {
      assert && assert( this.isValidCell( cell ), 'invalid v: ' + cell );
      this.cells[ cell ] = NO_TERM;
    },

    /**
     * Clears all cells.
     * @public
     */
    clearAllCells: function() {
      for ( var i = 0; i < this.cells.length; i++ ) {
        this.clearCell( i );
      }
    },

    /**
     * Clears the specified column. Used by compactColumn.
     * @param {number} column
     * @private
     */
    clearColumn: function( column ) {
      assert && assert( column >= 0 && column < this.columns, 'invalid column: ' + column );
      for ( var row = 0; row < this.rows; row++ ) {
        this.clearCell( this.rowColumnToCell( row, column ) );
      }
    },

    /**
     * Gets the cell that corresponds to a location.
     * @param {Vector2} location
     * @returns {number|null} the cell identifier, null if the location is outside the grid
     * @private
     */
    getCellAtLocation: function( location ) {
      var cell = null;
      if ( this.containsLocation( location ) ) {

        // row and column of the cell that contains location
        // Math.min handles the case where location is exactly on bounds.maxX or maxY. See #39.
        var row = Math.min( this.rows - 1, Math.floor( ( location.y - this.bounds.minY ) / this.cellHeight ) );
        var column = Math.min( this.columns - 1, Math.floor( ( location.x - this.bounds.minX ) / this.cellWidth ) );

        cell = this.rowColumnToCell( row, column );
      }
      return cell;
    },

    /**
     * Is the specified location inside the grid?
     * This needs to be fast, since it's called during a drag cycle.
     * @param {Vector2} location
     * @returns {boolean}
     * @private
     */
    containsLocation: function( location ) {
      return this.bounds.containsPoint( location );
    },

    /**
     * Gets the cell that a term occupies.
     * @param {Term} term
     * @returns {number|null} the cell's identifier, null if the term doesn't occupy a cell
     * @public
     */
    getCellForTerm: function( term ) {
      assert && assert( term instanceof Term, 'invalid term' );
      var index = this.cells.indexOf( term );
      return ( index === -1 ) ? null : index;
    },

    /**
     * Gets the term that occupies a specified cell.
     * @param {number} cell
     * @returns {Term|null} - null if the cell is empty
     * @public
     */
    getTermInCell: function( cell ) {
      assert && assert( this.isValidCell( cell ), 'invalid cell: ' + cell );
      return this.cells[ cell ];
    },

    /**
     * Gets the term at a specified location in the grid.
     * @param {Vector2} location
     * @returns {Term|null} null if location is outside the grid, or the cell at location is empty
     * @public
     */
    getTermAtLocation: function( location ) {
      var term = null;
      var cell = this.getCellAtLocation( location );
      if ( cell !== null ) {
        term = this.getTermInCell( cell );
      }
      return term;
    },

    /**
     * Puts a term in the specified cell. The cell must be empty.
     * @param {Term} term
     * @param {number} cell
     * @public
     */
    putTerm: function( term, cell ) {
      assert && assert( term instanceof Term, 'invalid term' );
      assert && assert( this.isValidCell( cell ), 'invalid cell: ' + cell );
      assert && assert( this.isEmptyCell( cell ), 'cell is occupied, cell: ' + cell );
      this.cells[ cell ] = term;
      term.moveTo( this.getLocationOfCell( cell ) );
    },

    /**
     * Removes a term from the grid. Any terms above it move down to fill the empty cell.
     * @param {Term} term
     * @public
     */
    removeTerm: function( term ) {
      assert && assert( term instanceof Term, 'invalid term: ' + term );
      var cell = this.getCellForTerm( term );
      assert && assert( cell !== null, 'term not found: ' + term );
      this.clearCell( cell );
      this.compactColumn( this.cellToColumn( cell ) );
    },

    /**
     * Compacts a column so that it contains no empty cells below terms.
     * If the column contains no holes, then the grid in not modified.
     * @param {number} column
     * @private
     */
    compactColumn: function( column ) {
      assert && assert( column >= 0 && column < this.columns, 'invalid column: ' + column );

      var hasHoles = false; // does the column have one or more holes?
      var terms = []; // terms in the column

      var term; // the current term
      var cell; // the current cell identifier

      // Get all terms in the column, from top down
      for ( var row = 0; row < this.rows; row++ ) {
        cell = this.rowColumnToCell( row, column );
        term = this.getTermInCell( cell );
        if ( term ) {
          terms.push( term );
        }
        else if ( terms.length > 0 ) {
          hasHoles = true;
        }
      }

      // If the column has holes ...
      if ( hasHoles ) {

        phet.log && phet.log( 'Grid: compacting holes identified in column ' + column );

        // clear the column
        this.clearColumn( column );

        // Put terms pack into the column, from bottom up.
        row = this.rows - 1;
        for ( var i = terms.length - 1; i >= 0; i-- ) {
          term = terms[ i ];
          cell = this.rowColumnToCell( row--, column );
          this.cells[ cell ] = term;
          term.moveTo( this.getLocationOfCell( cell ) );
        }
      }
    },

    /**
     * Gets the location of a specific cell. A cell's location is in the center of the cell.
     * @param {number} cell
     * @returns {Vector2}
     * @public
     */
    getLocationOfCell: function( cell ) {
      assert && assert( this.isValidCell( cell ), 'invalid cell: ' + cell );

      var row = this.cellToRow( cell );
      var column = this.cellToColumn( cell );

      var x = this.bounds.minX + ( column * this.cellWidth ) + ( 0.5 * this.cellWidth );
      var y = this.bounds.minY + ( row * this.cellHeight ) + ( 0.5 * this.cellHeight );
      return new Vector2( x, y );
    },

    /**
     * Finds the last empty cell in the array.
     * @returns {number|null} - the cell's identifier, null if the grid is full
     * @private
     */
    getLastEmptyCell: function() {
      var index = this.cells.lastIndexOf( NO_TERM );
      return ( index === -1 ) ? null : index;
    },

    /**
     * Gets the empty cell that would be the best fit for adding a term to the grid.
     * Start by identifying the closest empty cell.  If that cell is in a column with empty cells below it,
     * choose the empty cell that is closest to the bottom of the grid in that column.
     * @param {Vector2} location
     * @returns {number|null} - the cell's identifier, null if the grid is full
     * @public
     */
    getBestEmptyCell: function( location ) {

      // Start with the last empty cell in the array
      var closestCell = this.getLastEmptyCell();

      // Careful! closestCell is {number|null}, and might be 0
      // If the grid is not full...
      if ( closestCell !== null ) {

        var closestDistance = this.getLocationOfCell( closestCell ).distance( location );

        // Find the closest cell based on distance, working backwards from lastEmptyCell.
        // This is brute force, but straightforward, and not a performance issue because the number of cells is small.
        for ( var i = closestCell - 1; i >= 0; i-- ) {
          if ( this.isEmptyCell( i ) ) {
            var distance = this.getLocationOfCell( i ).distance( location );
            if ( distance < closestDistance ) {
              closestDistance = distance;
              closestCell = i;
            }
          }
        }

        // Now look below the closest cell to see if there are any empty cells in the same column.
        // This makes terms "fall" to the cell that is closest to the bottom of the grid.
        var closestRow = this.cellToRow( closestCell );
        var closestColumn = this.cellToColumn( closestCell );
        for ( var row = this.rows - 1; row > closestRow; row-- ) {
          var cellBelow = this.rowColumnToCell( row, closestColumn );
          if ( this.isEmptyCell( cellBelow ) ) {
            closestCell = cellBelow;
            break;
          }
        }
      }

      return closestCell;
    },

    /**
     * Is the specified cell identifier valid?
     * @param {number} cell
     * @returns {boolean}
     * @private
     */
    isValidCell: function( cell ) {
      return ( Util.isInteger( cell ) && cell >= 0 && cell < this.cells.length );
    },

    /**
     * Converts a cell identifier to a row number.
     * @param {number} cell
     * @returns {number}
     * @private
     */
    cellToRow: function( cell ) {
      assert && assert( this.isValidCell( cell ), 'invalid cell: ' + cell );
      var row = Math.ceil( ( cell + 1 ) / this.columns ) - 1;
      assert && assert( row >= 0 && row < this.rows );
      return row;
    },

    /**
     * Converts a cell identifier to a column number.
     * @param {number} cell
     * @returns {number}
     * @private
     */
    cellToColumn: function( cell ) {
      assert && assert( this.isValidCell( cell ), 'invalid cell: ' + cell );
      var column = cell % this.columns;
      assert && assert( column >= 0 && column < this.columns );
      return column;
    },

    /**
     * Converts row and column to a cell identifier.
     * @param {number} row
     * @param {number} column
     * @returns {number}
     * @public
     */
    rowColumnToCell: function( row, column ) {
      assert && assert( row >= 0 && row < this.rows, 'row out of range: ' + row );
      assert && assert( column >= 0 && column < this.columns, 'column out of range: ' + column );
      var cell = ( row * this.columns ) + column;
      assert && assert( this.isValidCell( cell ), 'invalid cell: ' + cell );
      return cell;
    }
  } );
} );