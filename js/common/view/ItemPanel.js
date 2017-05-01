// Copyright 2017, University of Colorado Boulder

/**
 * Panel that contains the items that can be dragged out onto the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ItemPanel( options ) {

    var content = new Rectangle( 0, 0, 275, 50 ); //TODO placeholder

    Panel.call( this, content, options );
  }

  equalityExplorer.register( 'ItemPanel', ItemPanel );

  return inherit( Panel, ItemPanel );
} );
