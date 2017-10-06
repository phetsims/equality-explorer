// Copyright 2017, University of Colorado Boulder

/**
 * Plate where Items are placed to be weighed on a balance scale.
 * Items are arranged in a 2D grid of cells, where each cell can be occupied by at most one Item.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Item = require( 'EQUALITY_EXPLORER/common/model/Item' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {DerivedProperty.<Vector2>} locationProperty
   * @param {ItemCreator[]} itemCreators
   * @param {Object} [options]
   * @constructor
   */
  function Plate( locationProperty, itemCreators, options ) {

    var self = this;

    options = _.extend( {
      supportHeight: 10, // height of the vertical support that connects the plate to the scale
      diameter: 20, // diameter of the plate
      gridRows: 1, // rows in the 2D grid
      gridColumns: 1, // columns in the 2D grid
      cellSize: new Dimension2( 5, 5 ) // dimensions of each cell in the grid
    }, options );

    // @public (read-only)
    this.locationProperty = locationProperty;
    this.supportHeight = options.supportHeight;
    this.diameter = options.diameter;
    this.gridRows = options.gridRows;
    this.gridColumns = options.gridColumns;
    this.cellSize = options.cellSize;

    // @private
    this.itemCreators = itemCreators;

    // @private {Item[][]} the 2D grid of cells.
    // Initialized to empty, where null indicates an empty cell.
    // Indexed from upper-left of the grid, in row-major order.
    this.cells = [];
    for ( var row = 0; row < this.gridRows; row++ ) {
      var rowOfCells = [];
      for ( var column = 0; column < this.gridColumns; column++ ) {
        rowOfCells.push( null );
      }
      this.cells.push( rowOfCells );
    }

    // {Property[]} dependencies that require numberOfItemsOnPlateProperty to be updated
    var numberOfItemsOnPlateDependencies = [];
    itemCreators.forEach( function( itemCreator ) {
      numberOfItemsOnPlateDependencies.push( itemCreator.numberOfItemsOnScaleProperty );
    } );

    // @public {Property.<number>} total number of Items that are on the plate
    this.numberOfItemsOnPlateProperty = new DerivedProperty( numberOfItemsOnPlateDependencies, function() {
      var count = 0;
      itemCreators.forEach( function( itemCreator ) {
        count += itemCreator.numberOfItemsOnScaleProperty.value;
      } );
      return count;
    } );

    // {Property[]} dependencies that require weightProperty to be updated
    var weightDependencies = [ this.numberOfItemsOnPlateProperty ];
    itemCreators.forEach( function( itemCreator ) {
      weightDependencies.push( itemCreator.weightProperty );
    } );

    // @public {Property.<number>} total weight of the Items that are on the plate
    this.weightProperty = new DerivedProperty( weightDependencies, function() {
      var weight = 0;
      itemCreators.forEach( function( itemCreator ) {
        weight += ( itemCreator.numberOfItemsOnScaleProperty.value * itemCreator.weightProperty.value );
      } );
      return weight;
    } );

    // @private
    this.removeItemBound = this.removeItem.bind( this );

    // When the plate moves, adjust the location of all Items. unlink is unnecessary.
    this.locationProperty.link( function( location ) {
      self.updateItemLocations();
    } );
  }

  equalityExplorer.register( 'Plate', Plate );

  /**
   * Data structure that identifies a cell in the 2D grid.
   * While clients have references to Cells, the specifics of this data structure is private to Plate.
   * Notes:
   * - Considered using Vector2 or Dimension2, but row and column improve readability of the code.
   * - This is solely a lightweight data structure, so no need to use inherit.
   *
   * @param {number} row
   * @param {number} column
   * @constructor
   */
  function Cell( row, column ) {

    // @public (read-only)
    this.row = row;
    this.column = column;
  }

  return inherit( Object, Plate, {

    /**
     * Synchronizes Item locations with their respective cell locations.
     * @private
     */
    updateItemLocations: function() {
      for ( var row = 0; row < this.gridRows; row++ ) {
        for ( var column = 0; column < this.gridColumns; column++ ) {
          var cell = new Cell( row, column );
          var item = this.getItemInCell( cell );
          item && item.moveTo( this.getCellLocation( cell ) );
        }
      }
    },

    /**
     * Adds an Item to the plate, in a specific cell in the grid.
     * @param {Item} item
     * @param {Cell} cell
     * @public
     */
    addItem: function( item, cell ) {
      assert && this.assertValidCell( cell );
      assert && assert( this.isEmptyCell( cell ), 'cell is occupied: ' + cell.row + ',' + cell.column );
      assert && assert( !this.containsItem( item ), 'item is already in grid: ' + item.toString() );
      this.putItemInCell( item, cell );
      item.disposedEmitter.addListener( this.removeItemBound );
    },

    /**
     * Removes an Item from the plate. Items above the removed item move down.
     * @param {Item} item
     * @public
     */
    removeItem: function( item ) {
      var cell = this.getCellForItem( item );
      assert && assert( cell, 'item not found: ' + item.toString() );
      item.disposedEmitter.removeListener( this.removeItemBound );
      this.clearCell( cell );
      this.shiftDown( cell );
    },

    /**
     * Shifts all Items in a column down 1 cell, to fill the empty cell caused by removing an Item.
     * @param {Cell} cell - the cell that was occupied by the removed Item
     * @private
     */
    shiftDown: function( cell ) {
      assert && assert( this.isEmptyCell( cell ), 'cell is not empty: ' + cell.row + ',' + cell.column );
      for ( var row = cell.row - 1; row >= 0; row-- ) {

        var currentCell = new Cell( row, cell.column );

        if ( !this.isEmptyCell( currentCell ) ) {

          // remove Item from it's current cell
          var item = this.getItemInCell( currentCell );
          this.clearCell( currentCell );

          // move Item down 1 row
          var newCell = new Cell( row + 1, cell.column );
          assert && assert( this.isEmptyCell( newCell ), 'cell is not empty: ' + cell.row + ',' + cell.column );
          this.putItemInCell( item, newCell );
          item.moveTo( this.getCellLocation( newCell ) );
        }
      }
    },

    /**
     * Organizes Items on the plate, as specified in https://github.com/phetsims/equality-explorer/issues/4
     * @public
     */
    organize: function() {

      // total up the number of Items to organize
      var numberOfItemsToOrganize = 0;
      this.itemCreators.forEach( function( itemCreator ) {
        numberOfItemsToOrganize += itemCreator.getNumberOfItemsOnScale();
      } );

      if ( numberOfItemsToOrganize > 0 ) {

        var self = this;

        this.clearAllCells();

        // start with the bottom-left cell
        var row = this.gridRows - 1;
        var column = 0;

        this.itemCreators.forEach( function( itemCreator ) {

          var items = itemCreator.getItemsOnScale();

          if ( items.length > 0 ) {

            // stack the Items in columns, from left to right
            for ( var i = 0; i < items.length; i++ ) {

              var item = items[ i ];
              self.putItemInCell( item, new Cell( row, column ) );
              numberOfItemsToOrganize--;

              // advance to the next cell
              if ( i < items.length - 1 ) {
                if ( row > 0 ) {

                  // next cell in the current column
                  row--;
                }
                else {

                  // start a new column
                  row = self.gridRows - 1;
                  column++;
                }
              }
            }

            if ( numberOfItemsToOrganize > 0 ) {

              // Start a new column if we have enough cells to the right of the current column.
              // Otherwise continue to fill the current column.
              var numberOfCellsToRight = ( self.gridColumns - column - 1 ) * self.gridRows;
              if ( numberOfCellsToRight >= numberOfItemsToOrganize ) {
                row = self.gridRows - 1;
                column++;
              }
              else {
                row--;
              }
            }
          }
        } );
        assert && assert( numberOfItemsToOrganize === 0 );

        // Center the stacks on the plate by shifting Items to the right.
        var numberOfEmptyColumns = self.gridColumns - column - 1;
        var gridColumnsToShiftRight = Math.floor( numberOfEmptyColumns / 2 );
        if ( gridColumnsToShiftRight > 0 ) {
          for ( row = self.gridRows - 1; row >= 0; row-- ) {
            for ( column = self.gridColumns - 1; column >= 0; column-- ) {
              var cell = new Cell( row, column );
              var item = this.getItemInCell( cell );
              if ( item ) {
                this.clearCell( cell );
                this.putItemInCell( item, new Cell( row, column + gridColumnsToShiftRight ) );
              }
            }
          }
        }
      }
    },

    /**
     * Is the specified cell empty?
     * @param {Cell} cell
     * @returns {boolean}
     * @public
     */
    isEmptyCell: function( cell ) {
      assert && this.assertValidCell( cell );
      return ( this.getItemInCell( cell ) === null );
    },

    /**
     * Gets the cell that an Item occupies.
     * @param item
     * @returns {Cell} null item doesn't occupy a cell
     * @private
     */
    getCellForItem: function( item ) {
      var cell = null;
      for ( var row = 0; row < this.gridRows && !cell; row++ ) {
        var column = this.cells[ row ].indexOf( item );
        if ( column !== -1 ) {
          cell = new Cell( row, column );
        }
      }
      return cell;
    },

    /**
     * Does the grid contain the specified Item?
     * @param {Item} item
     * @returns {boolean}
     * @public
     */
    containsItem: function( item ) {
      return ( this.getCellForItem( item ) !== null );
    },

    /**
     * Gets the closest empty cell to a specified location.
     * @param {Vector2} location
     * @returns {Cell}
     * @public
     */
    getClosestEmptyCell: function( location ) {

      var closestCell = this.getFirstEmptyCell();
      if ( !closestCell ) {
        return null;
      }

      var closestDistance = this.getCellLocation( closestCell ).distance( location );

      var currentCell = null; // the cell we're currently examining

      // Find the closest cell based on distance
      for ( var row = 0; row < this.gridRows; row++ ) {
        for ( var column = 0; column < this.gridColumns; column++ ) {
          var cell = new Cell( row, column );
          if ( this.isEmptyCell( cell ) ) {
            currentCell = cell;
            var currentDistance = this.getCellLocation( currentCell ).distance( location );
            if ( currentDistance < closestDistance ) {
              closestDistance = currentDistance;
              closestCell = currentCell;
            }
          }
        }
      }

      // Now look below the closest cell to see if there are any empty cells in the same row.
      // This accounts for gravity, so Items fall to the cell that is closest to the bottom of the grid.
      for ( row = this.gridRows - 1; row > closestCell.row; row-- ) {
        currentCell = new Cell( row, closestCell.column );
        if ( this.isEmptyCell( currentCell ) ) {
          closestCell = currentCell;
          break;
        }
      }

      return closestCell;
    },

    /**
     * Examines the grid from left to right, top to bottom, and returns the first empty cell.
     * @returns {Cell} null if the grid is full
     * @public
     */
    getFirstEmptyCell: function() {
      var emptyCell = null;
      for ( var row = this.gridRows - 1; row >= 0; row-- ) {
        for ( var column = 0; column < this.gridColumns && !emptyCell; column++ ) {
          var cell = new Cell( row, column );
          if ( this.isEmptyCell( cell ) ) {
            emptyCell = cell;
          }
        }
      }
      return emptyCell;
    },

    /**
     * Gets the location of a specific cell, in global coordinates.
     * A cell's location is in the center of the cell.
     * @param {Cell} cell
     * @returns {Vector2}
     * @public
     */
    getCellLocation: function( cell ) {
      assert && this.assertValidCell( cell );

      var upperLeft = this.getGridUpperLeft();
      var x = upperLeft.x + ( cell.column * this.cellSize.width ) + ( 0.5 * this.cellSize.width );
      var y = upperLeft.y + ( cell.row * this.cellSize.height ) + ( 0.5 * this.cellSize.height );
      return new Vector2( x, y );
    },

    /**
     * Gets the location of the upper-left corner of the grid, in global coordinates.
     * @returns {Vector2}
     * @private
     */
    getGridUpperLeft: function() {
      var x = this.locationProperty.value.x - ( this.gridColumns * this.cellSize.width ) / 2;
      var y = this.locationProperty.value.y - ( this.gridRows * this.cellSize.height );
      return new Vector2( x, y );
    },

    /**
     * Validates a Cell. Intended to be called when assertions are enabled.
     * @param {Cell} cell
     * @private
     */
    assertValidCell: function( cell ) {
      if ( assert ) {
        assert( cell instanceof Cell );
        assert( cell.row >= 0 && cell.row < this.gridRows, 'row out of bounds: ' + cell.row );
        assert( cell.column >= 0 && cell.column < this.gridColumns, 'column out of bounds: ' + cell.column );
      }
    },

    /**
     * Gets the number of Cells in the grid. This is the capacity of the plate.
     * @returns {number}
     * @public
     */
    get numberOfCells() {
      return this.gridColumns * this.gridRows;
    },

    /**
     * Gets the Item in a cell.
     * @param {Cell} cell
     * @returns {Item|null} null if the cell is empty
     * @private
     */
    getItemInCell: function( cell ) {
      assert && this.assertValidCell( cell );
      return this.cells[ cell.row ][ cell.column ];
    },

    /**
     * Puts an Item in a cell. The cell must be empty.
     * @param {Item|null} item
     * @param {Cell} cell
     * @private
     */
    putItemInCell: function( item, cell ) {
      assert && assert( item === null || item instanceof Item );
      assert && assert( this.isEmptyCell( cell ), 'cell is occupied: ' + cell.row + ',' + cell.column );
      this.cells[ cell.row ][ cell.column ] = item;
      item.moveTo( this.getCellLocation( cell ) );
    },

    /**
     * Clears a cell, making it empty. If the cell is already empty, this is a no-op.
     * @param {Cell} cell
     * @private
     */
    clearCell: function( cell ) {
      assert && this.assertValidCell( cell );
      this.cells[ cell.row ][ cell.column ] = null;
    },

    /**
     * Clears all cells in the grid.
     * @private
     */
    clearAllCells: function() {
      for ( var row = 0; row < this.gridRows; row++ ) {
        for ( var column = 0; column < this.gridColumns; column++ ) {
          this.clearCell( new Cell( row, column ) );
        }
      }
    }
  } );
} );
