// Copyright 2022, University of Colorado Boulder

/**
 * 'Solve for x' text that appears in a couple of places in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import equalityExplorer from '../../equalityExplorer.js';

type SelfOptions = EmptySelfOptions;

export type SolveForXTextOptions = SelfOptions & RichTextOptions & PickRequired<RichTextOptions, 'tandem'>;

export default class SolveForXText extends RichText {

  public constructor( providedOptions: SolveForXTextOptions ) {

    const stringProperty = new PatternStringProperty( EqualityExplorerStrings.solveForStringProperty, {
      variable: EqualityExplorerStrings.xStringProperty
    }, {
      tandem: providedOptions.tandem.createTandem( RichText.STRING_PROPERTY_TANDEM_NAME )
    } );

    super( stringProperty, providedOptions );
  }
}

equalityExplorer.register( 'SolveForXText', SolveForXText );