// Copyright 2018, University of Colorado Boulder

/**
 * Animates an operation falling straight down from some starting location to some destination.
 * This occurs between when the 'Go' button is pressed on the universal operation control.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoveTo = require( 'TWIXT/MoveTo' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OpacityTo = require( 'TWIXT/OpacityTo' );
  var UniversalOperationNode = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {UniversalOperation} operation
   * @param {Object} [options] - not propagated to supertype
   * @constructor
   */
  function UniversalOperationAnimation( operation, options ) {

    var self = this;

    options = _.extend( {
      symbolFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_SYMBOL_FONT,
      integerFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT,
      fractionFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_FRACTION_FONT,
      startX: 0,
      startY: 0,
      endY: 50,
      motionDuration: 700, // motion duration, ms
      opacityDuration: 250, // fade duration, in ms
      onComplete: function() {}, // called when the animation completes
      onStop: function() {} // called when the animation is stopped (by calling stop)
    }, options );

    var operationNode = new UniversalOperationNode( operation, {
      symbolFont: options.symbolFont,
      integerFont: options.integerFont,
      fractionFont: options.fractionFont
    } );

    // wrap operationNode to hide its API
    Node.call( this, {
      children: [ operationNode ],
      centerX: options.startX,
      centerY: options.startY
    } );

    // @private
    this.started = false; // was the animation started?
    this.stopped = false; // was the animation stopped?

    // @private opacity animation (fade out), started when the operations arrive at their destination
    this.opacityTo = new OpacityTo( this, {
      duration: options.opacityDuration,
      endOpacity: 0,
      easing: TWEEN.Easing.Linear.None,
      onComplete: function() {
        !self.disposed && self.dispose();
        options.onComplete();
      },
      onStop: function() {
        !self.disposed && self.dispose();
        options.onStop();
      }
    } );

    // straight down from start location
    var destination = new Vector2( self.x, options.endY - operationNode.height );

    // @private motion animation
    this.moveTo = new MoveTo( self, destination, {
      duration: options.motionDuration,
      constantSpeed: false,
      easing: TWEEN.Easing.Quintic.In,
      onComplete: function() {
        self.opacityTo.start();
      },
      onStop: function() {
        !self.disposed && self.dispose();
        options.onStop();
      }
    } );
  }

  equalityExplorer.register( 'UniversalOperationAnimation', UniversalOperationAnimation );

  return inherit( Node, UniversalOperationAnimation, {

    /**
     * Starts the animation. May be called only once.
     * @public
     */
    start: function() {
      assert && assert( !this.started, 'attempted to start animation twice' );
      this.moveTo.start();
      this.started = true;
    },

    /**
     * Stops the animation. May be called only once, typically to cancel an animation in progress.
     * @public
     */
    stop: function() {
      assert && assert( this.started, 'attempt to stop animation that was not started' );
      assert && assert( !this.stopped, 'attempted to stop animation twice' );
      this.moveTo.stop();
      this.opacityTo.stop();
      this.stopped = true;
    }
  } );
} );
