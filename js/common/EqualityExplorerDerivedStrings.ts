// Copyright 2023-2024, University of Colorado Boulder

/**
 * Derived strings used globally throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../axon/js/DerivedStringProperty.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../tandem/js/Tandem.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';

const DERIVED_STRINGS_TANDEM = Tandem.getDerivedStringsTandem();

const EqualityExplorerDerivedStrings = {

  solveForXStringProperty: new DerivedStringProperty(
    [ EqualityExplorerStrings.solveForStringProperty, EqualityExplorerStrings.xStringProperty ],
    ( solveForString, xString ) => StringUtils.fillIn( solveForString, {
      variable: MathSymbolFont.getRichTextMarkup( xString )
    } ), {
      tandem: DERIVED_STRINGS_TANDEM.createTandem( RichText.STRING_PROPERTY_TANDEM_NAME )
    } )
};

equalityExplorer.register( 'EqualityExplorerDerivedStrings', EqualityExplorerDerivedStrings );
export default EqualityExplorerDerivedStrings;