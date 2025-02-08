// Copyright 2017-2025, University of Colorado Boulder

/**
 * The 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import Fraction from '../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../scenery/js/nodes/Text.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import EqualityExplorerScreen, { EqualityExplorerScreenOptions } from '../common/EqualityExplorerScreen.js';
import ConstantTermNode from '../common/view/ConstantTermNode.js';
import VariableTermNode from '../common/view/VariableTermNode.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';
import VariablesModel from './model/VariablesModel.js';
import VariablesScreenView from './view/VariablesScreenView.js';

type SelfOptions = EmptySelfOptions;

type VariablesScreenOptions = SelfOptions & PickRequired<EqualityExplorerScreenOptions, 'tandem'>;

export default class VariablesScreen extends EqualityExplorerScreen<VariablesModel, VariablesScreenView> {

  public constructor( providedOptions: VariablesScreenOptions ) {

    const options = optionize<VariablesScreenOptions, SelfOptions, EqualityExplorerScreenOptions>()( {

      // EqualityExplorerScreenOptions
      name: EqualityExplorerStrings.screen.variablesStringProperty,
      backgroundColorProperty: EqualityExplorerColors.variablesScreenBackgroundColorProperty,
      homeScreenIcon: createScreenIcon()
    }, providedOptions );

    super(
      () => new VariablesModel( options.tandem.createTandem( 'model' ) ),
      model => new VariablesScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen: x, -x < 1, x
 */
function createScreenIcon(): ScreenIcon {

  // x and -x on left side of the equation
  const leftPositiveXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ), EqualityExplorerStrings.xStringProperty );
  const leftNegativeXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( -1 ), EqualityExplorerStrings.xStringProperty );
  const leftGroupNode = new VBox( {
    children: [ leftPositiveXNode, leftNegativeXNode ]
  } );

  // <
  const lessThanText = new Text( MathSymbols.LESS_THAN, {
    font: new PhetFont( 50 )
  } );

  // 1 and x on right side of the equation
  const rightPositiveOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) );
  const rightPositiveXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ), EqualityExplorerStrings.xStringProperty );
  const rightGroupNode = new VBox( {
    children: [ rightPositiveOneNode, rightPositiveXNode ]
  } );

  const iconNode = new HBox( {
    spacing: 10,
    children: [ leftGroupNode, lessThanText, rightGroupNode ]
  } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 0.75,
    fill: EqualityExplorerColors.variablesScreenBackgroundColorProperty
  } );
}

equalityExplorer.register( 'VariablesScreen', VariablesScreen );