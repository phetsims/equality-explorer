// Copyright 2017, University of Colorado Boulder

/**
 * Items are placed in this 2D grid on a weighing platform.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ItemGridNode( options ) {

    options = _.extend( {
      rows: 1,
      columns: 1,
      cellSize: new Dimension2( 5, 5 )
    }, options );

    var gridWidth =  options.columns * options.cellSize.width;
    var gridHeight = options.rows * options.cellSize.height;

    // @private displayed when the user is manually rearranging Items on the platform
    this.backgroundNode = new Rectangle( 0, 0, gridWidth, gridHeight, {
      fill: 'rgba( 255, 255, 255, 0.5 )',
      visible: false
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ this.backgroundNode ];

    // draw the grid
    if ( EqualityExplorerQueryParameters.showGrid ) {

      // border
      var gridShape = new Shape().rect( 0, 0, this.backgroundNode.width, this.backgroundNode.height );

      // horizontal lines
      for ( var row = 1; row < options.rows; row++ ) {
        gridShape.moveTo( 0, row * options.cellSize.height ).lineTo( gridWidth, row * options.cellSize.height );
      }

      // vertical lines
      for ( var column = 1; column < options.columns; column++ ) {
        gridShape.moveTo( column * options.cellSize.width, 0 ).lineTo( column * options.cellSize.width, gridHeight );
      }

      var gridNode = new Path( gridShape, {
        center: this.backgroundNode.center,
        stroke: 'rgb( 160, 160, 160 )',
        lineWidth: 0.25
      } );
      options.children.push( gridNode );
    }

    Node.call( this, options );
  }

  equalityExplorer.register( 'ItemGridNode', ItemGridNode );

  return inherit( Node, ItemGridNode, {

    /**
     * Controls visibility of the grid's background.
     * When items are being rearranged on the scale, the background is made visible.
     * 
     * @param {boolean} visible
     */
    setBackgroundVisible: function( visible ) {
      this.backgroundNode.visible = visible;
    }
  } );
} );
