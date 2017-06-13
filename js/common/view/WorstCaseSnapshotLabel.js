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
  var TERM_SPACING = 1; // space between coefficient and icon in each term
  var OPERATOR_SPACING = 4; // spacing between terms and operators
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
      spacing: OPERATOR_SPACING
    }, options );

    // terms on one side of the equations
    var termsNode = new HBox( {
      spacing: OPERATOR_SPACING,
      children: [
        createTermNode( 10, new ShadedSphereNode( ITEM_DIAMETER, {
          mainColor: 'green',
          maxHeight: maxIconHeight
        } ) ),
        new Text( '+', TEXT_OPTIONS ),
        createTermNode( 10, new ShadedSphereNode( ITEM_DIAMETER, {
          mainColor: 'orange',
          maxHeight: maxIconHeight
        } ) ),
        new Text( '+', TEXT_OPTIONS ),
        createTermNode( 10, new ShadedSphereNode( ITEM_DIAMETER, {
          mainColor: 'magenta',
          maxHeight: maxIconHeight
        } ) )
      ]
    } );

    var equalsNode = new Text( '=', TEXT_OPTIONS );

    assert && assert( !options.children );
    options.children = [
      new Node( { children: [ termsNode ] } ),
      equalsNode,
      new Node( { children: [ termsNode ] } )
    ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'WorstCaseSnapshotLabel', WorstCaseSnapshotLabel );

  function createTermNode( coefficient, icon ) {
    return new HBox( {
      spacing: TERM_SPACING,
      children: [ new Text( '' + coefficient, TEXT_OPTIONS ), icon ]
    } );
  }

  return inherit( HBox, WorstCaseSnapshotLabel );
} );
