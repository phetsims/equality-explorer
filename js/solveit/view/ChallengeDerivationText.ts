// Copyright 2018-2025, University of Colorado Boulder

/**
 * Shows how the current challenge was derived. Used exclusively for debugging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import equalityExplorer from '../../equalityExplorer.js';
import Challenge from '../model/Challenge.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

export default class ChallengeDerivationText extends RichText {

  public constructor( challengeProperty: Property<Challenge | null> ) {

    super( '', {

      // RichTextOptions
      font: DEFAULT_FONT,
      fill: 'red',
      isDisposable: false
    } );

    // display derivation of the current challenge
    challengeProperty.link( challenge => {
      this.string = ( challenge ? challenge.debugDerivation : '' );
    } );
  }
}

equalityExplorer.register( 'ChallengeDerivationText', ChallengeDerivationText );