// Copyright 2017-2018, University of Colorado Boulder

/**
 * Model of a balance scale.
 * Consists of 2 plates that sit on either ends of a beam.
 * The center of the beam is balanced on a fulcrum.
 * Origin is at the point where the beam is balanced on the fulcrum.
 * Terms are arranged in a 2D (xy) grid on each plate.
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
  var Plate = require( 'EQUALITY_EXPLORER/common/model/Plate' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {TermCreator[]} leftTermCreators - creators for terms on left plate
   * @param {TermCreator[]} rightTermCreators - creators for term on right plate
   * @param {Object} [options]
   * @constructor
   */
  function BalanceScale( leftTermCreators, rightTermCreators, options ) {

    var self = this;

    options = _.extend( {

      location: new Vector2( 0, 0 ), // location of the point where the beam balances on the fulcrum
      beamWidth: 450, // width of the balance beam
      maxAngle: 22 * ( Math.PI / 180 ), // degrees to radians
      maxWeight: 30, // weight at which a plate 'bottoms out'

      // height of vertical support that connects plate to beam
      plateSupportHeight: 70,
      plateDiameter: 300, // diameter of the plates
      plateXInset: 45, // inset of the plates from the ends of the beam

      // options related to the plate's 2D grid
      gridRows: 6, // {number} rows in the grid
      gridColumns: 6, // {number} columns in the grid
      gridXMargin: 2, // horizontal space between stacks of terms
      gridYMargin: 0,  // vertical space between terms in each stack
      iconSize: null // {Dimension2|null} size of icons, computed if null

    }, options );

    assert && assert( options.beamWidth - ( 2 * options.plateXInset ) > options.plateDiameter, 'plates will overlap' );

    // @public (read-only)
    this.location = options.location;

    // @public (read-only)
    this.beamWidth = options.beamWidth;
    this.maxAngle = options.maxAngle;

    // @private
    this.leftTermCreators = leftTermCreators;
    this.rightTermCreators = rightTermCreators;

    // {TermCreator[]} all TermCreator instances
    var termCreators = leftTermCreators.concat( rightTermCreators );

    // Compute the maximum width and height of all term icons
    if ( !options.iconSize ) {
      var maxIconWidth = 0;
      var maxIconHeight = 0;
      termCreators.forEach( function( termCreator ) {
        maxIconWidth = Math.max( maxIconWidth, termCreator.icon.width );
        maxIconHeight = Math.max( maxIconHeight, termCreator.icon.height );
      } );
      options.iconSize = new Dimension2( maxIconWidth, maxIconHeight );
    }

    // size of each cell in the grid
    var cellSize = new Dimension2(
      options.iconSize.width + ( 2 * options.gridXMargin ),
      options.iconSize.height + ( 2 * options.gridYMargin ) );
    assert && assert( options.gridColumns * cellSize.width <= options.plateDiameter, 'grid is wider than plate' );

    // options that apply to both plates
    var plateOptions = {
      supportHeight: options.plateSupportHeight,
      diameter: options.plateDiameter,
      gridRows: options.gridRows,
      gridColumns: options.gridColumns,
      cellSize: cellSize
    };

    // @public (read-only)
    this.leftPlate = new Plate( leftTermCreators, plateOptions );
    this.rightPlate = new Plate( rightTermCreators, plateOptions );

    // @public {DerivedProperty.<number>} angle of the scale in radians, zero is balanced
    // dispose not required.
    this.angleProperty = new DerivedProperty(
      [ this.leftPlate.weightProperty, this.rightPlate.weightProperty ],

      /**
       * @param {ReducedFraction} leftWeight
       * @param {ReducedFraction} rightWeight
       * @returns {number}
       */
      function( leftWeight, rightWeight ) {

        // compute the weight difference between the 2 plates
        var weightDelta = ( rightWeight.toDecimal() - leftWeight.toDecimal() );

        // constrain to maxWeight so the scale bottoms out
        if ( weightDelta > options.maxWeight ) {
          weightDelta = options.maxWeight;
        }
        else if ( weightDelta < -options.maxWeight ) {
          weightDelta = -options.maxWeight;
        }

        var angle = ( weightDelta / options.maxWeight ) * options.maxAngle;
        assert && assert( Math.abs( angle ) <= options.maxAngle, 'angle out of range: ' + angle );

        phet.log && phet.log( 'BalanceScale: angle=' + Util.toFixed( Util.toDegrees( angle ), 1 ) + '\u00B0' );
        return angle;
      }, {
        isValidValue: function( value ) {
          return typeof value === 'number';
        }
      } );

    // Move the plates when the angle changes.
    // unlink not required.
    this.angleProperty.link( function( angle ) {

      // hoist reusable vars
      var dx = 0;
      var dy = 0;

      // move the right plate
      var rightLocation = null;
      var absXInset = Math.abs( options.plateXInset );
      if ( angle === 0 ) {
        rightLocation = new Vector2( self.location.x + ( self.beamWidth / 2 ) - absXInset,
          self.location.y - options.plateSupportHeight );
      }
      else {
        var hypotenuse = ( self.beamWidth / 2 ) - absXInset;
        dx = Math.cos( angle ) * hypotenuse;
        dy = Math.sin( angle ) * hypotenuse;
        rightLocation = new Vector2( self.location.x + dx, self.location.y + dy - options.plateSupportHeight );
      }
      self.rightPlate.locationProperty.value = rightLocation;

      // move the left plate, relative to the right plate
      dx = rightLocation.x - self.location.x;
      dy = ( rightLocation.y + options.plateSupportHeight ) - self.location.y;
      self.leftPlate.locationProperty.value =
        new Vector2( self.location.x - dx, self.location.y - dy - options.plateSupportHeight );
    } );

    // @public {DerivedProperty.<number>} total number of terms on the scale (both plates)
    // dispose not required.
    this.numberOfTermsProperty = new DerivedProperty(
      [ this.leftPlate.numberOfTermsProperty, this.rightPlate.numberOfTermsProperty ],

      /**
       * @param {number} leftNumberOfTerms
       * @param {number} rightNumberOfTerms
       * @returns {number}
       */
      function( leftNumberOfTerms, rightNumberOfTerms ) {
        return leftNumberOfTerms + rightNumberOfTerms;
      }, {
        isValidValue: function( value ) {
          return Util.isInteger( value );
        }
      } );
  }

  equalityExplorer.register( 'BalanceScale', BalanceScale );

  return inherit( Object, BalanceScale, {

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
      this.leftTermCreators.forEach( function( termCreator ) {
        termCreator.disposeTermsOnScale();
      } );
      this.rightTermCreators.forEach( function( termCreator ) {
        termCreator.disposeTermsOnScale();
      } );
    }
  } );
} );
