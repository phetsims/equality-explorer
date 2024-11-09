// Copyright 2017-2024, University of Colorado Boulder

/**
 * 2D grid on a plate on the balance scale.
 *
 * A grid contains terms. The grid is filled from the bottom up, so that there are no empty cells
 * below an occupied cell. Origin is at the bottom center of the grid.
 *
 * A cell in the grid is identified by an integer index. This index acts as an opaque identifier for the cell.
 * The client doesn't need to know how to interpret this identifier. It gets a cell identifier from the grid,
 * and uses the identifier to refer to the cell. Using an integer index has a couple of advantages: fast lookup
 * of terms in the grid, and low memory footprint. The main disadvantage is the need to map between (row,column)
 * and index, but that need is totally internal to Grid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import equalityExplorer from '../../equalityExplorer.js';
import { BalanceScaleSide } from './BalanceScale.js';
import Term from './Term.js';

// constants
const NO_TERM = null; // occupies all empty cells in the grid

type SelfOptions = {
  rows?: number;
  columns?: number;
  cellWidth?: number;
  cellHeight?: number;
};

type GridOptions = SelfOptions;

export default class Grid {

  public readonly rows: number;
  public readonly columns: number;

  private readonly positionProperty: TReadOnlyProperty<Vector2>;
  private readonly debugSide: BalanceScaleSide;
  private readonly cellWidth: number;
  private readonly cellHeight: number;
  private readonly cells: ( Term | null )[]; // see documentation below
  private bounds: Bounds2;

  /**
   * @param positionProperty
   * @param debugSide - which side of the scale, for debugging
   * @param [providedOptions]
   */
  public constructor( positionProperty: TReadOnlyProperty<Vector2>, debugSide: BalanceScaleSide, providedOptions?: GridOptions ) {

    const options = optionize<GridOptions, SelfOptions>()( {

      // SelfOptions
      rows: 10,
      columns: 10,
      cellWidth: 5,
      cellHeight: 5
    }, providedOptions );

    this.rows = options.rows;
    this.columns = options.columns;
    this.cellWidth = options.cellWidth;
    this.cellHeight = options.cellHeight;
    this.positionProperty = positionProperty;
    this.debugSide = debugSide;

    // The 2D grid is stored as a 1D array, in row-major order (left-to-right, top-to-bottom).
    // Each entry in this array is a cell in the grid.  Empty cells contain NO_TERM.
    // Storing as a 1D array makes it easy for snapshots to save/restore the position of terms in the grid.
    // See rowColumnToCell, cellToRow, cellToColumn for mapping between index and (row,column).
    this.cells = [];
    const numberOfCells = options.rows * options.columns;
    for ( let i = 0; i < numberOfCells; i++ ) {
      this.cells[ i ] = NO_TERM;
    }

    // bounds of the grid, initialized in positionProperty listener
    this.bounds = new Bounds2( 0, 1, 0, 1 );

    // When the grid moves ... unlink not required.
    this.positionProperty.link( position => {

      // recompute the grid's bounds, origin (x,y) is at bottom center
      this.bounds.setMinMax(
        position.x - ( this.columns * this.cellWidth / 2 ), // minX
        position.y - ( this.rows * this.cellHeight ), // minY
        position.x + ( this.columns * this.cellWidth / 2 ), // maxX
        position.y // maxY
      );

      // move the terms
      for ( let i = 0; i < this.cells.length; i++ ) {
        const cell = this.cells[ i ];
        if ( cell !== NO_TERM ) {
          cell.moveTo( this.getPositionOfCell( i ) );
        }
      }
    } );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  /**
   * Gets the y coordinate of the top of the grid.
   */
  public get top(): number {
    return this.positionProperty.value.y - ( this.rows * this.cellHeight );
  }

  /**
   * Is the grid full? That is, are all cells occupied?
   */
  public isFull(): boolean {
    return !this.cells.includes( NO_TERM );
  }

  /**
   * Is the specified cell empty?
   */
  public isEmptyCell( cell: number ): boolean {
    assert && assert( this.isValidCell( cell ), `invalid cell: ${cell}` );
    return ( this.getTermInCell( cell ) === NO_TERM );
  }

  /**
   * Clears the specified cell
   */
  public clearCell( cell: number ): void {
    assert && assert( this.isValidCell( cell ), `invalid v: ${cell}` );
    this.cells[ cell ] = NO_TERM;
  }

  /**
   * Clears all cells.
   */
  public clearAllCells(): void {
    for ( let i = 0; i < this.cells.length; i++ ) {
      this.clearCell( i );
    }
  }

  /**
   * Clears the specified column. Used by compactColumn.
   */
  private clearColumn( column: number ): void {
    assert && assert( column >= 0 && column < this.columns, `invalid column: ${column}` );
    for ( let row = 0; row < this.rows; row++ ) {
      this.clearCell( this.rowColumnToCell( row, column ) );
    }
  }

  /**
   * Gets the cell that corresponds to a position.
   * @param position
   * @returns the cell identifier, null if the position is outside the grid
   */
  private getCellAtPosition( position: Vector2 ): number | null {
    let cell = null;
    if ( this.containsPosition( position ) ) {

      // row and column of the cell that contains position
      // Math.min handles the case where position is exactly on bounds.maxX or maxY.
      // See https://github.com/phetsims/equality-explorer/issues/#39.
      const row = Math.min( this.rows - 1, Math.floor( ( position.y - this.bounds.minY ) / this.cellHeight ) );
      const column = Math.min( this.columns - 1, Math.floor( ( position.x - this.bounds.minX ) / this.cellWidth ) );

      cell = this.rowColumnToCell( row, column );
    }
    return cell;
  }

  /**
   * Is the specified position inside the grid?
   * This needs to be fast, since it's called during a drag cycle.
   */
  private containsPosition( position: Vector2 ): boolean {
    return this.bounds.containsPoint( position );
  }

  /**
   * Gets the cell that a term occupies.
   * @param term
   * @returns the cell's identifier, null if the term doesn't occupy a cell
   */
  public getCellForTerm( term: Term ): number | null {
    const index = this.cells.indexOf( term );
    return ( index === -1 ) ? null : index;
  }

  /**
   * Gets the term that occupies a specified cell.
   * @param cell
   * @returns null if the cell is empty
   */
  public getTermInCell( cell: number ): Term | null {
    assert && assert( this.isValidCell( cell ), `invalid cell: ${cell}` );
    return this.cells[ cell ];
  }

  /**
   * Gets the term at a specified position in the grid.
   * @param position
   * @returns null if position is outside the grid, or the cell at position is empty
   */
  public getTermAtPosition( position: Vector2 ): Term | null {
    let term = null;
    const cell = this.getCellAtPosition( position );
    if ( cell !== null ) {
      term = this.getTermInCell( cell );
    }
    return term;
  }

  /**
   * Gets an equivalent term from the grid that is closest to a specified cell.
   */
  public getClosestEquivalentTerm( term: Term, cell: number ): Term | null {
    assert && assert( this.isValidCell( cell ), `invalid cell: ${cell}` );

    const cellPosition = this.getPositionOfCell( cell );
    let equivalentTerm = null;
    let distance = null;

    // This is brute force, but straightforward, and not a performance issue because the number of cells is small.
    for ( let i = 0; i < this.cells.length; i++ ) {
      const currentTerm = this.cells[ i ];
      if ( ( currentTerm !== NO_TERM ) && ( term.isEquivalentTerm( currentTerm ) ) ) {
        const currentDistance = this.getPositionOfCell( i ).distance( cellPosition );
        if ( equivalentTerm === null || distance === null || currentDistance < distance ) {
          equivalentTerm = currentTerm;
          distance = currentDistance;
        }
      }
    }

    return equivalentTerm;
  }

  /**
   * Puts a term in the specified cell. The cell must be empty.
   */
  public putTerm( term: Term, cell: number ): void {
    assert && assert( this.isValidCell( cell ), `invalid cell: ${cell}` );
    assert && assert( this.isEmptyCell( cell ), `cell is occupied, cell: ${cell}` );
    this.cells[ cell ] = term;
    term.moveTo( this.getPositionOfCell( cell ) );
  }

  /**
   * Removes a term from the grid. Any terms above it move down to fill the empty cell.
   * @param term
   * @returns the cell that the term was removed from
   */
  public removeTerm( term: Term ): number {
    const cell = this.getCellForTerm( term )!;
    assert && assert( cell !== null, `term not found: ${term}` );
    this.clearCell( cell );
    this.compactColumn( this.cellToColumn( cell ) );
    return cell;
  }

  /**
   * Compacts a column so that it contains no empty cells below terms.
   * If the column contains no holes, then the grid in not modified.
   */
  private compactColumn( column: number ): void {
    assert && assert( column >= 0 && column < this.columns, `invalid column: ${column}` );

    let hasHoles = false; // does the column have one or more holes?
    const terms = []; // terms in the column

    let term; // the current term
    let cell; // the current cell identifier

    // Get all terms in the column, from top down
    for ( let row = 0; row < this.rows; row++ ) {
      cell = this.rowColumnToCell( row, column );
      term = this.getTermInCell( cell );
      if ( term ) {
        terms.push( term );
      }
      else if ( terms.length > 0 ) {
        hasHoles = true;
      }
    }

    // If the column has holes ...
    if ( hasHoles ) {

      phet.log && phet.log( `Grid: compacting holes identified in column ${column}` );

      // clear the column
      this.clearColumn( column );

      // Put terms back into the column, from bottom up.
      let row = this.rows - 1;
      for ( let i = terms.length - 1; i >= 0; i-- ) {
        term = terms[ i ];
        cell = this.rowColumnToCell( row--, column );
        this.cells[ cell ] = term;
        term.moveTo( this.getPositionOfCell( cell ) );
      }
    }
  }

  /**
   * Gets the position of a specific cell. A cell's position is in the center of the cell.
   */
  public getPositionOfCell( cell: number ): Vector2 {
    assert && assert( this.isValidCell( cell ), `invalid cell: ${cell}` );

    const row = this.cellToRow( cell );
    const column = this.cellToColumn( cell );

    const x = this.bounds.minX + ( column * this.cellWidth ) + ( 0.5 * this.cellWidth );
    const y = this.bounds.minY + ( row * this.cellHeight ) + ( 0.5 * this.cellHeight );
    return new Vector2( x, y );
  }

  /**
   * Finds the last empty cell in the array.
   * @returns the cell's identifier, null if the grid is full
   */
  private getLastEmptyCell(): number | null {
    const index = this.cells.lastIndexOf( NO_TERM );
    return ( index === -1 ) ? null : index;
  }

  /**
   * Gets the empty cell that would be the best fit for adding a term to the grid.
   * Start by identifying the closest empty cell.  If that cell is in a column with empty cells below it,
   * choose the empty cell that is closest to the bottom of the grid in that column.
   */
  public getBestEmptyCell( position: Vector2 ): number | null {

    // Start with the last empty cell in the array
    let closestCell = this.getLastEmptyCell();

    // Careful! closestCell is {number|null}, and might be 0
    // If the grid is not full...
    if ( closestCell !== null ) {

      let closestDistance = this.getPositionOfCell( closestCell ).distance( position );

      // Find the closest cell based on distance, working backwards from lastEmptyCell.
      // This is brute force, but straightforward, and not a performance issue because the number of cells is small.
      for ( let i = closestCell - 1; i >= 0; i-- ) {
        if ( this.isEmptyCell( i ) ) {
          const distance = this.getPositionOfCell( i ).distance( position );
          if ( distance < closestDistance ) {
            closestDistance = distance;
            closestCell = i;
          }
        }
      }

      // Now look below the closest cell to see if there are any empty cells in the same column.
      // This makes terms "fall" to the cell that is closest to the bottom of the grid.
      const closestRow = this.cellToRow( closestCell );
      const closestColumn = this.cellToColumn( closestCell );
      for ( let row = this.rows - 1; row > closestRow; row-- ) {
        const cellBelow = this.rowColumnToCell( row, closestColumn );
        if ( this.isEmptyCell( cellBelow ) ) {
          closestCell = cellBelow;
          break;
        }
      }
    }

    return closestCell;
  }

  /**
   * Is the specified cell identifier valid?
   */
  private isValidCell( cell: number ): boolean {
    return ( Number.isInteger( cell ) && cell >= 0 && cell < this.cells.length );
  }

  /**
   * Converts a cell identifier to a row number.
   */
  private cellToRow( cell: number ): number {
    assert && assert( this.isValidCell( cell ), `invalid cell: ${cell}` );
    const row = Math.ceil( ( cell + 1 ) / this.columns ) - 1;
    assert && assert( row >= 0 && row < this.rows );
    return row;
  }

  /**
   * Converts a cell identifier to a column number.
   */
  private cellToColumn( cell: number ): number {
    assert && assert( this.isValidCell( cell ), `invalid cell: ${cell}` );
    const column = cell % this.columns;
    assert && assert( column >= 0 && column < this.columns );
    return column;
  }

  /**
   * Converts row and column to a cell identifier.
   */
  public rowColumnToCell( row: number, column: number ): number {
    assert && assert( row >= 0 && row < this.rows, `row out of range: ${row}` );
    assert && assert( column >= 0 && column < this.columns, `column out of range: ${column}` );
    const cell = ( row * this.columns ) + column;
    assert && assert( this.isValidCell( cell ), `invalid cell: ${cell}` );
    return cell;
  }
}

equalityExplorer.register( 'Grid', Grid );