// Copyright 2017, University of Colorado Boulder

/**
 * Snapshot of a scene that involves a variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );

  /**
   * @param {Scene} scene
   * @constructor
   */
  function SnapshotWithVariable( scene ) {

    assert && assert( scene.xProperty, 'scene must have a variable' );
    this.x = scene.xProperty.value;

    Snapshot.call( this, scene );
  }

  equalityExplorer.register( 'SnapshotWithVariable', SnapshotWithVariable );

  return inherit( Snapshot, SnapshotWithVariable );
} );
 