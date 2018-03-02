// Copyright 2017, University of Colorado Boulder

/**
 * Displays "({{symbol}} = {{value}})", e.g. "(x = 2)".  Used in Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} symbol - variable symbol, e.g. 'x'
   * @param {number} value - the value of variable
   * @param {Object} [options]
   * @constructor
   */
  function VariableValueNode( symbol, value, options ) {

    assert && assert( Util.isInteger( value ), 'value must be an integer: ' + value );

    options = _.extend( {
      fontSize: 28
    }, options );

    // '(' with normal font
    var leftSideNode = new Text( '(', {
      font: new PhetFont( options.fontSize )
    } );

    // the symbol, in math font
    var symbolNode = new Text( symbol, {
      font: new MathSymbolFont( options.fontSize )
    } );

    // ' = N' in normal font, i18n not required
    var rightSideString = StringUtils.fillIn( ' {{equals}} {{value}})', {
      equals: MathSymbols.EQUAL_TO,
      value: value
    } );
    var rightSideNode = new Text( rightSideString, {
      font: new PhetFont( options.fontSize )
    } );

    HBox.call( this, {
      children: [ leftSideNode, symbolNode, rightSideNode ], // (x = N)
      spacing: 0
    } );
  }

  equalityExplorer.register( 'VariableValueNode', VariableValueNode );

  return inherit( HBox, VariableValueNode );
} );