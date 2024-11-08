// Copyright 2023, University of Colorado Boulder

/**
 * Derived strings used globally throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../axon/js/PatternStringProperty.js';
import { RichText } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';

const DERIVED_STRINGS_TANDEM = Tandem.getDerivedStringsTandem();

const EqualityExplorerDerivedStrings = {

  solveForXStringProperty: new PatternStringProperty( EqualityExplorerStrings.solveForStringProperty, {
    variable: EqualityExplorerStrings.xStringProperty
  }, {
    tandem: DERIVED_STRINGS_TANDEM.createTandem( RichText.STRING_PROPERTY_TANDEM_NAME )
  } )
};

equalityExplorer.register( 'EqualityExplorerDerivedStrings', EqualityExplorerDerivedStrings );
export default EqualityExplorerDerivedStrings;