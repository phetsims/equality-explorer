// Copyright 2017, University of Colorado Boulder

/**
 * The 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsModel = require( 'EQUALITY_EXPLORER/basics/model/BasicsModel' );
  var BasicsScreenView = require( 'EQUALITY_EXPLORER/basics/view/BasicsScreenView' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenBasicsString = require( 'string!EQUALITY_EXPLORER/screen.basics' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function BasicsScreen( options ) {

    options = _.extend( {
      name: screenBasicsString,
      backgroundColorProperty: new Property( 'rgb( 255, 250, 227 )' )
    }, options );

    Screen.call( this,
      function() { return new BasicsModel(); },
      function( model ) { return new BasicsScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'BasicsScreen', BasicsScreen );

  return inherit( Screen, BasicsScreen );
} );