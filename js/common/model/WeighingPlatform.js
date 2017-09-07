// Copyright 2017, University of Colorado Boulder

/**
 * Platform where Items are placed to be weighed on a balance scale.
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
  function WeighingPlatform( locationProperty, itemCreators, options ) {

    var self = this;

    options = _.extend( {
      supportHeight: 10,
      diameter: 20,
      gridSize: new Dimension2( 1, 1 ),
      cellSize: new Dimension2( 5, 5 )
    }, options );

    // @public (read-only)
    this.locationProperty = locationProperty;
    this.supportHeight = options.supportHeight;
    this.diameter = options.diameter;
    this.gridSize = options.gridSize;
    this.cellSize = options.cellSize;

    // @private {Item[][]} the 2D grid of cells.
    // Initialized to empty, where null indicates an empty cell.
    // Indexed from upper-left of the grid, in row-major order.
    this.cells = [];
    for ( var row = 0; row < this.gridSize.height; row++ ) {
      var rowOfCells = [];
      for ( var column = 0; column < this.gridSize.width; column++ ) {
        rowOfCells.push( null );
      }
      this.cells.push( rowOfCells );
    }

    // {Property} dependencies that require weight to be updated
    var weightDependencies = [];
    itemCreators.forEach( function( itemCreator ) {
      weightDependencies.push( itemCreator.weightProperty );
      weightDependencies.push( itemCreator.numberOfItemsOnScaleProperty );
    } );

    // @public the total weight of the Items that are on the platform
    this.weightProperty = new DerivedProperty( weightDependencies, function() {
      var weight = 0;
      itemCreators.forEach( function( itemCreator ) {
        weight += ( itemCreator.numberOfItemsOnScaleProperty.value * itemCreator.weightProperty.value );
      } );
      return weight;
    } );

    // @private
    this.removeItemBound = this.removeItem.bind( this );

    // When the platform moves, adjust the location of all Items.
    this.locationProperty.link( function( location ) {
      self.updateItemLocations();
    } );
  }

  equalityExplorer.register( 'WeighingPlatform', WeighingPlatform );

  /**
   * Data structure that identifies a cell in the 2D grid.
   * While clients have references to Cells, the specifics of this data structure is private to WeighingPlatform.
   * (Note: Considered using Vector2 or Dimension2, but row and column improve readability of the code.)
   * @param {number} row
   * @param {number} column
   * @constructor
   */
  function Cell( row, column ) {
    
    // @public (read-only)
    this.row = row;
    this.column = column;
  }

  return inherit( Object, WeighingPlatform, {

    /**
     * Synchronizes Item locations with their respective cell locations.
     * @private
     */
    updateItemLocations: function() {
      for ( var row = 0; row < this.gridSize.height; row++ ) {
        for ( var column = 0; column < this.gridSize.width; column++ ) {
          var cell = new Cell( row, column );
          var item = this.getItemInCell( cell );
          item && item.moveTo( this.getCellLocation( cell ) );
        }
      }
    },

    /**
     * Adds an Item to the platform, in a specific cell in the grid.
     * @param {Item} item
     * @param {Cell} cell
     * @public
     */
    addItem: function( item, cell ) {
      assert && this.assertValidCell( cell );
      assert && assert( this.isEmptyCell( cell ), 'cell is occupied: ' + cell );
      assert && assert( !this.containsItem( item ), 'item is already in grid: ' + item.toString() );
      this.putItemInCell( item, cell );
      item.disposedEmitter.addListener( this.removeItemBound );
    },

    /**
     * Removes an Item from the platform. Items above the removed item move down.
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
      assert && assert( this.isEmptyCell( cell ), 'cell is not empty: ' + cell );
      for ( var row = cell.row - 1; row >= 0; row-- ) {

        var currentCell = new Cell( row, cell.column );

        if ( !this.isEmptyCell( currentCell ) ) {

          // remove Item from it's current cell
          var item = this.getItemInCell( currentCell );
          this.clearCell( currentCell );

          // move Item down 1 row
          var newCell = new Cell( row + 1, cell.column );
          assert && assert( this.isEmptyCell( newCell ), 'cell is not empty: ' + cell );
          this.putItemInCell( item, newCell );
          item.moveTo( this.getCellLocation( newCell ) );
        }
      }
    },

    /**
     * Organizes Items on the platform, as specified in #4
     * @public
     */
    organize: function() {
      //TODO organize Items on the platform, see #4
      //TODO cancel drag for all Items on the platform, in case the user is manually organizing
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
      for ( var row = 0; row < this.gridSize.height && !cell; row++ ) {
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
      for ( var row = 0; row < this.gridSize.height; row++ ) {
        for ( var column = 0; column < this.gridSize.width; column++ ) {
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
      for ( row = this.gridSize.height - 1; row > closestCell.row; row-- ) {
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
     * @private
     */
    getFirstEmptyCell: function() {
      var emptyCell = null;
      for ( var row = this.gridSize.height - 1; row >= 0; row-- ) {
        for ( var column = 0; column < this.gridSize.width && !emptyCell; column++ ) {
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
     *
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
      var x = this.locationProperty.value.x - ( this.gridSize.width * this.cellSize.width ) / 2;
      var y = this.locationProperty.value.y - ( this.gridSize.height * this.cellSize.height );
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
        assert( cell.row >= 0 && cell.row < this.gridSize.height, 'row out of bounds: ' + cell.row );
        assert( cell.column >= 0 && cell.column < this.gridSize.width, 'column out of bounds: ' + cell.column );
      }
    },

    /**
     * Gets the number of Cells in the grid. This is the capacity of the platform.
     * @returns {number}
     * @public
     */
    get numberOfCells() {
      return this.gridSize.width * this.gridSize.height;
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
      assert && assert( this.isEmptyCell( cell ), 'cell is occupied: ' + cell );
      this.cells[ cell.row ][ cell.column ] = item;
    },

    /**
     * Clears a cell, making it empty. If the cell is already empty, this is a no-op.
     * @param {Cell} cell
     * @private
     */
    clearCell: function( cell ) {
      assert && this.assertValidCell( cell );
      this.cells[ cell.row ][ cell.column ] = null;
    }
  } );
} );
