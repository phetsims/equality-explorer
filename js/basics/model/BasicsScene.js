// Copyright 2017-2018, University of Colorado Boulder

/**
 * Base type for a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @param {string} debugName - internal name, not displayed to the user, no i18n required
   * @param {Node} icon - icon used to represent the scene
   * @param {TermCreator[]} leftTermCreators
   * @param {TermCreator[]} rightTermCreators
   * @param {Object} [options]
   * @constructor
   */
  function BasicsScene( debugName, icon, leftTermCreators, rightTermCreators, options ) {

    options = options || {};

    assert && assert( !options.icon, 'icon is a required parameter' );
    options.icon = icon;

    Scene.call( this, debugName, leftTermCreators, rightTermCreators, options );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  return inherit( Scene, BasicsScene );
} );

