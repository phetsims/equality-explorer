// Copyright 2017, University of Colorado Boulder

/**
 * Displays "(x = {{value}})", e.g. "(x = 2)".  Used in Snapshots.
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {number} value - the value of variable 'x'
   * @constructor
   */
  function XValueNode( value ) {

    var leftSideNode = new Text( '(', { font: new PhetFont( 20 ) } );
    var xNode = new Text( xString, { font: new MathSymbolFont( 20 ) } );
    var rightSideNode = new Text( ' = ' + value + ')', { font: new PhetFont( 20 ) } );

    HBox.call( this, {
      children: [ leftSideNode, xNode, rightSideNode ],
      spacing: 0
    } );
  }

  equalityExplorer.register( 'XValueNode', XValueNode );

  return inherit( HBox, XValueNode );
} );