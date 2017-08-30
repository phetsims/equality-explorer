// Copyright 2017, University of Colorado Boulder

/**
 * Model of a balance scale.
 * Consists of 2 weighing platforms that sit on either ends of a beam.
 * The center of the beam is balanced on a fulcrum.
 * Items are arranged in a 2D (xy) grid on each weighing platform.
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
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var WeighingPlatform = require( 'EQUALITY_EXPLORER/common/model/WeighingPlatform' );

  // constants
  var MAX_SCALE_ANGLE = Math.PI / 15; // maximum rotation angle of the scale

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
      platformXInset: 45, // inset of the platforms from the ends of the beam
      platformYOffset: -50, // offset of the platform from the beam
      platformDiameter: 300, // diameter of the weighing platforms
      gridSize: EqualityExplorerQueryParameters.gridSize, // {Dimension2} dimensions for the grid of items on each weighing platform
      cellXMargin: 2,
      cellYMargin: 0
    }, options );

    assert && assert( options.beamWidth - ( 2 * options.platformXInset ) > options.platformDiameter,
      'platforms will overlap' );

    // @public (read-only)
    this.location = options.location;

    // @public (read-only)
    this.beamWidth = options.beamWidth;
    this.platformXInset = options.platformXInset;
    this.platformYOffset = options.platformYOffset;
    this.gridSize = options.gridSize;

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
    // maximum weight that a weighing platform can hold
    var maxItems = this.gridSize.width * this.gridSize.height;
    var maxWeight = maxItemWeight * maxItems;

    var cellWidth = maxCellWidth + ( 2 * options.cellXMargin );
    var cellHeight = maxCellHeight + ( 2 * options.cellYMargin );

    // @public (read-only) size of each cell in the grid
    this.cellSize = new Dimension2( cellWidth, cellHeight );

    assert && assert( this.gridSize.width * this.cellSize.width <= options.platformDiameter,
      'grid is wider than platform' );

    // @public (read-only) {Property.<number>} angle of the scale in radians, zero is balanced
    this.angleProperty = new Property( 0 );

    // {DerivedProperty.<number>} location of the right weighing platform
    var rightLocationProperty = new DerivedProperty( [ this.angleProperty ],
      function( angle ) {
        var absXInset = Math.abs( self.platformXInset );
        var absYOffset = Math.abs( self.platformYOffset );
        if ( angle === 0 ) {
          return new Vector2( self.location.x + ( self.beamWidth / 2 ) - absXInset, self.location.y - absYOffset );
        }
        else {
          var hypotenuse = ( self.beamWidth / 2 ) - absXInset;
          var dx = Math.cos( angle ) * hypotenuse;
          var dy = Math.sin( angle ) * hypotenuse;
          return new Vector2( self.location.x + dx, self.location.y + dy - absYOffset );
        }
      }
    );

    // {DerivedProperty.<number>} location of the left weighing platform
    var leftLocationProperty = new DerivedProperty( [ rightLocationProperty ],
      function( rightLocation ) {
        var absYOffset = Math.abs( self.platformYOffset );
        var dx = rightLocation.x - self.location.x;
        var dy = ( rightLocation.y + absYOffset ) - self.location.y;
        return new Vector2( self.location.x - dx, self.location.y - dy - absYOffset );
      }
    );

    // options that apply to both weighing platforms
    var platformOptions = {
      supportHeight: Math.abs( options.platformYOffset ),
      diameter: options.platformDiameter,
      gridSize: this.gridSize,
      cellSize: this.cellSize
    };

    // @public (read-only)
    this.leftPlatform = new WeighingPlatform( leftLocationProperty, platformOptions );
    this.rightPlatform = new WeighingPlatform( rightLocationProperty, platformOptions );

    //TODO angleProperty should be derived, but leftLocationProperty and rightLocationProperty depend on it
    Property.multilink( [ this.leftPlatform.weightProperty, this.rightPlatform.weightProperty ],
      function( leftWeight, rightWeight ) {
        var angle = ( ( rightWeight - leftWeight ) / maxWeight ) * MAX_SCALE_ANGLE;
        assert && assert( Math.abs( angle ) <= MAX_SCALE_ANGLE, 'angle out of range: ' + angle );
        self.angleProperty.value = angle;
      } );
  }

  equalityExplorer.register( 'BalanceScale', BalanceScale );

  return inherit( Object, BalanceScale, {

    /**
     * Organizes Items on the scale, as specified in #4
     * @public
     */
    organize: function() {
      this.leftPlatform.organize();
      this.rightPlatform.organize();
    },

    /**
     * Disposes of all Items that are on the scale.
     * @public
     */
    disposeAllItems: function() {
      this.leftPlatform.disposeAllItems();
      this.rightPlatform.disposeAllItems();
    }
  } );
} );
