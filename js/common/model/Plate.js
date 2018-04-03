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
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var Grid = require( 'EQUALITY_EXPLORER/common/model/Grid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DEFAULT_CELL_SIZE = new Dimension2( 5, 5 );

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
      cellSize: DEFAULT_CELL_SIZE // {Dimension2} dimensions of each cell in the grid
    }, options );

    // @public
    this.locationProperty = new Property( new Vector2( 0, 0 ), { valueType: Vector2 } );

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

    // @public (read-only) number of terms on the plate
    this.numberOfTermsProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: function( value ) {
        return value >= 0;
      }
    } );

    // weightProperty is derived from the weights of each termCreator
    var weightDependencies = [];
    for ( var i = 0; i < termCreators.length; i++ ) {
      weightDependencies.push( termCreators[ i ].weightOnPlateProperty );
    }

    // @public (read-only) {Property.<Fraction>} total weight of the terms that are on the plate
    // dispose not required.
    this.weightProperty = new DerivedProperty( weightDependencies,
      function() {
        var weight = Fraction.fromInteger( 0 );
        for ( var i = 0; i < termCreators.length; i++ ) {
          weight = weight.plus( termCreators[ i ].weightOnPlateProperty.value ).reduced();
        }
        return weight;
      } );

    // @public emit is called when the contents of the grid changes (terms added, removed, organized)
    // dispose not required.
    this.contentsChangedEmitter = new Emitter();

    // associate this plate with its term creators
    termCreators.forEach( function( termCreator ) {
      termCreator.plate = self;
    } );
  }

  equalityExplorer.register( 'Plate', Plate );

  return inherit( Object, Plate, {

    /**
     * Adds a term to the plate, in a specific cell in the grid.
     * @param {Term} term
     * @param {number} cell
     * @public
     */
    addTerm: function( term, cell ) {
      this.grid.putTerm( term, cell );
      this.numberOfTermsProperty.value++;
      this.contentsChangedEmitter.emit();
    },

    /**
     * Removes a term from the plate.
     * @param {Term} term
     * @public
     */
    removeTerm: function( term ) {
      this.grid.removeTerm( term );
      this.numberOfTermsProperty.value--;
      this.contentsChangedEmitter.emit();
    },

    /**
     * Is the specified cell empty?
     * @param {number} cell
     * @returns {boolean}
     * @public
     */
    isEmptyCell: function( cell ) {
      return this.grid.isEmptyCell( cell );
    },

    /**
     * Gets the closest empty cell to a specified location.
     * @param {Vector2} location
     * @returns {number|null} the cell's identifier, null if the grid is full
     * @public
     */
    getClosestEmptyCell: function( location ) {
      return this.grid.getClosestEmptyCell( location );
    },

    /**
     * Examines the grid from left to right, top to bottom, and returns the first empty cell.
     * @returns {number|null} the cell's identifier, null if the grid is full
     * @public
     */
    getFirstEmptyCell: function() {
      return this.grid.getFirstEmptyCell();
    },

    /**
     * Gets the location of a specific cell, in global coordinates.
     * A cell's location is in the center of the cell.
     * @param {number} cell
     * @returns {Vector2}
     * @public
     */
    getLocationOfCell: function( cell ) {
      return this.grid.getLocationOfCell( cell );
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
     * Gets the term in a specified cell.
     * @param {number} cell
     * @returns {Term|null} null if the cell is empty
     * @public
     */
    getTermInCell: function( cell ) {
      return this.grid.getTermInCell( cell );
    },

    /**
     * Gets the cell that a term occupies.
     * @param {Term} term
     * @returns {number|null} the cell's identifier, null if the term doesn't occupy a cell
     * @public
     */
    getCellForTerm: function( term ) {
      return this.grid.getCellForTerm( term );
    },

    /**
     * Organizes terms on the plate, as specified in https://github.com/phetsims/equality-explorer/issues/4
     * @public
     */
    organize: function() {

      var numberOfTermsToOrganize = this.numberOfTermsProperty.value;

      if ( numberOfTermsToOrganize > 0 ) {

        var grid = this.grid;

        grid.clearAllCells();

        // start with the bottom-left cell
        var row = grid.rows - 1;
        var column = 0;

        // Group the terms by positive and negative
        var termGroups = []; // {Term[][]}
        this.termCreators.forEach( function( termCreator ) {
          termGroups.push( termCreator.getPositiveTermsOnPlate() );
          termGroups.push( termCreator.getNegativeTermsOnPlate() );
        } );

        termGroups.forEach( function( terms ) {

          if ( terms.length > 0 ) {

            // stack the terms in columns, from left to right
            for ( var i = 0; i < terms.length; i++ ) {

              var term = terms[ i ];
              var cell = grid.rowColumnToCell( row, column );
              grid.putTerm( term, cell );

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

        // Center the stacks on the plate by shifting columns to the right.
        // If it's not possible to exactly center, the additional space will appear on the right.
        var numberOfEmptyColumns = grid.columns - column - 1;
        var gridColumnsToShiftRight = Math.floor( numberOfEmptyColumns / 2 );
        if ( gridColumnsToShiftRight > 0 ) {
          for ( row = grid.rows - 1; row >= 0; row-- ) {
            for ( column = grid.columns - 1; column >= 0; column-- ) {
              var cell = grid.rowColumnToCell( row, column );
              var term = grid.getTermInCell( cell );
              if ( term ) {

                // move term 1 column to the right
                grid.clearCell( cell );
                var rightCell = grid.rowColumnToCell( row, column + gridColumnsToShiftRight );
                grid.putTerm( term, rightCell );
              }
            }
          }
        }

        // Verify that the same terms are on the plate after organizing.
        assert && assert( _.xor(
          // terms on the plate before organize
          _.flatten( termGroups ),
          // terms on the plate after organize
          _.flatMap( this.termCreators, function( termCreator ) {
            return termCreator.getTermsOnPlate();
          } )
        ).length === 0, // contain no elements that are different
          'set of terms is not the same after organize' );

        this.contentsChangedEmitter.emit();
      }
    }
  } );
} );
