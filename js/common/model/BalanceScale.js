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
  var inherit = require( 'PHET_CORE/inherit' );
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
      platformYOffset: 50, // offset of the platform from the beam
      platformDiameter: 300, // diameter of the weighing platforms
      platformGridSize: new Dimension2( 6, 6 ) // dimensions for the grid of items on each weighing platform
    }, options );

    assert && assert( options.beamWidth - ( 2 * options.platformXInset ) > options.platformDiameter,
      'platforms will overlap' );

    // @public (read-only)
    this.location = options.location;

    // @public (read-only)
    this.beamWidth = options.beamWidth;
    this.platformXInset = options.platformXInset;
    this.platformYOffset = options.platformYOffset;
    this.platformGridSize = options.platformGridSize;

    // lengthProperty for each ObservableArray.<Item>
    var lengthProperties = [];
    leftItemCreators.forEach( function( itemCreator ) {
      lengthProperties.push( itemCreator.items.lengthProperty );
    } );
    rightItemCreators.forEach( function( itemCreator ) {
      lengthProperties.push( itemCreator.items.lengthProperty );
    } );

    var numberOfCells = this.platformGridSize.width * this.platformGridSize.height;

    //TODO support dynamic weight for changing value of x
    var maxItemWeight = 0;
    leftItemCreators.forEach( function( itemCreator ) {
      maxItemWeight = Math.max( maxItemWeight, itemCreator.weightProperty.value );
    } );
    rightItemCreators.forEach( function( itemCreator ) {
      maxItemWeight = Math.max( maxItemWeight, itemCreator.weightProperty.value );
    } );
    var maxWeight = maxItemWeight * numberOfCells;

    // @public (read-only) {DerivedProperty.<number>} angle of the scale in radians, zero is balanced
    this.angleProperty = new DerivedProperty( lengthProperties, function() {

      // sum of lengthProperties <= number of cells
      assert && assert( _.reduce( lengthProperties,
          function( numberOfItems, lengthProperty ) {
            return numberOfItems + lengthProperty.value;
          }, 0 ) <= numberOfCells, 'more items than cells' );

      var totalWeight = 0;
      leftItemCreators.forEach( function( itemCreator ) {
        totalWeight -= itemCreator.total; // subtract
      } );
      rightItemCreators.forEach( function( itemCreator ) {
        totalWeight += itemCreator.total; // add
      } );

      var scaleAngle = ( totalWeight / maxWeight ) * MAX_SCALE_ANGLE;
      assert && assert( Math.abs( scaleAngle ) <= MAX_SCALE_ANGLE, 'scaleAngle out of range: ' + scaleAngle );

      return scaleAngle;
    } );

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
          console.log( 'dx=' + dx + ' dy=' + dy );//XXX
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

    // @public (read-only)
    this.leftPlatform = new WeighingPlatform( leftLocationProperty, options.platformDiameter, options.platformGridSize );
    this.rightPlatform = new WeighingPlatform( rightLocationProperty, options.platformDiameter, options.platformGridSize );
  }

  equalityExplorer.register( 'BalanceScale', BalanceScale );

  return inherit( Object, BalanceScale );
} );
