// Copyright 2017, University of Colorado Boulder

/**
 * Platform where items are placed to be weighed on a balance scale.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {DerivedProperty} locationProperty
   * @param {ItemCreator[]} itemCreators
   * @param {Object} [options]
   * @constructor
   */
  function WeighingPlatform( locationProperty, itemCreators, options ) {

    options = _.extend( {
      supportHeight: 10,
      diameter: 20,
      gridSize: new Dimension2( 1, 1 ),
      cellSize: new Dimension2( 5, 5 )
    }, options );

    // @public (read-only)
    this.locationProperty = locationProperty;
    this.supportHeight = options.supportHeight;
    this.diameter = options.diameter;
    this.gridSize = options.gridSize;
    this.cellSize = options.cellSize;

    var maxItems = this.gridSize.width * this.gridSize.height;
    var lengthProperties = [];
    itemCreators.forEach( function( itemCreator ) {
      lengthProperties.push( itemCreator.items.lengthProperty );
    } );

    // Disable all ItemCreators if the platform is full, unmultilink unnecessary
    Property.multilink( lengthProperties, function() {
      var totalItems = 0;
      for ( var i = 0; i < lengthProperties.length; i++ ) {
        totalItems += lengthProperties[ i ].value;
      }
      for ( i = 0; i < itemCreators.length; i++ ) {
        itemCreators[ i ].enabledProperty.value = ( totalItems < maxItems );
      }
    } );
  }

  equalityExplorer.register( 'WeighingPlatform', WeighingPlatform );

  return inherit( Object, WeighingPlatform );
} );
