// Copyright 2017, University of Colorado Boulder

/**
 * Plate where items are placed to be weighed on a balance scale.
 * (The correct term is 'weighing platform', but 'plate' was used throughout the design.)
 * Items are arranged in a 2D grid of cells, where each cell can be occupied by at most one item.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Grid = require( 'EQUALITY_EXPLORER/common/model/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {AbstractItemCreator[]} itemCreators - creators associated with item on this plate
   * @param {Object} [options]
   * @constructor
   */
  function Plate( itemCreators, options ) {

    var self = this;

    options = _.extend( {
      supportHeight: 10, // height of the vertical support that connects the plate to the scale
      diameter: 20, // diameter of the plate
      gridRows: 1, // rows in the 2D grid
      gridColumns: 1, // columns in the 2D grid
      cellSize: new Dimension2( 5, 5 ) // dimensions of each cell in the grid
    }, options );

    // @public
    this.locationProperty = new Property( new Vector2( 0, 0 ) );

    // @public (read-only)
    this.itemCreators = itemCreators;

    // @public (read-only)
    this.supportHeight = options.supportHeight;
    this.diameter = options.diameter;
    this.gridRows = options.gridRows;
    this.gridColumns = options.gridColumns;
    this.cellSize = options.cellSize;

    // @private
    this.grid = new Grid( this.locationProperty, {
      rows: options.gridRows,
      columns: options.gridColumns,
      cellWidth: options.cellSize.width,
      cellHeight: options.cellSize.height
    } );

    // {Property[]} dependencies for deriving weightProperty
    var weightDependencies = [];
    itemCreators.forEach( function( itemCreator ) {
      weightDependencies.push( itemCreator.numberOfItemsOnScaleProperty );
      if ( itemCreator.weightProperty ) {
        weightDependencies.push( itemCreator.weightProperty );
      }
    } );

    // @public {DerivedProperty.<number>} total weight of the items that are on the plate
    this.weightProperty = new DerivedProperty( weightDependencies, function() {
      var weight = 0;
      itemCreators.forEach( function( itemCreator ) {
        weight += ( itemCreator.numberOfItemsOnScaleProperty.value * itemCreator.weight );
      } );
      return weight;
    } );

    // @public emit is called when the contents of the grid changes (items added, removed, organized)
    this.contentsChangedEmitter = new Emitter();

    // associate this plate with its item creators
    itemCreators.forEach( function( itemCreator ) {
      assert && assert( !itemCreator.plate, 'item creator already has an associated plate' );
      itemCreator.plate = self;
    } );
  }

  equalityExplorer.register( 'Plate', Plate );

  return inherit( Object, Plate, {

    /**
     * Adds an item to the plate, in a specific cell in the grid.
     * @param {AbstractItem} item
     * @param {number} cellIndex
     * @public
     */
    addItem: function( item, cellIndex ) {
      this.grid.putItem( item, cellIndex );
      this.contentsChangedEmitter.emit();
    },

    /**
     * Removes an item from the plate. Items above the removed item move down.
     * @param {AbstractItem} item
     * @public
     */
    removeItem: function( item ) {
      this.grid.removeItem( item );
      this.contentsChangedEmitter.emit();
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
     * Gets the closest empty cell to a specified location.
     * @param {Vector2} location
     * @returns {number} cell index, -1 if the grid is full
     * @public
     */
    getClosestEmptyCell: function( location ) {
      return this.grid.getClosestEmptyCell( location );
    },

    /**
     * Examines the grid from left to right, top to bottom, and returns the first empty cell.
     * @returns {number} cell index, -1 if the grid is full
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
    getLocationForCell: function( cellIndex ) {
      return this.grid.getLocationForCell( cellIndex );
    },

    /**
     * Gets the item at a specified location in the grid.
     * @param {Vector2} location
     * @returns {AbstractItem|null} null if location is outside the grid, or the cell at location is empty
     * @public
     */
    getItemAtLocation: function( location ) {
      return this.grid.getItemAtLocation( location );
    },

    /**
     * Gets the index for the cell that an item occupies.
     * @param {AbstractItem} item
     * @returns {number} the cell's index, -1 if the item doesn't occupy a cell
     * @pubic
     */
    getCellForItem: function( item ) {
      return this.grid.getCellForItem( item );
    },

    /**
     * Gets the number of Cells in the grid. This is the capacity of the plate.
     * @returns {number}
     * @public
     */
    get numberOfCells() {
      return this.grid.numberOfCells;
    },

    /**
     * Organizes items on the plate, as specified in https://github.com/phetsims/equality-explorer/issues/4
     * @public
     */
    organize: function() {

      var numberOfItemsToOrganize = 0;
      this.itemCreators.forEach( function( itemCreator ) {
        numberOfItemsToOrganize += itemCreator.numberOfItemsOnScaleProperty.value;
      } );

      if ( numberOfItemsToOrganize > 0 ) {

        var grid = this.grid;

        grid.clearAllCells();

        // start with the bottom-left cell
        var row = grid.rows - 1;
        var column = 0;

        this.itemCreators.forEach( function( itemCreator ) {

          var items = itemCreator.getItemsOnScale(); // {AbstractItem[]}

          if ( items.length > 0 ) {

            // stack the items in columns, from left to right
            for ( var i = 0; i < items.length; i++ ) {

              var item = items[ i ];
              var cellIndex = grid.rowColumnToIndex( row, column );
              grid.putItem( item, cellIndex );

              numberOfItemsToOrganize--;

              // advance to the next cell
              if ( i < items.length - 1 ) {
                if ( row > 0 ) {

                  // next cell in the current column
                  row--;
                }
                else {

                  // start a new column
                  row = grid.rows - 1;
                  column++;
                }
              }
            }

            if ( numberOfItemsToOrganize > 0 ) {

              // Start a new column if we have enough cells to the right of the current column.
              // Otherwise continue to fill the current column.
              var numberOfCellsToRight = ( grid.columns - column - 1 ) * grid.rows;
              if ( numberOfCellsToRight >= numberOfItemsToOrganize ) {
                row = grid.rows - 1;
                column++;
              }
              else {
                row--;
              }
            }
          }
        } );
        assert && assert( numberOfItemsToOrganize === 0 );

        // Center the stacks on the plate by shifting items to the right.
        var numberOfEmptyColumns = grid.columns - column - 1;
        var gridColumnsToShiftRight = Math.floor( numberOfEmptyColumns / 2 );
        if ( gridColumnsToShiftRight > 0 ) {
          for ( row = grid.rows - 1; row >= 0; row-- ) {
            for ( column = grid.columns - 1; column >= 0; column-- ) {
              var cellIndex = grid.rowColumnToIndex( row, column );
              var item = grid.getItemForCell( cellIndex );
              if ( item ) {

                // move item 1 column to the right
                grid.clearCell( cellIndex );
                var rightIndex = grid.rowColumnToIndex( row, column + gridColumnsToShiftRight );
                grid.putItem( item, rightIndex );
              }
            }
          }
        }

        this.contentsChangedEmitter.emit();
      }
    }
  } );
} );
