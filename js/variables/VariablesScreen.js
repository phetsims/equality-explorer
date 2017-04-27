// Copyright 2017, University of Colorado Boulder

/**
 * The 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var VariablesModel = require( 'EQUALITY_EXPLORER/variables/model/VariablesModel' );
  var VariablesScreenView = require( 'EQUALITY_EXPLORER/variables/view/VariablesScreenView' );

  // strings
  var screenVariablesString = require( 'string!EQUALITY_EXPLORER/screen.variables' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function VariablesScreen( options ) {

    options = _.extend( {
      name: screenVariablesString,
      backgroundColorProperty: new Property( 'white' )
    }, options );

    Screen.call( this,
      function() { return new VariablesModel(); },
      function( model ) { return new VariablesScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'VariablesScreen', VariablesScreen );

  return inherit( Screen, VariablesScreen );
} );