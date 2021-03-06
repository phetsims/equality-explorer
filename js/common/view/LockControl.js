// Copyright 2017-2021, University of Colorado Boulder

/**
 * Padlock used to lock/unlock the 2 sides of the scale.
 * When locked, every action on one side is balanced by an equivalent action on the opposite side.
 * Origin is at the center of the 'closed' padlock image. Use x,y options for layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import FireListener from '../../../../scenery/js/listeners/FireListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import BooleanToggleNode from '../../../../sun/js/BooleanToggleNode.js';
import lockClosedImage from '../../../images/lockClosed_png.js';
import lockOpenedImage from '../../../images/lockOpened_png.js';
import equalityExplorer from '../../equalityExplorer.js';

class LockControl extends Node {

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

    // icons
    const lockClosedNode = new Image( lockClosedImage );
    const lockOpenedNode = new Image( lockOpenedImage );
    assert && assert( lockClosedNode.width === lockOpenedNode.width && lockClosedNode.height === lockOpenedNode.height,
      'lock images must have identical dimensions' );

    const toggleNode = new BooleanToggleNode( lockClosedNode, lockOpenedNode, lockedProperty, {

      // put the origin at the center of the 'closed' lock, to facilitate layout
      x: -lockClosedNode.width / 2,
      y: -lockClosedNode.height / 2
    } );

    assert && assert( !options.children, 'LockControl sets children' );
    options.children = [ toggleNode ];

    super( options );

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

equalityExplorer.register( 'LockControl', LockControl );

export default LockControl;