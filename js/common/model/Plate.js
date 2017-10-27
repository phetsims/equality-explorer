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
  var Grid = require( 'EQUALITY_EXPLORER/common/model/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );

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

    // @private
    this.itemCreators = itemCreators;
    this.grid = new Grid( locationProperty, {
      rows: options.gridRows,
      columns: options.gridColumns,
      cellWidth: options.cellSize.width,
      cellHeight: options.cellSize.height
    } );

    // @public (read-only)
    this.supportHeight = options.supportHeight;
    this.diameter = options.diameter;

    //TODO delete these?
    this.gridRows = options.gridRows;
    this.gridColumns = options.gridColumns;
    this.cellSize = options.cellSize;

    // {Property[]} dependencies for deriving numberOfItemsOnPlateProperty
    var numberOfItemsOnPlateDependencies = [];
    itemCreators.forEach( function( itemCreator ) {
      numberOfItemsOnPlateDependencies.push( itemCreator.numberOfItemsOnScaleProperty );
    } );

    // @private total number of Items that are on the plate
    this.numberOfItemsOnPlateProperty = new DerivedProperty( numberOfItemsOnPlateDependencies, function() {
      var count = 0;
      itemCreators.forEach( function( itemCreator ) {
        count += itemCreator.numberOfItemsOnScaleProperty.value;
      } );
      return count;
    } );

    // {Property[]} dependencies for deriving weightProperty
    var weightDependencies = [ this.numberOfItemsOnPlateProperty ];
    itemCreators.forEach( function( itemCreator ) {
      weightDependencies.push( itemCreator.itemWeightProperty );
    } );

    // @public {Property.<number>} total weight of the Items that are on the plate
    this.weightProperty = new DerivedProperty( weightDependencies, function() {
      var weight = 0;
      itemCreators.forEach( function( itemCreator ) {
        weight += ( itemCreator.numberOfItemsOnScaleProperty.value * itemCreator.itemWeightProperty.value );
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

  return inherit( Object, Plate, {

    /**
     * Synchronizes Item locations with their respective cell locations.
     * @private
     */
    updateItemLocations: function() {
      for ( var row = 0; row < this.gridRows; row++ ) {
        for ( var column = 0; column < this.gridColumns; column++ ) {
          var index = this.grid.rowColumnToIndex( row, column );
          var item = this.grid.getItemForCell( index );
          item && item.moveTo( this.grid.getCellLocation( index ) );
        }
      }
    },

    /**
     * Adds an Item to the plate, in a specific cell in the grid.
     * @param {Item} item
     * @param {number} cellIndex
     * @public
     */
    addItem: function( item, cellIndex ) {
      this.grid.putItem( item, cellIndex );
      item.disposedEmitter.addListener( this.removeItemBound );
    },

    /**
     * Removes an Item from the plate. Items above the removed item move down.
     * @param {Item} item
     * @public
     */
    removeItem: function( item ) {
      var cellIndex = this.grid.getCellForItem( item );
      assert && assert( cellIndex !== -1, 'item not found: ' + item.toString() );
      item.disposedEmitter.removeListener( this.removeItemBound );
      this.grid.clearCell( cellIndex );
      this.grid.shiftDown( cellIndex );
    },

    /**
     * Organizes Items on the plate, as specified in https://github.com/phetsims/equality-explorer/issues/4
     * @public
     */
    organize: function() {

      var numberOfItemsToOrganize = this.numberOfItemsOnPlateProperty.value;

      if ( numberOfItemsToOrganize > 0 ) {

        var self = this;

        this.grid.clearAllCells();

        // start with the bottom-left cell
        var row = this.gridRows - 1;
        var column = 0;

        this.itemCreators.forEach( function( itemCreator ) {

          var items = itemCreator.getItemsOnScale();

          if ( items.length > 0 ) {

            // stack the Items in columns, from left to right
            for ( var i = 0; i < items.length; i++ ) {

              var item = items[ i ];
              var cellIndex = self.grid.rowColumnToIndex( row, column );
              self.grid.putItem( item, cellIndex );

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
              var cellIndex = this.grid.rowColumnToIndex( row, column );
              var item = this.grid.getItemForCell( cellIndex );
              if ( item ) {

                // move Item 1 column to the right
                this.grid.clearCell( cellIndex );
                var rightIndex = this.grid.rowColumnToIndex( row, column + gridColumnsToShiftRight );
                this.grid.putItem( item, rightIndex );
              }
            }
          }
        }
      }
    },

    /**
     * Is the specified cell empty?
     * @param {number} cellIndex
     * @returns {boolean}
     * @public
     */
    isEmptyCell: function( cellIndex ) {
      return this.grid.isEmptyCell( cellIndex );
    },

    /**
     * Does the grid contain the specified Item?
     * @param {Item} item
     * @returns {boolean}
     * @public
     */
    containsItem: function( item ) {
      return this.grid.containsItem( item );
    },

    /**
     * Gets the closest empty cell to a specified location.
     * @param {Vector2} location
     * @returns {number} -1 if the grid is full
     * @public
     */
    getClosestEmptyCell: function( location ) {
      return this.grid.getClosestEmptyCell( location );
    },

    /**
     * Examines the grid from left to right, top to bottom, and returns the first empty cell.
     * @returns {number} -1 if the grid is full
     * @public
     */
    getFirstEmptyCell: function() {
      return this.grid.getFirstEmptyCell();
    },

    /**
     * Gets the location of a specific cell, in global coordinates.
     * A cell's location is in the center of the cell.
     * @param {number} cellIndex
     * @returns {Vector2}
     * @public
     */
    getCellLocation: function( cellIndex ) {
      return this.grid.getCellLocation( cellIndex );
    },

    /**
     * Gets the number of Cells in the grid. This is the capacity of the plate.
     * @returns {number}
     * @public
     */
    get numberOfCells() {
      return this.grid.numberOfCells;
    }
  } );
} );
