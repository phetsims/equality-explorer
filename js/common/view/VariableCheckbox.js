// Copyright 2017-2018, University of Colorado Boulder

/**
 * Checkbox used to show/hide the value of the variable in the Snapshots accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Checkbox = require( 'SUN/Checkbox' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var questionMarkString = require( 'string!EQUALITY_EXPLORER/questionMark' );

  // constants
  var FONT_SIZE = 24;

  /**
   * @param {string} symbol
   * @param {BooleanProperty} variableVisibleProperty - whether the variable is visible
   * @param {Object} [options]
   * @constructor
   */
  function VariableCheckbox( symbol, variableVisibleProperty, options ) {

    // the variable's symbol, in math font
    var symbolNode = new Text( symbol, {
      font: new MathSymbolFont( FONT_SIZE )
    } );

    // '= ?' in normal font
    var rightNode = new Text( ' ' + MathSymbols.EQUAL_TO + ' ' + questionMarkString, {
      font: new PhetFont( FONT_SIZE )
    } );

    var contentNode = new HBox( {
      children: [ symbolNode, rightNode ], // x = ?
      maxWidth: 100
    } );

    Checkbox.call( this, contentNode, variableVisibleProperty, options );
  }

  equalityExplorer.register( 'VariableCheckbox', VariableCheckbox );

  return inherit( Checkbox, VariableCheckbox );
} );