// Copyright 2017-2019, University of Colorado Boulder

/**
 * Plate where terms are placed to be weighed on a balance scale.
 * (The correct term is 'weighing platform', but 'plate' was used throughout the design.)
 * Terms are arranged in a 2D grid of cells, where each cell can be occupied by at most one term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Emitter = require( 'AXON/Emitter' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const Grid = require( 'EQUALITY_EXPLORER/common/model/Grid' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  // constants
  const DEFAULT_CELL_SIZE = new Dimension2( 5, 5 );
  const VALID_DEBUG_SIDE_VALUES = [ 'left', 'right' ];

  /**
   * @param {TermCreator[]} termCreators - creators associated with term on this plate
   * @param {string} debugSide - which side of the scale, for debugging, see VALID_DEBUG_SIDE_VALUES
   * @param {Object} [options]
   * @constructor
   */
  function Plate( termCreators, debugSide, options ) {

    assert && assert( _.includes( VALID_DEBUG_SIDE_VALUES, debugSide, 'invalid debugSide: ' + debugSide ) );

    const self = this;

    options = merge( {
      supportHeight: 10, // height of the vertical support that connects the plate to the scale
      diameter: 20, // diameter of the plate
      gridRows: 1, // rows in the 2D grid
      gridColumns: 1, // columns in the 2D grid
      cellSize: DEFAULT_CELL_SIZE // {Dimension2} dimensions of each cell in the grid
    }, options );

    // @public
    this.locationProperty = new Vector2Property( new Vector2( 0, 0 ) );

    // @public (read-only)
    this.termCreators = termCreators;
    this.debugSide = debugSide;

    // @public (read-only)
    this.supportHeight = options.supportHeight;
    this.diameter = options.diameter;
    this.gridRows = options.gridRows;
    this.gridColumns = options.gridColumns;
    this.cellSize = options.cellSize;

    // @private
    this.grid = new Grid( this.locationProperty, debugSide, {
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
    const weightDependencies = [];
    for ( let i = 0; i < termCreators.length; i++ ) {
      weightDependencies.push( termCreators[ i ].weightOnPlateProperty );
    }

    // @public (read-only) {Property.<Fraction>} total weight of the terms that are on the plate
    // dispose not required.
    this.weightProperty = new DerivedProperty( weightDependencies,
      function() {
        let weight = Fraction.fromInteger( 0 );
        for ( let i = 0; i < termCreators.length; i++ ) {
          weight = weight.plus( termCreators[ i ].weightOnPlateProperty.value ).reduced();
        }
        return weight;
      } );

    // @public emit is called when the contents of the grid changes (terms added, removed, organized)
    // dispose not required.
    this.contentsChangedEmitter = new Emitter();

    // Associate this plate with its term creators. Note that this is a 2-way association.
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
     * @returns {number} the cell that the term was removed from
     * @public
     */
    removeTerm: function( term ) {
      const cell = this.grid.removeTerm( term );
      this.numberOfTermsProperty.value--;
      this.contentsChangedEmitter.emit();
      return cell;
    },

    /**
     * Is the plate's grid full? That is, are all cells occupied?
     * @public
     */
    isFull: function() {
      return this.grid.isFull();
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
     * Gets the empty cell that would be the best fit for adding a term to the plate.
     * @param {Vector2} location
     * @returns {number|null} the cell's identifier, null if the grid is full
     * @public
     */
    getBestEmptyCell: function( location ) {
      return this.grid.getBestEmptyCell( location );
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
     * Gets the y coordinate of the top of the grid.
     * @returns {number}
     * @public
     */
    getGridTop: function() {
      return this.grid.top;
    },

    /**
     * Gets an equivalent term from the grid that is closest to a specified cell.
     * @param {Term} term
     * @param {number} cell
     * @returns {Term|null} - null if no equivalent term is found
     * @public
     */
    getClosestEquivalentTerm: function( term, cell ) {
      return this.grid.getClosestEquivalentTerm( term, cell );
    },

    /**
     * Organizes terms on the plate, as specified in https://github.com/phetsims/equality-explorer/issues/4
     * @public
     */
    organize: function() {

      let numberOfTermsToOrganize = this.numberOfTermsProperty.value;

      if ( numberOfTermsToOrganize > 0 ) {

        const grid = this.grid;

        grid.clearAllCells();

        // start with the bottom-left cell
        let row = grid.rows - 1;
        let column = 0;

        // Group the terms by positive and negative
        const termGroups = []; // {Term[][]}
        this.termCreators.forEach( function( termCreator ) {
          termGroups.push( termCreator.getPositiveTermsOnPlate() );
          termGroups.push( termCreator.getNegativeTermsOnPlate() );
        } );

        termGroups.forEach( function( terms ) {

          if ( terms.length > 0 ) {

            // stack the terms in columns, from left to right
            for ( let i = 0; i < terms.length; i++ ) {

              const term = terms[ i ];
              const cell = grid.rowColumnToCell( row, column );
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
              const numberOfCellsToRight = ( grid.columns - column - 1 ) * grid.rows;
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
        const numberOfEmptyColumns = grid.columns - column - 1;
        const gridColumnsToShiftRight = Math.floor( numberOfEmptyColumns / 2 );
        if ( gridColumnsToShiftRight > 0 ) {
          for ( row = grid.rows - 1; row >= 0; row-- ) {
            for ( column = grid.columns - 1; column >= 0; column-- ) {
              const cell = grid.rowColumnToCell( row, column );
              const term = grid.getTermInCell( cell );
              if ( term ) {

                // move term 1 column to the right
                grid.clearCell( cell );
                const rightCell = grid.rowColumnToCell( row, column + gridColumnsToShiftRight );
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
        ).length === 0, // contains no elements that are different
          'set of terms is not the same after organize' );

        this.contentsChangedEmitter.emit();
      }
    }
  } );
} );
