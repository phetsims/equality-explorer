// Copyright 2017-2018, University of Colorado Boulder

/**
 * Padlock used to lock/unlock the 2 sides of the scale.
 * When locked, every action on one side is balanced by an equivalent action on the opposite side.
 * Origin is at the center of the 'closed' padlock image. Use x,y options for layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BooleanToggleNode = require( 'SUN/BooleanToggleNode' );

  // images
  var lockClosedImage = require( 'image!EQUALITY_EXPLORER/lockClosed.png' );
  var lockOpenedImage = require( 'image!EQUALITY_EXPLORER/lockOpened.png' );

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
    var lockClosedNode = new Image( lockClosedImage );
    var lockOpenedNode = new Image( lockOpenedImage );
    assert && assert( lockClosedNode.width === lockOpenedNode.width && lockClosedNode.height === lockOpenedNode.height,
      'lock images must have identical dimensions' );

    var toggleNode = new BooleanToggleNode( lockClosedNode, lockOpenedNode, lockedProperty, {

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