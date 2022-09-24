// Copyright 2017-2022, University of Colorado Boulder

/**
 * The 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import EqualityExplorerScreen, { EqualityExplorerScreenOptions } from '../common/EqualityExplorerScreen.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';
import VariablesModel from './model/VariablesModel.js';
import VariablesScreenView from './view/VariablesScreenView.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Fraction from '../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { HBox, Text, VBox } from '../../../scenery/js/imports.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import ConstantTermNode from '../common/view/ConstantTermNode.js';
import VariableTermNode from '../common/view/VariableTermNode.js';

type SelfOptions = EmptySelfOptions;

type VariablesScreenOptions = SelfOptions & PickRequired<EqualityExplorerScreenOptions, 'tandem'>;

export default class VariablesScreen extends EqualityExplorerScreen<VariablesModel, VariablesScreenView> {

  public constructor( providedOptions: VariablesScreenOptions ) {

    const options = optionize<VariablesScreenOptions, SelfOptions, EqualityExplorerScreenOptions>()( {

      // EqualityExplorerScreenOptions
      name: EqualityExplorerStrings.screen.variablesStringProperty,
      backgroundColorProperty: new Property( EqualityExplorerColors.VARIABLES_SCREEN_BACKGROUND ),
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
  const lessThanNode = new Text( MathSymbols.LESS_THAN, {
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
    children: [ leftGroupNode, lessThanNode, rightGroupNode ]
  } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 0.75,
    fill: EqualityExplorerColors.VARIABLES_SCREEN_BACKGROUND
  } );
}

equalityExplorer.register( 'VariablesScreen', VariablesScreen );