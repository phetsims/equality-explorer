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
      gridSize: new Dimension2( 1, 1 ),
      cellSize: new Dimension2( 5, 5 )
    }, options );

    var backgroundWidth = options.gridSize.width * options.cellSize.width;
    var backgroundHeight = options.gridSize.height * options.cellSize.height;

    // @private This background is displayed when the user is manually rearranging Items on the platform
    this.backgroundNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, {
      fill: 'rgba( 255, 255, 255, 0.5 )',
      visible: false
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ this.backgroundNode ];

    // draw the grid
    if ( EqualityExplorerQueryParameters.showGrid ) {

      var cellWidth = options.cellSize.width;
      var cellHeight = options.cellSize.height;
      var gridWidth =  options.gridSize.width * cellWidth;
      var gridHeight = options.gridSize.height * cellHeight;

      // border
      var gridShape = new Shape().rect( 0, 0, this.backgroundNode.width, this.backgroundNode.height );

      // horizontal lines
      for ( var row = 1; row < options.gridSize.height; row++ ) {
        gridShape.moveTo( 0, row * cellHeight ).lineTo( gridWidth, row * cellHeight );
      }

      // vertical lines
      for ( var column = 1; column < options.gridSize.width; column++ ) {
        gridShape.moveTo( column * cellWidth, 0 ).lineTo( column * cellWidth, gridHeight );
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
