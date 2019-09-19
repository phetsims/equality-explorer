// Copyright 2017-2018, University of Colorado Boulder

/**
 * Padlock used to lock/unlock the 2 sides of the scale.
 * When locked, every action on one side is balanced by an equivalent action on the opposite side.
 * Origin is at the center of the 'closed' padlock image. Use x,y options for layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanToggleNode = require( 'SUN/BooleanToggleNode' );
  const DownUpListener = require( 'SCENERY/input/DownUpListener' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );

  // images
  const lockClosedImage = require( 'image!EQUALITY_EXPLORER/lockClosed.png' );
  const lockOpenedImage = require( 'image!EQUALITY_EXPLORER/lockOpened.png' );

  /**
   * @param {BooleanProperty} lockedProperty - indicates whether left and right sides are "locked"
   * @param {Object} [options]
   * @constructor
   */
  function LockControl( lockedProperty, options ) {

    options = _.extend( {

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

    Node.call( this, options );

    // toggle the state when the user clicks on this Node
    this.addInputListener( new DownUpListener( {
      up: function( event ) {
        lockedProperty.value = !lockedProperty.value;
        phet.log && phet.log( 'Lock pressed, value=' + lockedProperty.value );
      }
    } ) );

    this.touchArea = this.localBounds.dilatedXY( 5, 10 );
  }

  equalityExplorer.register( 'LockControl', LockControl );

  return inherit( Node, LockControl );
} );