// Copyright 2018-2023, University of Colorado Boulder

/**
 * Shows how the current challenge was derived. Used exclusively for debugging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { NodeTranslationOptions, RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import Challenge from '../model/Challenge.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

type SelfOptions = EmptySelfOptions;

type ChallengeDerivationTextOptions = SelfOptions & NodeTranslationOptions;

export default class ChallengeDerivationText extends RichText {

  public constructor( challengeProperty: Property<Challenge | null>, providedOptions?: ChallengeDerivationTextOptions ) {

    const options = optionize<ChallengeDerivationTextOptions, SelfOptions, RichTextOptions>()( {

      // RichTextOptions
      font: DEFAULT_FONT
    }, providedOptions );

    super( '', options );

    // display derivation of the current challenge
    challengeProperty.link( challenge => {
      this.string = ( challenge ? challenge.debugDerivation : '' );
    } );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }

}

equalityExplorer.register( 'ChallengeDerivationText', ChallengeDerivationText );