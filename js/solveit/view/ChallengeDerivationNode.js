// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows how the current challenge was derived. Used exclusively for debugging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

class ChallengeDerivationNode extends RichText {

  /**
   * @param {Property.<Challenge|null>} challengeProperty
   * @param {Object} [options]
   */
  constructor( challengeProperty, options ) {

    options = merge( {

      // RichText options
      font: DEFAULT_FONT
    }, options );

    super( '', options );

    // display derivation of the current challenge. unlink not needed.
    challengeProperty.link( challenge => {
      this.text = ( challenge ? challenge.debugDerivation : '' );
    } );
  }
}

equalityExplorer.register( 'ChallengeDerivationNode', ChallengeDerivationNode );

export default ChallengeDerivationNode;