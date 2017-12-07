// Copyright 2017, University of Colorado Boulder

/**
 * Base type for snapshot of a scene, saves state needed to restore the scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Scene} scene
   * @constructor
   */
  function Snapshot( scene ) {
    //TODO implement constructor
  }

  equalityExplorer.register( 'Snapshot', Snapshot );

  return inherit( Object, Snapshot, {

    // @public
    dispose: function() {
      //TODO implement dispose
    }
  } );
} );
 