// Copyright 2017-2022, University of Colorado Boulder

/**
 * The 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import EqualityExplorerScreen, { EqualityExplorerScreenOptions } from '../common/EqualityExplorerScreen.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';
import NumbersModel from './model/NumbersModel.js';
import NumbersScreenView from './view/NumbersScreenView.js';
import HaloNode from '../common/view/HaloNode.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Fraction from '../../../phetcommon/js/model/Fraction.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import ConstantTermNode from '../common/view/ConstantTermNode.js';
import { Node } from '../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;

type NumbersScreenOptions = SelfOptions & PickRequired<EqualityExplorerScreenOptions, 'tandem'>;

export default class NumbersScreen extends EqualityExplorerScreen<NumbersModel, NumbersScreenView> {

  public constructor( providedOptions: NumbersScreenOptions ) {

    const options = optionize<NumbersScreenOptions, SelfOptions, EqualityExplorerScreenOptions>()( {

      // EqualityExplorerScreenOptions
      name: EqualityExplorerStrings.screen.numbersStringProperty,
      backgroundColorProperty: new Property( EqualityExplorerColors.NUMBERS_SCREEN_BACKGROUND ),
      homeScreenIcon: createScreenIcon()
    }, providedOptions );

    super(
      () => new NumbersModel( options.tandem.createTandem( 'model' ) ),
      model => new NumbersScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen: 1 and -1 overlapping
 */
function createScreenIcon(): ScreenIcon {

  // 1
  const positiveOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) );

  // -1
  const negativeOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( -1 ) );

  // -1 overlaps 1
  negativeOneNode.left = positiveOneNode.right - 10;
  negativeOneNode.bottom = positiveOneNode.centerY + 10;

  // halos
  const haloRadius = 0.85 * positiveOneNode.width;
  const positiveOneHaloNode = new HaloNode( haloRadius, {
    center: positiveOneNode.center
  } );
  const negativeOneHaloNode = new HaloNode( haloRadius, {
    center: negativeOneNode.center
  } );

  const iconNode = new Node( {
    children: [ positiveOneHaloNode, negativeOneHaloNode, positiveOneNode, negativeOneNode ]
  } );

  return new ScreenIcon( iconNode, {
    fill: EqualityExplorerColors.NUMBERS_SCREEN_BACKGROUND
  } );
}

equalityExplorer.register( 'NumbersScreen', NumbersScreen );