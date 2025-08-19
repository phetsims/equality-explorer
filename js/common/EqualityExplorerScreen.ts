// Copyright 2018-2023, University of Colorado Boulder

/**
 * Base class for most all Screens in this suite of sims, except for SolveItScreen (the game).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerModel from './model/EqualityExplorerModel.js';
import EqualityExplorerScreenView from './view/EqualityExplorerScreenView.js';

type SelfOptions = EmptySelfOptions;

export type EqualityExplorerScreenOptions = SelfOptions & ScreenOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class EqualityExplorerScreen<M extends EqualityExplorerModel, V extends EqualityExplorerScreenView>
  extends Screen<M, V> {

  protected constructor( createModel: () => M, createView: ( model: M ) => V, providedOptions: EqualityExplorerScreenOptions ) {

    const options = optionize<EqualityExplorerScreenOptions, SelfOptions, ScreenOptions>()( {
    }, providedOptions );

    super( createModel, createView, options );

    // When this Screen is deactivated, deactivate the model.
    this.activeProperty.lazyLink( screenActive => {
      if ( !screenActive ) {
        this.model.deactivate();
      }
    } );
  }
}

equalityExplorer.register( 'EqualityExplorerScreen', EqualityExplorerScreen );