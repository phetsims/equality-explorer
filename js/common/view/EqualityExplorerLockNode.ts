// Copyright 2017-2021, University of Colorado Boulder

// @ts-nocheck
/**
 * Padlock used to lock/unlock the 2 sides of the scale.
 * When locked, every action on one side is balanced by an equivalent action on the opposite side.
 * Origin is at the center of the 'closed' padlock image. Use x,y options for layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import LockNode from '../../../../scenery-phet/js/LockNode.js';
import { FireListener } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';

class EqualityExplorerLockNode extends LockNode {

  /**
   * @param {BooleanProperty} lockedProperty - indicates whether left and right sides are "locked"
   * @param {Object} [options]
   */
  constructor( lockedProperty, options ) {

    options = merge( {

      // Node options
      cursor: 'pointer',
      maxHeight: 45
    }, options );

    super( lockedProperty, options );

    // toggle the state when the user clicks on this Node
    this.addInputListener( new FireListener( {
      fire: () => {
        lockedProperty.value = !lockedProperty.value;
        phet.log && phet.log( `Lock pressed, value=${lockedProperty.value}` );
      }
    } ) );

    this.touchArea = this.localBounds.dilatedXY( 5, 10 );
  }
}

equalityExplorer.register( 'EqualityExplorerLockNode', EqualityExplorerLockNode );

export default EqualityExplorerLockNode;