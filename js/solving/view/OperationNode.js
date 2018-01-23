// Copyright 2018, University of Colorado Boulder

/**
 * An operation, as created by the universal operation control.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} operator
   * @param {number} operand
   * @param {Object} [options]
   * @constructor
   */
  function OperationNode( operator, operand, options ) {

    assert && assert( typeof operator === 'string', 'invalid operator: ' + operator );
    assert && assert( typeof operand === 'number' && Util.isInteger( operand ), 'invalid operand: ' + operand );

    options = _.extend( {
      font: new PhetFont( 24 ),
      spacing: 3
    }, options );

    var operatorNode = new Text( operator, { font: options.font } );

    var operandNode = new Text( operand, { font: options.font } );

    assert && assert( !options.children, 'subtype sets its own children' );
    options.children = [ operatorNode, operandNode ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'OperationNode', OperationNode );

  return inherit( HBox, OperationNode );
} );
 