// Copyright 2017-2020, University of Colorado Boulder

// @ts-nocheck
/**
 * Pressing this button clears all terms from the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import equalityExplorer from '../../equalityExplorer.js';

class ClearScaleButton extends EraserButton {

  /**
   * @param {function} clearScaleFunction
   * @param {Object} [options]
   */
  constructor( clearScaleFunction, options ) {

    options = merge( {

      // EraserButton options
      touchAreaDilation: 5,
      iconWidth: 22
    }, options );

    assert && assert( !options.listener, 'ClearScaleButton sets listener' );
    options.listener = () => {
      phet.log && phet.log( 'ClearScaleButton pressed' );
      clearScaleFunction();
    };

    super( options );
  }
}

equalityExplorer.register( 'ClearScaleButton', ClearScaleButton );

export default ClearScaleButton;