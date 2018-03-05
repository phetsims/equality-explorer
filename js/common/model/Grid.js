// Copyright 2017-2018, University of Colorado Boulder

/**
 * A grid that contains terms. The grid is filled from the bottom up, so that there are no empty cells
 * below an occupied cell. Origin is at the bottom center.
 *
 * A cell in the grid is identified by an integer index. The client doesn't need to know how to interpret
 * this index. It gets an index from the grid, and uses the index to refer to the cell.
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
  var NO_TERM = null;

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
    this.cells = [];
    var numberOfCells = options.rows * options.columns;
    for ( var index = 0; index < numberOfCells; index++ ) {
      this.cells[ index ] = NO_TERM;
    }

    // @private bounds of the grid, initialized in locationProperty listener
    this.bounds = new Bounds2( 0, 1, 0, 1 );

    // When the grid moves, move all terms that are in the grid.
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
      for ( var index = 0; index < self.cells.length; index++ ) {
        if ( self.cells[ index ] !== NO_TERM ) {
          self.cells[ index ].moveTo( self.getLocationForCell( index ) );
        }
      }
    } );
  }

  equalityExplorer.register( 'Grid', Grid );

  return inherit( Object, Grid, {

    /**
     * Is the specified cell empty?
     * @param {number} index - the cell's index
     * @returns {boolean}
     * @public
     */
    isEmptyCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      return ( this.cells[ index ] === NO_TERM );
    },

    /**
     * Clears the specified cell
     * @param index - the cell's index
     * @public
     */
    clearCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      this.cells[ index ] = NO_TERM;
    },

    /**
     * Clears all cells.
     * @public
     */
    clearAllCells: function() {
      for ( var index = 0; index < this.cells.length; index++ ) {
        this.cells[ index ] = NO_TERM;
      }
    },

    /**
     * Clears the specified column. Used by compactColumn.
     * @param {number} column
     */
    clearColumn: function( column ) {
      assert && assert( column >= 0 && column < this.columns, 'invalid column: ' + column );
       for ( var row = 0; row < this.rows; row++ ) {
         this.clearCell( this.rowColumnToIndex( row, column ) );
       }
    },

    /**
     * Gets the index of the cell that corresponds to a location.
     * @param {Vector2} location
     * @returns {number} -1 if the location is outside the grid
     * @private
     */
    getCellAtLocation: function( location ) {
      var index = -1;
      if ( this.containsLocation( location ) ) {

        // row and column of the cell that contains location
        // Math.min handles the case where location is exactly on bounds.maxX or maxY. See #39.
        var row = Math.min( this.rows - 1, Math.floor( ( location.y - this.bounds.minY  ) / this.cellHeight ) );
        var column = Math.min( this.columns - 1, Math.floor( ( location.x - this.bounds.minX ) / this.cellWidth ) );

        index = this.rowColumnToIndex( row, column );
      }
      return index;
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
     * Gets the index for the cell that a term occupies.
     * @param {Term} term
     * @returns {number} the cell's index, -1 if the term doesn't occupy a cell
     * @public
     */
    getCellForTerm: function( term ) {
      assert && assert( term instanceof Term, 'invalid term' );
      return this.cells.indexOf( term );
    },

    /**
     * Gets the term that occupies a specified cell.
     * @param {number} index - the cell's index
     * @returns {Term|null} - null if the cell is empty
     * @public
     */
    getTermForCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      return this.cells[ index ];
    },

    /**
     * Gets the term at a specified location in the grid.
     * @param {Vector2} location
     * @returns {Term|null} null if location is outside the grid, or the cell at location is empty
     * @public
     */
    getTermAtLocation: function( location ) {
      var term = null;
      var index = this.getCellAtLocation( location );
      if ( index !== -1 ) {
        term = this.getTermForCell( index );
      }
      return term;
    },

    /**
     * Puts a term in the specified cell. The cell must be empty.
     * @param {Term} term
     * @param {number} index - the cell's index
     * @public
     */
    putTerm: function( term, index ) {
      assert && assert( term instanceof Term, 'invalid term' );
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      assert && assert( this.isEmptyCell( index ), 'cell is occupied, index: ' + index );
      this.cells[ index ] = term;
      term.moveTo( this.getLocationForCell( index ) );
      this.compactColumn( this.indexToColumn( index ) );
    },

    /**
     * Removes a term from the grid. Any terms above it move down to fill the empty cell.
     * @param {Term} term
     * @public
     */
    removeTerm: function( term ) {
      assert && assert( term instanceof Term, 'invalid term' );
      var index = this.getCellForTerm( term );
      assert && assert( index !== -1, 'term not found: ' + term );
      this.clearCell( index );
      this.compactColumn( this.indexToColumn( index ) );
    },

    /**
     * Compacts a column so that it contains no empty cells below terms.
     * If the column contains no holes, then the grid in not modified.
     * @param {number} column
     */
    compactColumn: function( column ) {
      assert && assert( column >= 0 && column < this.columns, 'invalid column: ' + column );

      var hasHoles = false; // does the column have one or more holes?
      var terms = []; // terms in the column

      var term; // the current term
      var index; // the current cell index


      // Get all terms in the column, from top down
      for ( var row = 0; row < this.rows; row++ ) {
        index = this.rowColumnToIndex( row, column );
        term = this.getTermForCell( index );
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
          index = this.rowColumnToIndex( row--, column );
          this.cells[ index ] = term;
          term.moveTo( this.getLocationForCell( index ) );
        }
      }
    },

    /**
     * Gets the location of a specific cell. A cell's location is in the center of the cell.
     * @param {number} index - the cell's index
     * @returns {Vector2}
     * @public
     */
    getLocationForCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );

      var row = this.indexToRow( index );
      var column = this.indexToColumn( index );

      var x = this.bounds.minX + ( column * this.cellWidth ) + ( 0.5 * this.cellWidth );
      var y = this.bounds.minY + ( row * this.cellHeight ) + ( 0.5 * this.cellHeight );
      return new Vector2( x, y );
    },

    /**
     * Finds the first empty cell, starting at bottom row, right-to-left.
     * @returns {number} - cell index, -1 if the grid is full
     * @public
     */
    getFirstEmptyCell: function() {
      return this.cells.lastIndexOf( NO_TERM );
    },

    /**
     * Gets the closest empty cell to a specified location.
     * @param {Vector2} location
     * @returns {number} - the cell's index, -1 if the grid is full
     * @public
     */
    getClosestEmptyCell: function( location ) {

      var closestIndex = this.getFirstEmptyCell();

      if ( closestIndex !== -1 ) {

        var closestDistance = this.getLocationForCell( closestIndex ).distance( location );

        // Find the closest cell based on distance
        for ( var index = 0; index < this.cells.length; index++ ) {
          if ( this.isEmptyCell( index ) ) {
            var currentDistance = this.getLocationForCell( index ).distance( location );
            if ( currentDistance < closestDistance ) {
              closestDistance = currentDistance;
              closestIndex = index;
            }
          }
        }

        // Now look below the closest cell to see if there are any empty cells in the same column.
        // This makes terms "fall" to the cell that is closest to the bottom of the grid.
        var closestRow = this.indexToRow( closestIndex );
        var closestColumn = this.indexToColumn( closestIndex );
        for ( var row = this.rows - 1; row > closestRow; row-- ) {
          var indexBelow = this.rowColumnToIndex( row, closestColumn );
          if ( this.isEmptyCell( indexBelow ) ) {
            closestIndex = indexBelow;
            break;
          }
        }
      }

      return closestIndex;
    },

    /**
     * Is the specified cell valid?
     * @param {number} index - the cell's index
     * @returns {boolean}
     * @private
     */
    isValidCell: function( index ) {
      return ( Util.isInteger( index ) && index >= 0 && index < this.cells.length );
    },

    /**
     * Converts a cell index to a row number.
     * @param {number} index
     * @returns {number}
     * @private
     */
    indexToRow: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      var row = Math.ceil( ( index + 1 ) / this.columns ) - 1;
      assert && assert( row >= 0 && row < this.rows );
      return row;
    },

    /**
     * Converts a cell index to a column number.
     * @param {number} index
     * @returns {number}
     * @private
     */
    indexToColumn: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      var column = index % this.columns;
      assert && assert( column >= 0 && column < this.columns );
      return column;
    },

    /**
     * Converts row and column to a cell index.
     * @param {number} row
     * @param {number} column
     * @returns {number}
     * @public
     */
    rowColumnToIndex: function( row, column ) {
      assert && assert( row >= 0 && row < this.rows, 'row out of range: ' + row );
      assert && assert( column >= 0 && column < this.columns, 'column out of range: ' + column );
      var index = ( row * this.columns ) + column;
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      return index;
    }
  } );
} );