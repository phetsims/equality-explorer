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
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {DerivedProperty} locationProperty
   * @param {ItemCreator[]} itemCreators
   * @param {Object} [options]
   * @constructor
   */
  function WeighingPlatform( locationProperty, itemCreators, options ) {

    var self = this;

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
      itemCreator.weighingPlatform = self;
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

    // @private {Item[][]} null indicates an empty cell
    this.cells = [];
    for ( var row = 0; row < this.gridSize.height; row++ ) {
      var rowOfCells = [];
      for ( var column = 0; column < this.gridSize.width; column++ ) {
        rowOfCells.push( null );
      }
      this.cells.push( rowOfCells );
    }
  }

  equalityExplorer.register( 'WeighingPlatform', WeighingPlatform );

  return inherit( Object, WeighingPlatform, {

    /**
     * Adds an Item to a specific cell in the grid.
     * @param {Item} item
     * @param {row:number, column:number} cell
     * @public
     */
    addItem: function( item, cell ) {
      assert && assert( this.cells[ cell.row ][ cell.column ] === null,
        'cell is occupied: row=' + cell.row + ' column=' + cell.column );
      assert && assert( !this.containsItem( item ),
        'Item is already in grid: ' + item.toString() );
      this.cells[ cell.row ][ cell.column ] = item;
    },

    /**
     * Removes an Item from the grid.
     * @param {Item} item
     * @public
     */
    removeItem: function( item ) {
      var removed = false;
      for ( var row = 0; row < this.gridSize.height && !removed; row++ ) {
        for ( var column = 0; column < this.gridSize.width && !removed; column++ ) {
          if ( this.cells[ row ][ column ] === item ) {
            this.cells[ row ][ column ] = null;
            removed = true;
          }
        }
      }
      assert && assert( removed, 'Item was not removed: ' + item.toString() );
    },

    /**
     * Is the specific cell empty?
     * @param {row:number, column:number} cell
     * @returns {boolean}
     */
    isEmptyCell: function( cell ) {
      return ( this.cells[ cell.row ][ cell.column ] === null );
    },

    /**
     * Does the grid contain the specified Item?
     * @param {Item} item
     * @returns {boolean}
     * @public
     */
    containsItem: function( item ) {
      var found = false;
      for ( var row = 0; row < this.gridSize.height && !found; row++ ) {
        for ( var column = 0; column < this.gridSize.width && !found; column++ ) {
          found = ( this.cells[ row ][ column ] === item );
        }
      }
      return found;
    },

    /**
     * Gets the closest empty cell to a specified location.
     * @param {Vector2} location
     * @returns {row:number, column:number}
     */
    getClosestEmptyCell: function( location ) {

      //TODO find closest, fill from bottom up for now
      var cell = null;
      for ( var row = this.gridSize.height - 1; row >= 0 && !cell; row--) {
        for ( var column = 0; column < this.gridSize.width && !cell; column++ ) {
          if ( this.cells[ row ][ column ] === null ) {
            cell = { row: row, column: column };
          }
        }
      }
      return cell;
    },

    /**
     * Gets the location of a specific cell.
     * @param {row:number, column:number} cell
     * @returns {Vector2}
     * @public
     */
    getCellLocation: function( cell ) {
      assert && assert( ( typeof cell.row === 'number' ) && ( typeof cell.column === 'number' ) );
      var upperLeft = this.getGridUpperLeft();
      var x = upperLeft.x + ( cell.column * this.cellSize.width ) + ( 0.5 * this.cellSize.width );
      var y = upperLeft.y + ( cell.row * this.cellSize.height ) + ( 0.5 * this.cellSize.height );
      return new Vector2( x, y );
    },

    /**
     * Gets the location of the upper-left corner of the grid, in global coordinates.
     * @returns {Vector2}
     * @private
     */
    getGridUpperLeft: function() {
      var x = this.locationProperty.value.x - ( this.gridSize.width * this.cellSize.width ) / 2;
      var y = this.locationProperty.value.y - ( this.gridSize.height * this.cellSize.height );
      return new Vector2( x, y );
    }
  } );
} );
