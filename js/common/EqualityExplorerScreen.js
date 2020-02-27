// Copyright 2018-2019, University of Colorado Boulder

/**
 * Abstract base type for Screens in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import equalityExplorer from '../equalityExplorer.js';

/**
 * @param {function} createModel
 * @param {function(model):Node } createView
 * @param {Object} [options]
 * @constructor
 * @abstract
 */
function EqualityExplorerScreen( createModel, createView, options ) {

  const self = this;

  Screen.call( this, createModel, createView, options );

  // When this Screen is deactivated, deactivate the model.  unlink not needed.
  this.activeProperty.lazyLink( function( screenActive ) {
    if ( !screenActive && self.model.deactivate ) {
      self.model.deactivate();
    }
  } );
}

equalityExplorer.register( 'EqualityExplorerScreen', EqualityExplorerScreen );

inherit( Screen, EqualityExplorerScreen );
export default EqualityExplorerScreen;