// Copyright 2018, University of Colorado Boulder

/**
 * Displays the values of variables in parenthesis.
 * E.g. '(x = 2)' or '(x = 1, y = 3)' or (sphere = 2, square = 1, triangle = 4).
 * Used in Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  /**
   * @param {Variable[]} variables
   * @param {Object} [options]
   * @constructor
   */
  function VariableValuesNode( variables, options ) {

    options = _.extend( {
      fontSize: 28,
      commaSeparated: true,
      spacing: 15 // spacing between values
    }, options );

    var font = new PhetFont( options.fontSize );

    var children = []; // {Node[]}

    // '(' with normal font
    var leftParenNode = new Text( '(', { font: font } );
    children.push( leftParenNode );

    // E.g. x = 3, for each variable
    for ( var i = 0; i < variables.length; i++ ) {

      var variable = variables[ i ];

      // variable
      var variableNode = new VariableNode( variable, {
        iconScale: 0.45,
        fontSize: options.fontSize
      } );
      children.push( variableNode );

      // ' = N' in normal font, i18n not required
      var equalsValueString = StringUtils.fillIn( ' {{equals}} {{value}}', {
        equals: MathSymbols.EQUAL_TO,
        value: variable.valueProperty.value
      } );
      var equalsValueNode = new Text( equalsValueString, { font: font } );
      children.push( equalsValueNode );

      // comma + space separator
      if ( i < variables.length - 1 ) {
        if ( options.commaSeparated ) {
          children.push( new Text( ',', { font: font } ) );
        }
        children.push( new HStrut( options.spacing ) );
      }
    }

    var rightParenNode = new Text( ')', { font: font } );
    children.push( rightParenNode );

    HBox.call( this, {
      children: children,
      spacing: 0
    } );
  }

  equalityExplorer.register( 'VariableValuesNode', VariableValuesNode );

  return inherit( HBox, VariableValuesNode );
} );