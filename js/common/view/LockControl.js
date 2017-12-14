// Copyright 2017, University of Colorado Boulder

/**
 * Padlock used to lock/unlock the 2 sides of the scale.
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
  var ToggleNode = require( 'SUN/ToggleNode' );

  // images
  var lockClosedImage = require( 'image!EQUALITY_EXPLORER/lockClosed.png' );
  var lockOpenedImage = require( 'image!EQUALITY_EXPLORER/lockOpened.png' );

  /**
   * @param {BooleanProperty} lockedProperty
   * @param {Object} [options]
   * @constructor
   */
  function LockControl( lockedProperty, options ) {

    options = _.extend( {
      cursor: 'pointer',
      scale: 0.4
    }, options );

    // icons
    var lockClosedNode = new Image( lockClosedImage );
    var lockOpenedNode = new Image( lockOpenedImage );

    var toggleNode = new ToggleNode( lockClosedNode, lockOpenedNode, lockedProperty, {

      // This is dependent on the specific image files, and aligns the body of the lock in both images.
      alignIcons: function( trueNode, falseNode ) {
        trueNode.left = falseNode.left;
        trueNode.bottom = falseNode.bottom;
      },

      // put the origin at the center of the 'closed' lock, to facilitate layout
      x: -lockClosedNode.width / 2,
      y: -lockClosedNode.height / 2
    } );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [ toggleNode ];

    Node.call( this, options );

    // toggle the state when the user clicks on this Node
    this.addInputListener( new DownUpListener( {
      up: function( event ) {
        lockedProperty.value = !lockedProperty.value;
      }
    } ) );

    this.touchArea = this.localBounds.dilatedXY( 20, 10 );
  }

  equalityExplorer.register( 'LockControl', LockControl );

  return inherit( Node, LockControl );
} );