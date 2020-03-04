// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows how the current challenge was derived. Used exclusively for debugging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

/**
 * @param {Property.<Challenge|null>} challengeProperty
 * @param {Object} [options]
 * @constructor
 */
function ChallengeDerivationNode( challengeProperty, options ) {

  options = merge( {

    // RichText options
    font: DEFAULT_FONT
  }, options );

  RichText.call( this, '', options );

  // display derivation of the current challenge. unlink not needed.
  challengeProperty.link( challenge => {
    this.text = ( challenge ? challenge.debugDerivation : '' );
  } );
}

equalityExplorer.register( 'ChallengeDerivationNode', ChallengeDerivationNode );

inherit( RichText, ChallengeDerivationNode );
export default ChallengeDerivationNode;