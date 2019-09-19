// Copyright 2017-2018, University of Colorado Boulder

/**
 * Checkbox used to show/hide the values of variables in the Snapshots accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  // strings
  const questionMarkString = require( 'string!EQUALITY_EXPLORER/questionMark' );

  // constants
  const FONT_SIZE = 24;

  /**
   * @param {Variable[]} variables - the variables
   * @param {BooleanProperty} variableValueVisibleProperty - whether the variable value is visible
   * @param {Object} [options]
   * @constructor
   */
  function VariableValuesVisibleCheckbox( variables, variableValueVisibleProperty, options ) {

    // Design decision: If there are multiple variables, use the first variable to label the checkbox.
    // This decision was based on the limited space we have for the checkbox in Snapshots accordion box.
    const variable = variables[ 0 ];

    // variable
    const variableNode = new VariableNode( variable, {
      iconScale: 0.45,
      fontSize: FONT_SIZE
    } );

    // '= ?' in normal font (no i18n requirements here, since this is an equation)
    const rightNode = new Text( ' ' + MathSymbols.EQUAL_TO + ' ' + questionMarkString, {
      font: new PhetFont( FONT_SIZE )
    } );

    const contentNode = new HBox( {
      children: [ variableNode, rightNode ], // x = ?
      maxWidth: 100
    } );

    Checkbox.call( this, contentNode, variableValueVisibleProperty, options );
  }

  equalityExplorer.register( 'VariableValuesVisibleCheckbox', VariableValuesVisibleCheckbox );

  return inherit( Checkbox, VariableValuesVisibleCheckbox );
} );