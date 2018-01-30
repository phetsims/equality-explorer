// Copyright 2018, University of Colorado Boulder

/**
 * The 'Mystery' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryModel = require( 'EQUALITY_EXPLORER/mystery/model/MysteryModel' );
  var MysteryScreenView = require( 'EQUALITY_EXPLORER/mystery/view/MysteryScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenMysteryString = require( 'string!EQUALITY_EXPLORER/screen.mystery' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function MysteryScreen( options ) {

    options = _.extend( {
      name: screenMysteryString,
      backgroundColorProperty: new Property( 'white' )
    }, options );

    Screen.call( this,
      function() { return new MysteryModel(); },
      function( model ) { return new MysteryScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'MysteryScreen', MysteryScreen );

  return inherit( Screen, MysteryScreen );
} );