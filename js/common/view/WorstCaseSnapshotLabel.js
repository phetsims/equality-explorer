// Copyright 2017, University of Colorado Boulder

/**
 * Demonstrates the "worst case" scenario for a snapshot label, with maximum number of terms and width.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var ITEM_DIAMETER = 2 * EqualityExplorerConstants.ITEM_RADIUS;
  var EQUATION_FONT = new PhetFont( 18 );
  var TEXT_OPTIONS = {
    font: EQUATION_FONT
  };

  /**
   * @param {Object} [options]
   * @constructor
   */
  function WorstCaseSnapshotLabel( options ) {

    var maxIconHeight = new Text( '20', TEXT_OPTIONS ).height;

    options = _.extend( {
      spacing: 5
    }, options );

    var termNode = new HBox( {
      spacing: 3,
      children: [
        new Text( '20', TEXT_OPTIONS ),
        new ShadedSphereNode( ITEM_DIAMETER, {
          mainColor: 'green',
          maxHeight: maxIconHeight
        } ),
        new Text( '+', TEXT_OPTIONS ),
        new Text( '20', TEXT_OPTIONS ),
        new ShadedSphereNode( ITEM_DIAMETER, {
          mainColor: 'orange',
          maxHeight: maxIconHeight
        } ),
        new Text( '+', TEXT_OPTIONS ),
        new Text( '20', TEXT_OPTIONS ),
        new ShadedSphereNode( ITEM_DIAMETER, {
          mainColor: 'magenta',
          maxHeight: maxIconHeight
        } )
      ]
    } );

    var equalsNode = new Text( '=', TEXT_OPTIONS );

    assert && assert( !options.children );
    options.children = [
      new Node( { children: [ termNode] } ),
      equalsNode,
      new Node( { children: [ termNode] } )
    ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'WorstCaseSnapshotLabel', WorstCaseSnapshotLabel );

  return inherit( HBox, WorstCaseSnapshotLabel );
} );
