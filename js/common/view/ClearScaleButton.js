// Copyright 2017-2019, University of Colorado Boulder

/**
 * Pressing this button clears all terms from the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import equalityExplorer from '../../equalityExplorer.js';

/**
 * @param {function} clearScaleFunction
 * @param {Object} [options]
 * @constructor
 */
function ClearScaleButton( clearScaleFunction, options ) {

  options = merge( {

    // EraserButton options
    touchAreaDilation: 5,
    iconWidth: 22
  }, options );

  assert && assert( !options.listener, 'ClearScaleButton sets listener' );
  options.listener = function() {
    phet.log && phet.log( 'ClearScaleButton pressed' );
    clearScaleFunction();
  };

  EraserButton.call( this, options );
}

equalityExplorer.register( 'ClearScaleButton', ClearScaleButton );

inherit( EraserButton, ClearScaleButton );
export default ClearScaleButton;