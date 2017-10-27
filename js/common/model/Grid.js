// Copyright 2017, University of Colorado Boulder

/**
 * A grid that contains objects. In this sim, those objects are Items.
 * The grid is filled from the bottom up, so that there are no empty cells below an occupied cell.
 *
 * A cell in the grid is identified by an integer index. The client doesn't need to know how to interpret
 * this index. It gets an index from the grid, and uses the index to refer to the cell.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NO_OBJECT = null;

  /**
   * @param {Property.<Vector2>} locationProperty
   * @param {Object} [options]
   * @constructor
   */
  function Grid( locationProperty, options ) {

    options = _.extend( {
      rows: 10,
      columns: 10,
      cellWidth: 5,
      cellHeight: 5
    }, options );

    // @private
    this.locationProperty = locationProperty;

    // @public (read-only)
    this.rows = options.rows;
    this.columns = options.columns;
    this.numberOfCells = options.rows * options.columns;

    // @private
    this.cellWidth = options.cellWidth;
    this.cellHeight = options.cellHeight;

    // @private objects are stored in a 1-D array, in row-major order (left-to-right, top-to-bottom)
    this.cells = [];
    for ( var index = 0; index < this.numberOfCells; index++ ) {
      this.cells[ index ] = NO_OBJECT;
    }
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
      return ( this.cells[ index ] === NO_OBJECT );
    },

    /**
     * Clears the specified cell
     * @param index - the cell's index
     * @public
     */
    clearCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      this.cells[ index ] = NO_OBJECT;
    },

    /**
     * Clears all cells.
     * @public
     */
    clearAllCells: function() {
      for ( var index = 0; index < this.cells.length; index++ ) {
        this.cells[ index ] = NO_OBJECT;
      }
    },

    /**
     * Gets the index for the cell that an object occupies.
     * @param {Object} object
     * @returns {number} the cell's index, -1 if the object doesn't occupy a cell
     * @pubic
     */
    getCellForObject: function( object ) {
      assert && assert( object, 'object must be provided' );
      return this.cells.indexOf( object );
    },

    /**
     * Gets the object that occupies a specified cell.
     * @param {number} index - the cell's index
     * @returns {Object|null} - null if the cell is empty
     */
    getObjectForCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      return this.cells[ index ];
    },

    /**
     * Does the grid contain the specified object?
     * @param {Object} object
     * @returns {boolean}
     * @public
     */
    containsObject: function( object ) {
      return ( this.getCellForObject( object ) !== -1 );
    },

    /**
     * Puts an object in the specified cell.
     * The cell must be empty, and there must be no empty cells below it.
     * @param {Object} object
     * @param {number} index - the cell's index
     */
    putObject: function( object, index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      assert && assert( this.isEmptyCell( index ), 'cell is occupied, index: ' + index );
      this.cells[ index ] = object;
      object.moveTo( this.getCellLocation( index ) );
    },

    /**
     * Removes an object from the grid. Any objects above it "fall" down.
     * @param {Object} object
     */
    removeObject: function( object ) {
      var index = this.getCellForObject( object );
      assert && assert( index !== -1, 'object not found: ' + object.toString() );
      this.clearCell( index );
      this.shiftDown( index );
    },

    /**
     * Shifts all objects that are above a cell down 1 cell, to fill the empty cell caused by removing an object.
     * @param {index} index - index of the cell that was occupied by the removed object
     * @private
     */
    shiftDown: function( index ) {
      assert && assert( this.isEmptyCell( index ), 'cell is not empty: ' + index );

      // row and column of the removed object
      var removedRow = this.indexToRow( index );
      var removedColumn = this.indexToColumn( index );

      for ( var row = removedRow - 1; row >= 0; row-- ) {

        var currentIndex = this.rowColumnToIndex( row, removedColumn );

        if ( !this.isEmptyCell( currentIndex ) ) {

          // remove object from it's current cell
          var object = this.cells[ currentIndex ];
          this.clearCell( currentIndex );

          // move object down 1 row
          var newIndex = this.rowColumnToIndex( row + 1, removedColumn );
          this.putObject( object, newIndex );
        }
      }
    },

    /**
     * Gets the location of a specific cell. A cell's location is in the center of the cell.
     * @param {number} index - the cell's index
     * @returns {Vector2}
     * @public
     */
    getCellLocation: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );

      // left top corner of the grid
      var left = this.locationProperty.value.x - ( this.columns * this.cellWidth ) / 2;
      var top = this.locationProperty.value.y - ( this.rows * this.cellHeight);

      var row = this.indexToRow( index );
      var column = this.indexToColumn( index );

      var x = left + ( column * this.cellWidth ) + ( 0.5 * this.cellWidth );
      var y = top + ( row * this.cellHeight ) + ( 0.5 * this.cellHeight );
      return new Vector2( x, y );
    },

    /**
     * Finds the first empty cell, starting at bottom row, left-to-right.
     * @returns {number} - cell index, -1 if the grid is full
     * @public
     */
    getFirstEmptyCell: function() {
      return this.cells.lastIndexOf( NO_OBJECT );
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

        var closestDistance = this.getCellLocation( closestIndex ).distance( location );

        // Find the closest cell based on distance
        for ( var index = 0; index < this.cells.length; index++ ) {
          if ( this.isEmptyCell( index ) ) {
            var currentDistance = this.getCellLocation( index ).distance( location );
            if ( currentDistance < closestDistance ) {
              closestDistance = currentDistance;
              closestIndex = index;
            }
          }
        }

        // Now look below the closest cell to see if there are any empty cells in the same column.
        // This makes objects "fall" to the cell that is closest to the bottom of the grid.
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
      return Math.floor( index / this.rows );
    },

    /**
     * Converts a cell index to a column number.
     * @param {number} index
     * @returns {number}
     * @private
     */
    indexToColumn: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      return index % this.columns;
    },

    /**
     * Converts row and column to a cell index.
     * @param {number} row
     * @param {number} column
     * @returns {number}
     * @public
     */
    rowColumnToIndex: function( row, column ) {
      assert && assert( row >= 0 && row < this.rows, 'invalid row: ' + row );
      assert && assert( column >= 0 && column < this.columns, 'invalid column: ' + column );
      return ( row * this.columns ) + column;
    }
  } );
} );