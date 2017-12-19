// Copyright 2017, University of Colorado Boulder

/**
 * The 'x & y' screen.
 * This screen does not appear in the published sim.  It's used to test multi-variable support in the equations.
 * The view for this screen is identical to the 'Variables' screen, but the model contains 2 variables (x & y).
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
  var XYModel = require( 'EQUALITY_EXPLORER/xy/model/XYModel' );
  var VariablesScreenView = require( 'EQUALITY_EXPLORER/variables/view/VariablesScreenView' );

  // strings
  var screenVariablesString = 'x & y'; // i18n not required, this is a test string

  /**
   * @param {Object} [options]
   * @constructor
   */
  function XYScreen( options ) {

    options = _.extend( {
      name: screenVariablesString,
      backgroundColorProperty: new Property( 'rgb( 239, 253, 218 )' )
    }, options );

    Screen.call( this,
      function() { return new XYModel(); },
      function( model ) { return new VariablesScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'XYScreen', XYScreen );

  return inherit( Screen, XYScreen );
} );