// Copyright 2017-2020, University of Colorado Boulder

/**
 * Pressing this button clears all terms from the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import EraserButton, { EraserButtonOptions } from '../../../../scenery-phet/js/buttons/EraserButton.js';
import equalityExplorer from '../../equalityExplorer.js';

type SelfOptions = EmptySelfOptions;

type ClearScaleButtonOptions = SelfOptions &
  PickOptional<EraserButtonOptions, 'visible'> &
  PickRequired<EraserButtonOptions, 'listener'>;

export default class ClearScaleButton extends EraserButton {

  public constructor( providedOptions: ClearScaleButtonOptions ) {

    const options = optionize<ClearScaleButtonOptions, SelfOptions, EraserButtonOptions>()( {

      // EraserButtonOptions
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      iconWidth: 22
    }, providedOptions );

    super( options );
  }
}

equalityExplorer.register( 'ClearScaleButton', ClearScaleButton );