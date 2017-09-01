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
  var ObservableArray = require( 'AXON/ObservableArray' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {DerivedProperty.<Vector2>} locationProperty
   * @param {Object} [options]
   * @constructor
   */
  function WeighingPlatform( locationProperty, options ) {

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

    // @private {Item[][]} null indicates an empty cell
    this.cells = [];
    for ( var row = 0; row < this.gridSize.height; row++ ) {
      var rowOfCells = [];
      for ( var column = 0; column < this.gridSize.width; column++ ) {
        rowOfCells.push( null );
      }
      this.cells.push( rowOfCells );
    }

    // @public (read-only) {ObservableArray.<Item>} Items that are on the platform
    this.items = new ObservableArray();

    // @public the total weight of the Items that are on the platform
    this.weightProperty = new DerivedProperty( [ this.items.lengthProperty ], function( length ) {
      var weight = 0;
      self.items.forEach( function( item ) {
        weight += item.weightProperty.value;
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


  return inherit( Object, WeighingPlatform, {

    /**
     * Gets the number of cells in the grid. This is the capacity of the platform.
     * @returns {number}
     */
    get numberOfCells() {
      return this.gridSize.width * this.gridSize.height;
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
     * Adds an Item to a specific cell in the grid.
     * @param {Item} item
     * @param {row:number, column:number} cell
     * @public
     */
    addItem: function( item, cell ) {
      assert && this.assertValidCell( cell );
      assert && assert( this.isEmptyCell( cell ), 'cell is occupied: ' + this.cellToString( cell ) );
      assert && assert( !this.containsItem( item ), 'Item is already in grid: ' + item.toString() );
      this.cells[ cell.row ][ cell.column ] = item;
      this.items.push( item );
      item.disposedEmitter.addListener( this.removeItemBound );
    },

    /**
     * Removes an Item from the grid.
     * @param {Item} item
     * @public
     */
    removeItem: function( item ) {
      var removed = false;
      for ( var row = 0; row < this.gridSize.height && !removed; row++ ) {
        for ( var column = 0; column < this.gridSize.width && !removed; column++ ) {
          if ( this.cells[ row ][ column ] === item ) {
            this.cells[ row ][ column ] = null;
            this.items.remove( item );
            item.disposedEmitter.removeListener( this.removeItemBound );
            removed = true;
            this.shiftDown( { row: row, column: column } );
          }
        }
      }
      assert && assert( removed, 'Item is not in grid: ' + item.toString() );
    },

    /**
     * Shifts all Items in a column down 1 cell, to fill empty cell caused by removing an Item.
     * @param {row:number, column: number} cell - the cell that was occupied by the removed Item
     */
    shiftDown: function( cell ) {
      for ( var row = cell.row - 1; row >= 0; row-- ) {
        if ( !this.isEmptyCell( { row: row, column: cell.column } ) ) {

          // remove Item from it's current cell
          var item = this.cells[ row ][ cell.column ];
          this.cells[ row ][ cell.column ] = null;

          // move Item down 1 row
          var newCell = { row: row + 1, column: cell.column };
          assert && assert( this.isEmptyCell( newCell ),
            'cell is not empty: row=' + newCell.row + ', column: ' + newCell.column );
          this.cells[ newCell.row ][ newCell.column ] = item;
          item.moveTo( this.getCellLocation( newCell ) );
        }
      }
    },

    /**
     * Disposes of all Items that are on the platform.
     * @public
     */
    disposeAllItems: function() {
      while ( this.items.length > 0 ) {
        var item = this.items.get( 0 );
        item.dispose();
      }
    },

    /**
     * Is the specific cell empty?
     * @param {row:number, column:number} cell
     * @returns {boolean}
     */
    isEmptyCell: function( cell ) {
      assert && this.assertValidCell( cell );
      return ( this.cells[ cell.row ][ cell.column ] === null );
    },

    /**
     * Does the grid contain the specified Item?
     * @param {Item} item
     * @returns {boolean}
     * @public
     */
    containsItem: function( item ) {
      return this.items.contains( item );
    },

    /**
     * Gets the closest empty cell to a specified location.
     * @param {Vector2} location
     * @returns {row:number, column:number}
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
          if ( this.isEmptyCell( { row: row, column: column } ) ) {
            currentCell = { row: row, column: column };
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
        currentCell = { row: row, column: closestCell.column };
        if ( this.isEmptyCell( currentCell ) ) {
          closestCell = currentCell;
          break;
        }
      }

      return closestCell;
    },

    /**
     * Gets the location of a specific cell, in global coordinates.
     * A cell's location is in the center of the cell.
     *
     * @param {row:number, column:number} cell
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
     * Examines the grid from left to right, top to bottom, and returns the first empty cell.
     * @returns {row:number, column:number} null if the grid is full
     */
    getFirstEmptyCell: function() {
      var cell = null;
      for ( var row = this.gridSize.height - 1; row >= 0; row-- ) {
        for ( var column = 0; column < this.gridSize.width && !cell; column++ ) {
          if ( this.cells[ row ][ column ] === null ) {
            cell = { row: row, column: column };
          }
        }
      }
      return cell;
    },

    //TODO use a better abstraction for 'cell'?
    // @private
    assertValidCell: function( cell ) {
      if ( assert ) {
        assert( cell );
        assert( typeof cell.row === 'number' );
        assert( typeof cell.column === 'number' );
        assert( cell.row >= 0 && cell.row < this.gridSize.height, 'row out of bounds: ' + cell.row );
        assert( cell.column >= 0 && cell.column < this.gridSize.width, 'column out of bounds: ' + cell.column );
      }
    },

    // @private
    cellToString: function( cell ) {
      assert && this.assertValidCell( cell );
      return StringUtils.fillIn( '[{{row}},{{column}}]', cell );
    },

    /**
     * Synchronize Item locations with their respective cell locations.
     * @private
     */
    updateItemLocations: function() {
      for ( var row = 0; row < this.gridSize.height; row++ ) {
        for ( var column = 0; column < this.gridSize.width; column++ ) {
          var cell = { row: row, column: column };
          if ( !this.isEmptyCell( cell ) ) {
            var item = this.cells[ row ][ cell.column ];
            item.moveTo( this.getCellLocation( cell ) );
          }
        }
      }
    }
  } );
} );
