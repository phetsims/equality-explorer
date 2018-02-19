// Copyright 2017-2018, University of Colorado Boulder

/**
 * Plate where terms are placed to be weighed on a balance scale.
 * (The correct term is 'weighing platform', but 'plate' was used throughout the design.)
 * Terms are arranged in a 2D grid of cells, where each cell can be occupied by at most one term.
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
   * @param {TermCreator[]} termCreators - creators associated with term on this plate
   * @param {Object} [options]
   * @constructor
   */
  function Plate( termCreators, options ) {

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
    this.termCreators = termCreators;

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
    termCreators.forEach( function( termCreator ) {
      weightDependencies.push( termCreator.numberOfTermsOnScaleProperty );
      if ( termCreator.weightProperty ) {
        weightDependencies.push( termCreator.weightProperty );
      }
    } );

    // @public {DerivedProperty.<number>} total weight of the terms that are on the plate
    this.weightProperty = new DerivedProperty( weightDependencies, function() {
      var weight = 0;
      termCreators.forEach( function( termCreator ) {
        weight += ( termCreator.numberOfTermsOnScaleProperty.value * termCreator.weight );
      } );
      return weight;
    } );

    // @public emit is called when the contents of the grid changes (terms added, removed, organized)
    this.contentsChangedEmitter = new Emitter();

    // associate this plate with its term creators
    termCreators.forEach( function( termCreator ) {
      assert && assert( !termCreator.plate, 'term creator already has an associated plate' );
      termCreator.plate = self;
    } );
  }

  equalityExplorer.register( 'Plate', Plate );

  return inherit( Object, Plate, {

    /**
     * Adds a term to the plate, in a specific cell in the grid.
     * @param {Term} term
     * @param {number} cellIndex
     * @public
     */
    addTerm: function( term, cellIndex ) {
      this.grid.putTerm( term, cellIndex );
      this.contentsChangedEmitter.emit();
    },

    /**
     * Removes a term from the plate. Terms above the removed term move down.
     * @param {Term} term
     * @public
     */
    removeTerm: function( term ) {
      this.grid.removeTerm( term );
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
     * Gets the term at a specified location in the grid.
     * @param {Vector2} location
     * @returns {Term|null} null if location is outside the grid, or the cell at location is empty
     * @public
     */
    getTermAtLocation: function( location ) {
      return this.grid.getTermAtLocation( location );
    },

    /**
     * Gets the index for the cell that a term occupies.
     * @param {Term} term
     * @returns {number} the cell's index, -1 if the term doesn't occupy a cell
     * @public
     */
    getCellForTerm: function( term ) {
      return this.grid.getCellForTerm( term );
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
     * Organizes terms on the plate, as specified in https://github.com/phetsims/equality-explorer/issues/4
     * @public
     */
    organize: function() {

      var numberOfTermsToOrganize = 0;
      this.termCreators.forEach( function( termCreator ) {
        numberOfTermsToOrganize += termCreator.numberOfTermsOnScaleProperty.value;
      } );

      if ( numberOfTermsToOrganize > 0 ) {

        var grid = this.grid;

        grid.clearAllCells();

        // start with the bottom-left cell
        var row = grid.rows - 1;
        var column = 0;

        this.termCreators.forEach( function( termCreator ) {

          var terms = termCreator.getTermsOnScale(); // {Term[]}

          if ( terms.length > 0 ) {

            // stack the terms in columns, from left to right
            for ( var i = 0; i < terms.length; i++ ) {

              var term = terms[ i ];
              var cellIndex = grid.rowColumnToIndex( row, column );
              grid.putTerm( term, cellIndex );

              numberOfTermsToOrganize--;

              // advance to the next cell
              if ( i < terms.length - 1 ) {
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

            if ( numberOfTermsToOrganize > 0 ) {

              // Start a new column if we have enough cells to the right of the current column.
              // Otherwise continue to fill the current column.
              var numberOfCellsToRight = ( grid.columns - column - 1 ) * grid.rows;
              if ( numberOfCellsToRight >= numberOfTermsToOrganize ) {
                row = grid.rows - 1;
                column++;
              }
              else {
                row--;
              }
            }
          }
        } );
        assert && assert( numberOfTermsToOrganize === 0 );

        // Center the stacks on the plate by shifting terms to the right.
        var numberOfEmptyColumns = grid.columns - column - 1;
        var gridColumnsToShiftRight = Math.floor( numberOfEmptyColumns / 2 );
        if ( gridColumnsToShiftRight > 0 ) {
          for ( row = grid.rows - 1; row >= 0; row-- ) {
            for ( column = grid.columns - 1; column >= 0; column-- ) {
              var cellIndex = grid.rowColumnToIndex( row, column );
              var term = grid.getTermForCell( cellIndex );
              if ( term ) {

                // move term 1 column to the right
                grid.clearCell( cellIndex );
                var rightIndex = grid.rowColumnToIndex( row, column + gridColumnsToShiftRight );
                grid.putTerm( term, rightIndex );
              }
            }
          }
        }

        this.contentsChangedEmitter.emit();
      }
    }
  } );
} );
