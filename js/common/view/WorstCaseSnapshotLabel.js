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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var TERM_SPACING = 1; // space between coefficient and icon in each term
  var OPERATOR_SPACING = 4; // spacing between terms and operators
  var TEXT_OPTIONS = { font: new PhetFont( 18 ) };
  var MAX_ICON_HEIGHT = new Text( '20', TEXT_OPTIONS ).height;

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function WorstCaseSnapshotLabel( leftItemCreators, rightItemCreators, options ) {

    options = _.extend( {
      spacing: OPERATOR_SPACING
    }, options );

    assert && assert( !options.children );
    options.children = [
      createSideNode( leftItemCreators ),
      new Text( '=', TEXT_OPTIONS ),
      createSideNode( rightItemCreators ) ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'WorstCaseSnapshotLabel', WorstCaseSnapshotLabel );

  /**
   * Creates one side of the equation
   * @param {ItemCreator[]} itemCreators
   * @returns {Node}
   */
  function createSideNode( itemCreators ) {
    var children = [];
    for ( var i = 0; i < itemCreators.length; i++ ) {
      children.push( createTermNode( 10, itemCreators[ i ].icon ) );
      if ( i < itemCreators.length - 1 ) {
        children.push( new Text( '+', TEXT_OPTIONS ) );
      }
    }
    return new HBox( {
      spacing: OPERATOR_SPACING,
      children: children
    } );
  }

  /**
   * Creates a term in the equation
   * @param {number} coefficient
   * @param {Node} icon
   * @returns {Node}
   */
  function createTermNode( coefficient, icon ) {
    return new HBox( {
      spacing: TERM_SPACING,
      children: [
        new Text( '' + coefficient, TEXT_OPTIONS ),
        new Node( {
          children: [ icon ],
          maxHeight: MAX_ICON_HEIGHT
        } )
      ]
    } );
  }

  return inherit( HBox, WorstCaseSnapshotLabel );
} );
