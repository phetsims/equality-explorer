// Copyright 2017-2024, University of Colorado Boulder

/**
 * Plate where terms are placed to be weighed on a balance scale.
 * (The correct term is 'weighing platform', but 'plate' was used throughout the design.)
 * Terms are arranged in a 2D grid of cells, where each cell can be occupied by at most one term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import equalityExplorer from '../../equalityExplorer.js';
import { BalanceScaleSide } from './BalanceScale.js';
import Grid from './Grid.js';
import Term from './Term.js';
import TermCreator from './TermCreator.js';

// constants
const DEFAULT_CELL_SIZE = new Dimension2( 5, 5 );

type SelfOptions = {
  supportHeight?: number; // height of the vertical support that connects the plate to the scale
  diameter?: number; // diameter of the plate
  gridRows?: number; // rows in the 2D grid
  gridColumns?: number; // columns in the 2D grid
  cellSize?: Dimension2; // dimensions of each cell in the grid
};

export type PlateOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Plate extends PhetioObject {

  public readonly termCreators: TermCreator[];
  public readonly debugSide: BalanceScaleSide;
  public readonly supportHeight: number;
  public readonly diameter: number;
  public readonly gridRows: number;
  public readonly gridColumns: number;
  public readonly cellSize: Dimension2;

  public readonly positionProperty: Property<Vector2>; // position of the plate in the model coordinate frame
  public readonly numberOfTermsProperty: Property<number>; // number of terms on the plate
  public readonly weightProperty: TReadOnlyProperty<Fraction>; // total weight of the terms that are on the plate
  public readonly contentsChangedEmitter: Emitter; // emit is called when the contents of the grid changes (terms added, removed, organized)

  private readonly grid: Grid;

  /**
   * @param termCreators - creators associated with term on this plate
   * @param debugSide - which side of the scale, for debugging
   * @param [providedOptions]
   */
  public constructor( termCreators: TermCreator[], debugSide: BalanceScaleSide, providedOptions: PlateOptions ) {

    const options = optionize<PlateOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      supportHeight: 10,
      diameter: 20,
      gridRows: 1,
      gridColumns: 1,
      cellSize: DEFAULT_CELL_SIZE,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.termCreators = termCreators;
    this.debugSide = debugSide;
    this.supportHeight = options.supportHeight;
    this.diameter = options.diameter;
    this.gridRows = options.gridRows;
    this.gridColumns = options.gridColumns;
    this.cellSize = options.cellSize;

    // Does not need to be reset.
    this.positionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true // BalanceScale is responsible for setting positionProperty
    } );

    this.grid = new Grid( this.positionProperty, debugSide, {
      rows: options.gridRows,
      columns: options.gridColumns,
      cellWidth: options.cellSize.width,
      cellHeight: options.cellSize.height
    } );

    // Does not need to be reset.
    this.numberOfTermsProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, options.gridRows * options.gridColumns ),
      tandem: options.tandem.createTandem( 'numberOfTermsProperty' ),
      phetioDocumentation: 'Number of terms on the plate',
      phetioReadOnly: true // numberOfTermsProperty must be set by addTerm and removeTerm
    } );

    // weightProperty is derived from the weights of each termCreator
    const weightDependencies: TReadOnlyProperty<Fraction>[] = [];
    for ( let i = 0; i < termCreators.length; i++ ) {
      weightDependencies.push( termCreators[ i ].weightOnPlateProperty );
    }

    this.weightProperty = DerivedProperty.deriveAny( weightDependencies,
      () => {
        let weight = Fraction.fromInteger( 0 );
        for ( let i = 0; i < termCreators.length; i++ ) {
          weight = weight.plus( termCreators[ i ].weightOnPlateProperty.value ).reduced();
        }
        return weight;
      }, {
        tandem: options.tandem.createTandem( 'weightProperty' ),
        phetioValueType: Fraction.FractionIO,
        phetioDocumentation: 'Combined weight of the terms on the plate'
      } );

    this.contentsChangedEmitter = new Emitter();

    // Associate this plate with its term creators. Note that this is a 2-way association.
    termCreators.forEach( termCreator => {
      termCreator.plate = this;
    } );
  }

  /**
   * Adds a term to the plate, in a specific cell in the grid.
   */
  public addTerm( term: Term, cell: number ): void {
    this.grid.putTerm( term, cell );
    this.numberOfTermsProperty.value++;
    this.contentsChangedEmitter.emit();
  }

  /**
   * Removes a term from the plate. Returns the cell that the term was removed from.
   * @param term
   * @returns the cell that the term was removed from
   */
  public removeTerm( term: Term ): number {
    const cell = this.grid.removeTerm( term );
    this.numberOfTermsProperty.value--;
    this.contentsChangedEmitter.emit();
    return cell;
  }

  /**
   * Is the plate's grid full? That is, are all cells occupied?
   */
  public isFull(): boolean {
    return this.grid.isFull();
  }

  /**
   * Is the specified cell empty?
   */
  public isEmptyCell( cell: number ): boolean {
    return this.grid.isEmptyCell( cell );
  }

  /**
   * Gets the empty cell that would be the best fit for adding a term to the plate.
   * @param position
   * @returns the cell's identifier, null if the grid is full
   */
  public getBestEmptyCell( position: Vector2 ): number | null {
    return this.grid.getBestEmptyCell( position );
  }

  /**
   * Gets the position of a specific cell, in global coordinates.
   * A cell's position is in the center of the cell.
   */
  public getPositionOfCell( cell: number ): Vector2 {
    return this.grid.getPositionOfCell( cell );
  }

  /**
   * Gets the term at a specified position in the grid.
   * @param position
   * @returns null if position is outside the grid, or the cell at position is empty
   */
  public getTermAtPosition( position: Vector2 ): Term | null {
    return this.grid.getTermAtPosition( position );
  }

  /**
   * Gets the term in a specified cell.
   * @param cell
   * @returns null if the cell is empty
   */
  public getTermInCell( cell: number ): Term | null {
    return this.grid.getTermInCell( cell );
  }

  /**
   * Gets the cell that a term occupies.
   * @param term
   * @returns the cell's identifier, null if the term doesn't occupy a cell
   */
  public getCellForTerm( term: Term ): number | null {
    return this.grid.getCellForTerm( term );
  }

  /**
   * Gets the y coordinate of the top of the grid.
   */
  public getGridTop(): number {
    return this.grid.top;
  }

  /**
   * Gets an equivalent term from the grid that is closest to a specified cell.
   * @param term
   * @param cell
   * @returns null if no equivalent term is found
   */
  public getClosestEquivalentTerm( term: Term, cell: number ): Term | null {
    return this.grid.getClosestEquivalentTerm( term, cell );
  }

  /**
   * Organizes terms on the plate, as specified in https://github.com/phetsims/equality-explorer/issues/4
   */
  public organize(): void {

    let numberOfTermsToOrganize = this.numberOfTermsProperty.value;

    if ( numberOfTermsToOrganize > 0 ) {

      const grid = this.grid;

      grid.clearAllCells();

      // start with the bottom-left cell
      let row = grid.rows - 1;
      let column = 0;

      // Group the terms by positive and negative
      const termGroups: Term[][] = []; // {Term[][]}
      this.termCreators.forEach( termCreator => {
        termGroups.push( termCreator.getPositiveTermsOnPlate() );
        termGroups.push( termCreator.getNegativeTermsOnPlate() );
      } );

      termGroups.forEach( terms => {

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
            // Otherwise, continue to fill the current column.
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
        _.flatMap( this.termCreators, termCreator => termCreator.getTermsOnPlate() )
      ).length === 0, // contains no elements that are different
        'set of terms is not the same after organize' );

      this.contentsChangedEmitter.emit();
    }
  }
}

equalityExplorer.register( 'Plate', Plate );