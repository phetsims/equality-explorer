// Copyright 2017-2024, University of Colorado Boulder

/**
 * The 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import Fraction from '../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { HBox, Text } from '../../../scenery/js/imports.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import EqualityExplorerScreen, { EqualityExplorerScreenOptions } from '../common/EqualityExplorerScreen.js';
import ConstantTermNode from '../common/view/ConstantTermNode.js';
import VariableTermNode from '../common/view/VariableTermNode.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';
import OperationsModel from './model/OperationsModel.js';
import OperationsScreenView from './view/OperationsScreenView.js';

type SelfOptions = EmptySelfOptions;

type OperationsScreenOptions = SelfOptions & PickRequired<EqualityExplorerScreenOptions, 'tandem'>;

export default class OperationsScreen extends EqualityExplorerScreen<OperationsModel, OperationsScreenView> {

  public constructor( providedOptions: OperationsScreenOptions ) {

    const options = optionize<OperationsScreenOptions, SelfOptions, EqualityExplorerScreenOptions>()( {

      // EqualityExplorerScreenOptions
      name: EqualityExplorerStrings.screen.operationsStringProperty,
      backgroundColorProperty: EqualityExplorerColors.operationsScreenBackgroundColorProperty,
      homeScreenIcon: createScreenIcon()
    }, providedOptions );

    super(
      () => new OperationsModel( options.tandem.createTandem( 'model' ) ),
      model => new OperationsScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen: 3x = 6
 */
function createScreenIcon(): ScreenIcon {

  const operatorOptions = { font: new PhetFont( 30 ) };

  // 3x on left side of equation
  const variableTermNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 3 ),
    EqualityExplorerStrings.xStringProperty );

  // =
  const equalsText = new Text( MathSymbols.EQUAL_TO, operatorOptions );

  // 6 on right side of equation
  const constantTermNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 6 ) );

  const iconNode = new HBox( {
    spacing: 5,
    children: [ variableTermNode, equalsText, constantTermNode ]
  } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 0.75,
    fill: EqualityExplorerColors.operationsScreenBackgroundColorProperty
  } );
}

equalityExplorer.register( 'OperationsScreen', OperationsScreen );