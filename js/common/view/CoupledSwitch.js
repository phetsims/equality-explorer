// Copyright 2017, University of Colorado Boulder

//TODO CoupledSwitch is one of several design alternatives, delete if not used
/**
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Property.<boolean>} coupledProperty
   * @param {Object} [options]
   * @constructor
   */
  function CoupledSwitch( coupledProperty, options ) {

    options = _.extend( {
      cursor: 'pointer',
      scale: 1.25
    }, options );

    // icons, these are not pickable
    var lockedNode = new FontAwesomeNode( 'lock' );
    var unlockedNode = new FontAwesomeNode( 'unlock_alt' );

    // transparent background
    var backgroundWidth = Math.max( lockedNode.width, unlockedNode.width );
    var backgroundHeight = Math.max( lockedNode.height, unlockedNode.height );
    var backgroundNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight );

    lockedNode.centerX = backgroundNode.centerX;
    lockedNode.bottom = backgroundNode.bottom;
    unlockedNode.centerX = backgroundNode.centerX;
    unlockedNode.bottom = backgroundNode.bottom;

    assert && assert( !options.children, 'subtype defines its children' );
    options.children = [ backgroundNode, lockedNode, unlockedNode ];

    Node.call( this, options );

    // sync with the model
    coupledProperty.link( function( coupled ) {
      lockedNode.visible = coupled;
      unlockedNode.visible = !coupled;
    } );

    // toggle the state when the user clicks on this Node
    this.addInputListener( new DownUpListener( {
      up: function( event ) {
        coupledProperty.value = !coupledProperty.value;
      }
    } ) );
  }

  equalityExplorer.register( 'CoupledSwitch', CoupledSwitch );

  return inherit( Node, CoupledSwitch );
} );