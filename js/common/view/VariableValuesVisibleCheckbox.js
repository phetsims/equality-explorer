// Copyright 2017-2018, University of Colorado Boulder

/**
 * Checkbox used to show/hide the values of variables in the Snapshots accordion box.
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
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  // strings
  var questionMarkString = require( 'string!EQUALITY_EXPLORER/questionMark' );

  // constants
  var FONT_SIZE = 24;

  /**
   * @param {Variable[]} variables - the variables
   * @param {BooleanProperty} variableValueVisibleProperty - whether the variable value is visible
   * @param {Object} [options]
   * @constructor
   */
  function VariableValuesVisibleCheckbox( variables, variableValueVisibleProperty, options ) {

    // Design decision: If there are multiple variables, use the first variable to label the checkbox.
    // This decision was based on the limited space we have for the checkbox in Snapshots accordion box.
    var variable = variables[ 0 ];

    // variable
    var variableNode = new VariableNode( variable, {
      iconScale: 0.45,
      fontSize: FONT_SIZE
    } );

    // '= ?' in normal font (no i18n requirements here, since this is an equation)
    var rightNode = new Text( ' ' + MathSymbols.EQUAL_TO + ' ' + questionMarkString, {
      font: new PhetFont( FONT_SIZE )
    } );

    var contentNode = new HBox( {
      children: [ variableNode, rightNode ], // x = ?
      maxWidth: 100
    } );

    Checkbox.call( this, contentNode, variableValueVisibleProperty, options );
  }

  equalityExplorer.register( 'VariableValuesVisibleCheckbox', VariableValuesVisibleCheckbox );

  return inherit( Checkbox, VariableValuesVisibleCheckbox );
} );