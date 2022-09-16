// Copyright 2018-2020, University of Colorado Boulder

// @ts-nocheck
/**
 * Abstract base class for Screens in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen from '../../../joist/js/Screen.js';
import equalityExplorer from '../equalityExplorer.js';

class EqualityExplorerScreen extends Screen {

  /**
   * @param {function} createModel
   * @param {function(model):Node } createView
   * @param {Object} [options]
   * @abstract
   */
  constructor( createModel, createView, options ) {

    super( createModel, createView, options );

    // When this Screen is deactivated, deactivate the model.  unlink not needed.
    this.activeProperty.lazyLink( screenActive => {
      if ( !screenActive && this.model.deactivate ) {
        this.model.deactivate();
      }
    } );
  }
}

equalityExplorer.register( 'EqualityExplorerScreen', EqualityExplorerScreen );

export default EqualityExplorerScreen;