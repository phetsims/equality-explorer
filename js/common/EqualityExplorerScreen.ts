// Copyright 2018-2022, University of Colorado Boulder

/**
 * Base class for most all Screens in this suite of sims, except for SolveItScreen (the game).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerModel from './model/EqualityExplorerModel.js';
import EqualityExplorerScreenView from './view/EqualityExplorerScreenView.js';

type SelfOptions = EmptySelfOptions;

export type EqualityExplorerScreenOptions = SelfOptions & ScreenOptions & PickRequired<ScreenOptions, 'tandem'>;

// @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 EqualityExplorerModel require 1 param
export default class EqualityExplorerScreen<M extends EqualityExplorerModel, V extends EqualityExplorerScreenView>
  extends Screen<M, V> {

  protected constructor( createModel: () => M, createView: ( model: M ) => V, providedOptions: EqualityExplorerScreenOptions ) {

    super( createModel, createView, providedOptions );

    // When this Screen is deactivated, deactivate the model.  unlink not needed.
    this.activeProperty.lazyLink( screenActive => {
      if ( !screenActive ) {
        this.model.deactivate();
      }
    } );
  }
}

equalityExplorer.register( 'EqualityExplorerScreen', EqualityExplorerScreen );