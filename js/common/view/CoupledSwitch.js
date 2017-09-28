// Copyright 2017, University of Colorado Boulder

//TODO make this extend ToggleNode, add options.alignIcons strategy to ToggleNode
/**
 * Padlock used to turning coupling on/off.
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

  // images
  var lockClosedImage = require( 'image!EQUALITY_EXPLORER/lock-closed.png' );
  var lockOpenedImage = require( 'image!EQUALITY_EXPLORER/lock-opened.png' );

  /**
   * @param {Property.<boolean>} coupledProperty
   * @param {Object} [options]
   * @constructor
   */
  function CoupledSwitch( coupledProperty, options ) {

    options = _.extend( {
      cursor: 'pointer',
      scale: 0.4
    }, options );

    // icons
    var lockClosedNode = new Image( lockClosedImage );
    var lockOpenedNode = new Image( lockOpenedImage, {

      // This is dependent on the specific image files, and aligns the body of the lock in both images.
      left: lockClosedNode.left,
      bottom: lockClosedNode.bottom
    } );

    // We couldn't use sun.ToggleNode for this type because it center aligns both icons.
    // That doesn't work for the icons here.
    // This node allows us to put the origin at the center of the 'closed' lock
    var parentNode = new Node( {
      children: [ lockClosedNode, lockOpenedNode ],
      x: -lockClosedNode.width / 2,
      y: -lockClosedNode.height / 2
    } );

    assert && assert( !options.children, 'subtype defines its children' );
    options.children = [ parentNode ];

    Node.call( this, options );

    // sync with the model
    coupledProperty.link( function( coupled ) {
      lockClosedNode.visible = coupled;
      lockOpenedNode.visible = !coupled;
    } );

    // toggle the state when the user clicks on this Node
    this.addInputListener( new DownUpListener( {
      up: function( event ) {
        coupledProperty.value = !coupledProperty.value;
      }
    } ) );

    this.touchArea = this.localBounds.dilatedXY( 20, 10 );
  }

  equalityExplorer.register( 'CoupledSwitch', CoupledSwitch );

  return inherit( Node, CoupledSwitch );
} );