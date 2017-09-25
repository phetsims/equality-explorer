// Copyright 2017, University of Colorado Boulder

/**
 * Model of a balance scale.
 * Consists of 2 plates that sit on either ends of a beam.
 * The center of the beam is balanced on a fulcrum.
 * Origin is at the point where the beam is balanced on the fulcrum.
 * Items are arranged in a 2D (xy) grid on each plate.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Plate = require( 'EQUALITY_EXPLORER/common/model/Plate' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var MAX_SCALE_ANGLE = EqualityExplorerQueryParameters.maxScaleAngle * Math.PI / 180;  // degrees to radians

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function BalanceScale( leftItemCreators, rightItemCreators, options ) {

    var self = this;

    options = _.extend( {
      location: new Vector2( 0, 0 ), // location of the point where the beam balances on the fulcrum
      beamWidth: 450, // width of the balance beam

      // height of vertical support that connects plate to beam
      plateSupportHeight: EqualityExplorerQueryParameters.plateSupportHeight,
      plateDiameter: 300, // diameter of the plates
      plateXInset: 45, // inset of the plates from the ends of the beam

      // options related to the plate's 2D grid
      gridRows: EqualityExplorerQueryParameters.gridSize[ 0 ], // {number} rows in the grid
      gridColumns: EqualityExplorerQueryParameters.gridSize[ 1 ], // {number} columns in grid
      gridXMargin: 2, // horizontal space between stacks of Items
      gridYMargin: 0  // vertical space between Items in each stack

    }, options );

    assert && assert( options.beamWidth - ( 2 * options.plateXInset ) > options.plateDiameter, 'plates will overlap' );

    // @public (read-only)
    this.location = options.location;

    // @public (read-only)
    this.beamWidth = options.beamWidth;

    // @private
    this.leftItemCreators = leftItemCreators;
    this.rightItemCreators = rightItemCreators;

    // {ItemCreator[]} all ItemCreator instances
    var itemCreators = leftItemCreators.concat( rightItemCreators );

    //TODO replace this with options.maxItemWeightProperty and options.cellSize
    var maxItemWeight = 0;
    var maxCellWidth = 0;
    var maxCellHeight = 0;
    itemCreators.forEach( function( itemCreator ) {

      maxItemWeight = Math.max( maxItemWeight, itemCreator.weightProperty.value );

      maxCellWidth = Math.max( maxCellWidth, itemCreator.icon.width );
      maxCellHeight = Math.max( maxCellHeight, itemCreator.icon.height );
    } );

    //TODO support dynamic weight for changing value of x
    // maximum weight that a plate can hold
    var maxItems = options.gridRows * options.gridColumns;
    var maxWeight = maxItemWeight * maxItems;

    var cellWidth = maxCellWidth + ( 2 * options.gridXMargin );
    var cellHeight = maxCellHeight + ( 2 * options.gridYMargin );

    // @public (read-only) size of each cell in the grid
    this.cellSize = new Dimension2( cellWidth, cellHeight );

    assert && assert( options.gridColumns * this.cellSize.width <= options.plateDiameter, 'grid is wider than plate' );

    // @public (read-only) {Property.<number>} angle of the scale in radians, zero is balanced
    this.angleProperty = new Property( 0 );

    // {DerivedProperty.<number>} location of the right plate
    var rightLocationProperty = new DerivedProperty( [ this.angleProperty ],
      function( angle ) {
        var absXInset = Math.abs( options.plateXInset );
        if ( angle === 0 ) {
          return new Vector2( self.location.x + ( self.beamWidth / 2 ) - absXInset,
            self.location.y - options.plateSupportHeight );
        }
        else {
          var hypotenuse = ( self.beamWidth / 2 ) - absXInset;
          var dx = Math.cos( angle ) * hypotenuse;
          var dy = Math.sin( angle ) * hypotenuse;
          return new Vector2( self.location.x + dx, self.location.y + dy - options.plateSupportHeight );
        }
      }
    );

    // {DerivedProperty.<number>} location of the left plate
    var leftLocationProperty = new DerivedProperty( [ rightLocationProperty ],
      function( rightLocation ) {
        var dx = rightLocation.x - self.location.x;
        var dy = ( rightLocation.y + options.plateSupportHeight ) - self.location.y;
        return new Vector2( self.location.x - dx, self.location.y - dy - options.plateSupportHeight );
      }
    );

    // options that apply to both plates
    var plateOptions = {
      supportHeight: options.plateSupportHeight,
      diameter: options.plateDiameter,
      gridRows: options.gridRows,
      gridColumns: options.gridColumns,
      cellSize: this.cellSize
    };

    // @public (read-only)
    this.leftPlate = new Plate( leftLocationProperty, leftItemCreators, plateOptions );
    this.rightPlate = new Plate( rightLocationProperty, rightItemCreators, plateOptions );

    //TODO angleProperty should be derived, but leftLocationProperty and rightLocationProperty depend on it
    // unlink is unnecessary
    Property.multilink( [ this.leftPlate.weightProperty, this.rightPlate.weightProperty ],
      function( leftWeight, rightWeight ) {
        var angle = ( ( rightWeight - leftWeight ) / maxWeight ) * MAX_SCALE_ANGLE;
        assert && assert( Math.abs( angle ) <= MAX_SCALE_ANGLE, 'angle out of range: ' + angle );
        self.angleProperty.value = angle;
      } );
  }

  equalityExplorer.register( 'BalanceScale', BalanceScale );

  return inherit( Object, BalanceScale, {

    /**
     * Organizes Items on the scale, grouping like items together.
     * @public
     */
    organize: function() {
      this.leftPlate.organize();
      this.rightPlate.organize();
    },

    /**
     * Disposes of all Items that are on the scale.
     * @public
     */
    disposeAllItems: function() {
      this.leftItemCreators.forEach( function( itemCreator ) {
        itemCreator.disposeItemsOnScale();
      } );
      this.rightItemCreators.forEach( function( itemCreator ) {
        itemCreator.disposeItemsOnScale();
      } );
    }
  } );
} );
