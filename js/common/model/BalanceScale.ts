// Copyright 2017-2023, University of Colorado Boulder

/**
 * BalanceScale is the model of a balance scale.
 * It consists of 2 plates that sit on either ends of a beam.
 * The center of the beam is balanced on a fulcrum.
 * The origin is at the point where the beam is balanced on the fulcrum.
 * Terms are arranged in a 2D grid on each plate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import equalityExplorer from '../../equalityExplorer.js';
import Plate, { PlateOptions } from './Plate.js';
import TermCreator from './TermCreator.js';
import { RelationalOperator, RelationalOperatorValues } from './RelationalOperator.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';

type SelfOptions = {
  position?: Vector2; // position of the point where the beam balances on the fulcrum
  beamWidth?: number; // width of the balance beam
  maxAngle?: number; // max angle of the scale, in radians
  maxWeight?: number; // weight at which a plate 'bottoms out'

  plateSupportHeight?: number; // height of vertical support that connects plate to beam
  plateDiameter?: number; // diameter of the plates
  plateXInset?: number; // inset of the plates from the ends of the beam

  // options related to the plate's 2D grid
  gridRows?: number; // rows in the grid
  gridColumns?: number; // columns in the grid
  gridXMargin?: number; // horizontal space between stacks of terms
  gridYMargin?: number;  // vertical space between terms in each stack
  iconSize?: Dimension2 | null; // size of icons, computed if null
};

type BalanceScaleOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export type BalanceScaleSide = 'left' | 'right';

export default class BalanceScale {

  public readonly position: Vector2;
  public readonly beamWidth: number;
  public readonly maxAngle: number;
  public readonly leftPlate: Plate;
  public readonly rightPlate: Plate;

  // angle of the scale in radians, zero is balanced
  public readonly angleProperty: TReadOnlyProperty<number>;

  // relation operator for the equation that describes the state of the balance scale\
  // This is a PhET-iO-only Property, and is not used elsewhere in the sim.
  private readonly relationalOperatorProperty: TReadOnlyProperty<RelationalOperator>;

  // total number of terms on the scale
  public readonly numberOfTermsProperty: TReadOnlyProperty<number>;

  private readonly leftTermCreators: TermCreator[];
  private readonly rightTermCreators: TermCreator[];

  public constructor( leftTermCreators: TermCreator[], rightTermCreators: TermCreator[], providedOptions?: BalanceScaleOptions ) {

    const options = optionize<BalanceScaleOptions, SelfOptions>()( {

      position: Vector2.ZERO, // position of the point where the beam balances on the fulcrum
      beamWidth: 450, // width of the balance beam
      maxAngle: Utils.toRadians( 22 ), // max angle of the scale, in radians
      maxWeight: 30, // weight at which a plate 'bottoms out'

      plateSupportHeight: 70, // height of vertical support that connects plate to beam
      plateDiameter: 300, // diameter of the plates
      plateXInset: 45, // inset of the plates from the ends of the beam

      // options related to the plate's 2D grid
      gridRows: 6, // rows in the grid
      gridColumns: 6, // columns in the grid
      gridXMargin: 2, // horizontal space between stacks of terms
      gridYMargin: 0,  // vertical space between terms in each stack
      iconSize: null // {Dimension2|null} size of icons, computed if null

    }, providedOptions );

    assert && assert( options.beamWidth - ( 2 * options.plateXInset ) > options.plateDiameter, 'plates will overlap' );

    this.position = options.position;
    this.beamWidth = options.beamWidth;
    this.maxAngle = options.maxAngle;

    this.leftTermCreators = leftTermCreators;
    this.rightTermCreators = rightTermCreators;

    // {TermCreator[]} all TermCreator instances
    const termCreators = leftTermCreators.concat( rightTermCreators );

    // Compute the maximum width and height of all term icons
    if ( !options.iconSize ) {
      let maxIconWidth = 0;
      let maxIconHeight = 0;
      termCreators.forEach( termCreator => {
        maxIconWidth = Math.max( maxIconWidth, termCreator.createIcon().width );
        maxIconHeight = Math.max( maxIconHeight, termCreator.createIcon().height );
      } );
      options.iconSize = new Dimension2( maxIconWidth, maxIconHeight );
    }

    // size of each cell in the grid
    const cellSize = new Dimension2(
      options.iconSize.width + ( 2 * options.gridXMargin ),
      options.iconSize.height + ( 2 * options.gridYMargin ) );
    assert && assert( options.gridColumns * cellSize.width <= options.plateDiameter, 'grid is wider than plate' );

    // options that apply to both plates
    const plateOptions = {
      supportHeight: options.plateSupportHeight,
      diameter: options.plateDiameter,
      gridRows: options.gridRows,
      gridColumns: options.gridColumns,
      cellSize: cellSize
    };

    const platesTandem = options.tandem.createTandem( 'plates' );

    this.leftPlate = new Plate( leftTermCreators, 'left', combineOptions<PlateOptions>( {
      tandem: platesTandem.createTandem( 'leftPlate' )
    }, plateOptions ) );
    this.rightPlate = new Plate( rightTermCreators, 'right', combineOptions<PlateOptions>( {
      tandem: platesTandem.createTandem( 'rightPlate' )
    }, plateOptions ) );

    this.angleProperty = new DerivedProperty(
      [ this.leftPlate.weightProperty, this.rightPlate.weightProperty ],
      ( leftWeight, rightWeight ) => {

        // compute the weight difference between the 2 plates
        let weightDelta = rightWeight.minus( leftWeight ).getValue();

        // constrain to maxWeight so the scale bottoms out
        if ( weightDelta > options.maxWeight ) {
          weightDelta = options.maxWeight;
        }
        else if ( weightDelta < -options.maxWeight ) {
          weightDelta = -options.maxWeight;
        }

        const angle = ( weightDelta / options.maxWeight ) * options.maxAngle;
        assert && assert( Math.abs( angle ) <= options.maxAngle, `angle out of range: ${angle}` );
        return angle;
      }, {
        isValidValue: value => ( typeof value === 'number' ),
        tandem: options.tandem.createTandem( 'angleProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'Angle of the scale in radians, zero is balanced'
      } );

    // Move the plates when the angle changes.
    this.angleProperty.link( angle => {

      // hoist reusable vars
      let dx = 0;
      let dy = 0;

      // move the right plate
      let rightPosition = null;
      const absXInset = Math.abs( options.plateXInset );
      if ( angle === 0 ) {
        rightPosition = new Vector2( this.position.x + ( this.beamWidth / 2 ) - absXInset,
          this.position.y - options.plateSupportHeight );
      }
      else {
        const hypotenuse = ( this.beamWidth / 2 ) - absXInset;
        dx = Math.cos( angle ) * hypotenuse;
        dy = Math.sin( angle ) * hypotenuse;
        rightPosition = new Vector2( this.position.x + dx, this.position.y + dy - options.plateSupportHeight );
      }
      this.rightPlate.positionProperty.value = rightPosition;

      // move the left plate, relative to the right plate
      dx = rightPosition.x - this.position.x;
      dy = ( rightPosition.y + options.plateSupportHeight ) - this.position.y;
      this.leftPlate.positionProperty.value =
        new Vector2( this.position.x - dx, this.position.y - dy - options.plateSupportHeight );
    } );

    // eslint-disable-next-line tandem-name-should-match
    this.relationalOperatorProperty = new DerivedStringProperty( [ this.angleProperty ],
      ( angle ): RelationalOperator => ( angle === 0 ) ? MathSymbols.EQUAL_TO :
                                       ( angle > 0 ) ? MathSymbols.GREATER_THAN :
                                       MathSymbols.LESS_THAN,
      {
        tandem: options.tandem.createTandem( 'relationalOperatorStringProperty' ),
        phetioFeatured: false,
        validValues: RelationalOperatorValues,
        phetioDocumentation: 'the relationship between the left and right sides of the balance scale'
      } );

    this.numberOfTermsProperty = new DerivedProperty(
      [ this.leftPlate.numberOfTermsProperty, this.rightPlate.numberOfTermsProperty ],
      ( leftNumberOfTerms, rightNumberOfTerms ) => ( leftNumberOfTerms + rightNumberOfTerms ), {
        isValidValue: value => Number.isInteger( value ),
        tandem: options.tandem.createTandem( 'numberOfTermsProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'Number of terms on the scale'
      } );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  /**
   * Organizes terms on the scale, grouping like terms together.
   */
  public organize(): void {
    this.leftPlate.organize();
    this.rightPlate.organize();
  }

  /**
   * Clears the scale, by disposing of all terms that are on the scale.
   */
  public clear(): void {
    const termCreators = this.leftTermCreators.concat( this.rightTermCreators );
    termCreators.forEach( termCreator => termCreator.disposeTermsOnPlate() );
  }
}

equalityExplorer.register( 'BalanceScale', BalanceScale );