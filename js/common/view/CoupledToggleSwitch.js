// Copyright 2017, University of Colorado Boulder

//TODO CoupledToggleSwitch is one of several design alternatives, delete if not used
/**
 * Toggle switch for turning coupling on/off that uses 'train coupler' images.
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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // images
  var couplerBlueImage = require( 'image!EQUALITY_EXPLORER/coupler-blue.png' );
  var couplerRedImage = require( 'image!EQUALITY_EXPLORER/coupler-red.png' );

  // constants
  var OPEN_SPACING = 20; // space between couplers in the open position
  var CLOSED_OVERLAP = 31;

  /**
   * @param {Property.<boolean>} coupledProperty
   * @param {Object} [options]
   * @constructor
   */
  function CoupledToggleSwitch( coupledProperty, options ) {

    options = _.extend( {
      cursor: 'pointer',
      scale: 0.4
    }, options );

    var leftCouplerNode = new Image( couplerRedImage );
    var rightCouplerNode = new Image( couplerBlueImage );

    // transparent background, so we can position this Node without caring where the couplers are
    var backgroundWidth = leftCouplerNode.width +  rightCouplerNode.width + OPEN_SPACING;
    var backgroundHeight = Math.max( leftCouplerNode.height, rightCouplerNode.height );
    var backgroundNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight );

    assert && assert( !options.children, 'subtype defines its children' );
    options.children = [ backgroundNode, leftCouplerNode, rightCouplerNode ];

    Node.call( this, options );

    // sync with the model
    coupledProperty.link( function( coupled ) {
      if ( coupled ) {
        
        // close couplers
        leftCouplerNode.left = backgroundNode.left + CLOSED_OVERLAP;
        rightCouplerNode.right = backgroundNode.right - CLOSED_OVERLAP;
      }
      else {

        // open couplers
        leftCouplerNode.left = backgroundNode.left;
        rightCouplerNode.right = backgroundNode.right;
      }
    } );

    // toggle the state when the user clicks on this Node
    this.addInputListener( new DownUpListener( {
      up: function( event ) {
        coupledProperty.value = !coupledProperty.value;
      }
    } ) );
  }

  equalityExplorer.register( 'CoupledToggleSwitch', CoupledToggleSwitch );

  return inherit( Node, CoupledToggleSwitch );
} );