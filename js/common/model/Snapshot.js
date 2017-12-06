// Copyright 2017, University of Colorado Boulder

/**
 * Snapshot of a scene, saves all of the state needed to restore the scene.
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

    //TODO this may indicate the need for a subtype
    // @public
    this.x = ( scene.xProperty ) ? scene.xProperty.value : null;

    //TODO
  }

  equalityExplorer.register( 'Snapshot', Snapshot );

  return inherit( Object, Snapshot, {

    // @public
    dispose: function() {
      //TODO
    }
  } );
} );
 