// Copyright 2018, University of Colorado Boulder

/**
 * Displays a universal operation, as created by the universal operation control.
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

  /**
   * @param {UniversalOperation} operation
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationNode( operation, options ) {

    options = _.extend( {
      font: new PhetFont( 24 ),

      // supertype options
      spacing: 3
    }, options );

    assert && assert( !options.children, 'children is set by this Node' );
    options.children = [
      new Text( operation.operator, { font: options.font } ),
      new Text( operation.operand, { font: options.font } )
    ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'UniversalOperationNode', UniversalOperationNode );

  return inherit( HBox, UniversalOperationNode );
} );
 