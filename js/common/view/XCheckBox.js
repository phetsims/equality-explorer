// Copyright 2017, University of Colorado Boulder

/**
 * Check box used to show the value of the variable (x) in the Snapshots accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );
  var questionMarkString = require( 'string!EQUALITY_EXPLORER/questionMark' );

  /**
   * @param {Property.<boolean>} xVisibleProperty
   * @param {Object} [options]
   * @constructor
   */
  function XCheckBox( xVisibleProperty, options ) {

    var xNode = new Text( xString, {
      font: new MathSymbolFont( 24 )
    } );

    var equalsNode = new Text( ' = ' + questionMarkString, {
      font: new PhetFont( 24 )
    } );

    var contentNode = new HBox( {
      children: [ xNode, equalsNode ],
      maxWidth: 100
    } );

    CheckBox.call( this, contentNode, xVisibleProperty, options );
  }

  equalityExplorer.register( 'XCheckBox', XCheckBox );

  return inherit( CheckBox, XCheckBox );
} );