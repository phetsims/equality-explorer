// Copyright 2017-2022, University of Colorado Boulder

/**
 * Padlock used to lock/unlock the 2 sides of the scale.
 * When locked, every action on one side is balanced by an equivalent action on the opposite side.
 * Origin is at the center of the 'closed' padlock image. Use x,y options for layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import LockNode, { LockNodeOptions } from '../../../../scenery-phet/js/LockNode.js';
import { FireListener, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';

type SelfOptions = EmptySelfOptions;

type EqualityExplorerLockNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<LockNodeOptions, 'tandem'>;

export default class EqualityExplorerLockNode extends LockNode {

  /**
   * @param lockedProperty - indicates whether left and right sides are "locked"
   * @param [providedOptions]
   */
  public constructor( lockedProperty: Property<boolean>, providedOptions?: EqualityExplorerLockNodeOptions ) {

    const options = optionize<EqualityExplorerLockNodeOptions, SelfOptions, LockNodeOptions>()( {

      // LockNodeOptions
      cursor: 'pointer',
      maxHeight: 45
    }, providedOptions );

    super( lockedProperty, options );

    // toggle the state when the user clicks on this Node
    this.addInputListener( new FireListener( {
      fire: () => {
        lockedProperty.value = !lockedProperty.value;
        phet.log && phet.log( `Lock pressed, value=${lockedProperty.value}` );
      },
      tandem: options.tandem.createTandem( 'fireListener' )
    } ) );

    this.touchArea = this.localBounds.dilatedXY( 5, 10 );

    this.addLinkedElement( lockedProperty, {
      tandem: options.tandem.createTandem( lockedProperty.tandem.name )
    } );
  }
}

equalityExplorer.register( 'EqualityExplorerLockNode', EqualityExplorerLockNode );