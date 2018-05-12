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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var ObjectVariable = require( 'EQUALITY_EXPLORER/basics/model/ObjectVariable' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var questionMarkString = require( 'string!EQUALITY_EXPLORER/questionMark' );

  // constants
  var FONT_SIZE = 24;

  /**
   * @param {Variable} variable - the variable to display on the checkbox
   * @param {BooleanProperty} variableValueVisibleProperty - whether the variable value is visible
   * @param {Object} [options]
   * @constructor
   */
  function VariableCheckbox( variable, variableValueVisibleProperty, options ) {

    // the variable's symbol, in math font
    var symbolNode;
    if ( variable instanceof ObjectVariable ) {

      // use an image for a variable associated with a real-world object
      symbolNode = new Image( variable.image, {
        scale: 0.45 // determined empirically
      } );
    }
    else {

      // use text for a symbolic variable, e.g 'x'
      symbolNode = new Text( variable.symbol, {
        font: new MathSymbolFont( FONT_SIZE )
      } );
    }

    // '= ?' in normal font
    var rightNode = new Text( ' ' + MathSymbols.EQUAL_TO + ' ' + questionMarkString, {
      font: new PhetFont( FONT_SIZE )
    } );

    var contentNode = new HBox( {
      children: [ symbolNode, rightNode ], // x = ?
      maxWidth: 100
    } );

    Checkbox.call( this, contentNode, variableValueVisibleProperty, options );
  }

  equalityExplorer.register( 'VariableCheckbox', VariableCheckbox );

  return inherit( Checkbox, VariableCheckbox );
} );