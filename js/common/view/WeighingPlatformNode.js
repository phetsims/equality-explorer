// Copyright 2017, University of Colorado Boulder

/**
 * A weighing platform on the balance scale.
 * Includes a plate and a vertical support that attaches it to the balance beam.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var GridNode = require( 'EQUALITY_EXPLORER/common/view/GridNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var SUPPORT_FILL = 'rgb( 204, 204, 204 )';
  var SUPPORT_STROKE = 'black';

  /**
   * @param {WeighingPlatform} weighingPlatform
   * @param {Object} [options]
   * @constructor
   */
  function WeighingPlatformNode( weighingPlatform, options ) {

    options = _.extend( {
      color: '#666666', // {Color|string} color of the outside of the plate
      pivotRadius: 8  // {number} radius of the pivot point that attaches to the balance beam
    }, options );

    // The main body of the plate.
    // Path description (d= field) from assets/scale/plate.svg
    var plateString = 'M245.633,70.359c-1.15,1.836-1.764,1.672-7.195,3.125c-20.375,5.45-68.705,9-137.838,9c-65.326,0-110.102-2.84-131.033-7.493c-7.123-1.584-9.441-1.76-11.35-4.132c-1.295-1.611-11.043-3.625-8.484-8.625c2.043-3.994,79.203-6.75,150.867-6.75c72.723,0,147.553,1.775,150.016,5.75C254.025,66.734,246.588,68.836,245.633,70.359';
    var plateNode = new Path( plateString, {
      fill: options.color,
      stroke: 'black',
      lineWidth: 1
    } );

    // The inside bottom, surface that things would sit on.
    // Path description (d= field) from assets/scale/inside.svg
    var insideString = 'M243.527,69.984c0,2.25-64.234,8.75-143,8.75c-78.764,0-142.25-5.988-142.25-9.25c0-5.25,63.836-10.462,142.602-10.462S243.527,64.484,243.527,69.984';
    var insideNode = new Path( insideString, {
      fill: '#E4E4E4',
      centerX: plateNode.centerX,
      top: plateNode.top
    } );

    // The inside wall of the plate.
    // Path description (d= field) from assets/scale/rim.svg
    var wallString = 'M251.869,68.484c0,7.364-67.6,13.333-150.99,13.333c-83.389,0-150.988-5.969-150.988-13.333c0-7.363,67.6-13.333,150.988-13.333C184.27,55.151,251.869,61.121,251.869,68.484';
    var wallNode = new Path( wallString, {
      fill: '#B1B1B1',
      centerX: plateNode.centerX,
      bottom: insideNode.bottom
    } );

    // Rim around the top of the plate, colored the same as the body of the plate.
    var rimNode = new Path( wallString, {
      stroke: options.color,
      center: wallNode.center
    } );

    // Put all of the parts of the platform together
    var platformNode = new Node( {
      children: [ plateNode, wallNode, insideNode, rimNode ],
      centerX: 0,
      centerY: 0
    } );
    platformNode.setScaleMagnitude( weighingPlatform.diameter / platformNode.width, 1 );
    assert && assert( platformNode.width === weighingPlatform.diameter );

    // rod on the bottom of that platform that attaches to pivot
    var rodNode = new Rectangle( 0, 0, 10, weighingPlatform.supportHeight - options.pivotRadius, {
      fill: SUPPORT_FILL,
      stroke: SUPPORT_STROKE
    } );

    // Pivot point that connects to the balance beam
    var pivotNode = new Circle( options.pivotRadius, {
      fill: SUPPORT_FILL,
      stroke: SUPPORT_STROKE,
      centerX: rodNode.centerX,
      centerY: rodNode.bottom
    } );

    // Put all of the parts of the support together
    var supportNode = new Node( {
      children: [ rodNode, pivotNode ],
      centerX: platformNode.centerX,
      top: platformNode.centerY
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ supportNode, platformNode ];

    // Grid where Items appear
    if ( EqualityExplorerQueryParameters.showGrid ) {
      options.children.push( new GridNode( {
        rows: weighingPlatform.gridRows,
        columns: weighingPlatform.gridColumns,
        cellSize: weighingPlatform.cellSize,
        centerX: 0,
        bottom: 0
      } ) );
    }

    // Red dot at the origin
    if ( EqualityExplorerQueryParameters.showOrigin ) {
      options.children.push( new Circle( 4, { fill: 'red' } ) );
    }

    Node.call( this, options );

    // @private
    this.plateNode = plateNode;
    this.rimNode = rimNode;
  }

  equalityExplorer.register( 'WeighingPlatformNode', WeighingPlatformNode );

  return inherit( Node, WeighingPlatformNode, {

    /**
     * Sets the platform's color.
     * @param {Color|string} color
     */
    setColor: function( color ) {
      this.plateNode.fill = color;
      this.rimNode.stroke = color;
    },
    set color( value ) { this.setColor( value ); }
  } );
} );
