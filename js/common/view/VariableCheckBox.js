// Copyright 2017, University of Colorado Boulder

/**
 * Check box used to show/hide the value of the variable in the Snapshots accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
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
  function VariableCheckBox( symbol, variableVisibleProperty, options ) {

    // the variable's symbol, in math font
    var symbolNode = new Text( symbol, {
      font: new MathSymbolFont( FONT_SIZE )
    } );

    // '= ?' in normal font, i18n not required
    var rightString = StringUtils.fillIn( ' {{equals}} {{questionMark}}', {
      equals: EqualityExplorerConstants.EQUALS,
      questionMark: questionMarkString
    } );
    var rightNode = new Text( rightString, {
      font: new PhetFont( FONT_SIZE )
    } );

    var contentNode = new HBox( {
      children: [ symbolNode, rightNode ], // x = ?
      maxWidth: 100
    } );

    CheckBox.call( this, contentNode, variableVisibleProperty, options );
  }

  equalityExplorer.register( 'VariableCheckBox', VariableCheckBox );

  return inherit( CheckBox, VariableCheckBox );
} );