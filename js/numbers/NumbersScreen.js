// Copyright 2017, University of Colorado Boulder

/**
 * The 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumbersModel = require( 'EQUALITY_EXPLORER/numbers/model/NumbersModel' );
  var NumbersScreenView = require( 'EQUALITY_EXPLORER/numbers/view/NumbersScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenNumbersString = require( 'string!EQUALITY_EXPLORER/screen.numbers' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function NumbersScreen( options ) {

    options = _.extend( {
      name: screenNumbersString,
      backgroundColorProperty: new Property( 'rgb( 214, 233, 254 )' )
    }, options );

    Screen.call( this,
      function() { return new NumbersModel(); },
      function( model ) { return new NumbersScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'NumbersScreen', NumbersScreen );

  return inherit( Screen, NumbersScreen );
} );