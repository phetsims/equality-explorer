// Copyright 2017-2020, University of Colorado Boulder

/**
 * Model of a balance scale.
 * Consists of 2 plates that sit on either ends of a beam.
 * The center of the beam is balanced on a fulcrum.
 * Origin is at the point where the beam is balanced on the fulcrum.
 * Terms are arranged in a 2D grid on each plate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import equalityExplorer from '../../equalityExplorer.js';
import Plate from './Plate.js';

/**
 * @param {TermCreator[]} leftTermCreators - creators for terms on left plate
 * @param {TermCreator[]} rightTermCreators - creators for term on right plate
 * @param {Object} [options]
 * @constructor
 */
function BalanceScale( leftTermCreators, rightTermCreators, options ) {

  options = merge( {

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

  }, options );

  assert && assert( options.beamWidth - ( 2 * options.plateXInset ) > options.plateDiameter, 'plates will overlap' );

  // @public (read-only)
  this.position = options.position;

  // @public (read-only)
  this.beamWidth = options.beamWidth;
  this.maxAngle = options.maxAngle;

  // @private
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

  // @public (read-only)
  this.leftPlate = new Plate( leftTermCreators, 'left', plateOptions );
  this.rightPlate = new Plate( rightTermCreators, 'right', plateOptions );

  // @public {DerivedProperty.<number>} angle of the scale in radians, zero is balanced
  // dispose not required.
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
      assert && assert( Math.abs( angle ) <= options.maxAngle, 'angle out of range: ' + angle );
      return angle;
    }, {
      isValidValue: value => ( typeof value === 'number' )
    } );

  // Move the plates when the angle changes. unlink not required.
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

  // @public {DerivedProperty.<number>} total number of terms on the scale
  // dispose not required.
  this.numberOfTermsProperty = new DerivedProperty(
    [ this.leftPlate.numberOfTermsProperty, this.rightPlate.numberOfTermsProperty ],
    ( leftNumberOfTerms, rightNumberOfTerms ) => ( leftNumberOfTerms + rightNumberOfTerms ), {
      isValidValue: value => Utils.isInteger( value )
    } );
}

equalityExplorer.register( 'BalanceScale', BalanceScale );

export default inherit( Object, BalanceScale, {

  /**
   * Organizes terms on the scale, grouping like terms together.
   * @public
   */
  organize: function() {
    this.leftPlate.organize();
    this.rightPlate.organize();
  },

  /**
   * Clears the scale, by disposing of all terms that are on the scale.
   * @public
   */
  clear: function() {
    const termCreators = this.leftTermCreators.concat( this.rightTermCreators );
    termCreators.forEach( termCreator => termCreator.disposeTermsOnPlate() );
  }
} );