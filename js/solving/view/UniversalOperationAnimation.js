// Copyright 2018, University of Colorado Boulder

/**
 * Animation that occurs between when the 'Go' button is pressed on the universal operation control,
 * and the operation is applied to the terms on the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoveTo = require( 'TWIXT/MoveTo' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OpacityTo = require( 'TWIXT/OpacityTo' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var UniversalOperationNode = require( 'EQUALITY_EXPLORER/solving/view/UniversalOperationNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {UniversalOperation} operation
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationAnimation( operation, options ) {

    var self = this;

    options = _.extend( {
      font: new PhetFont( 24 ),
      leftX: 0,
      rightX: 100,
      startY: 0,
      distance: 65, // how far the operations will fall vertically
      motionDuration: 700 / EqualityExplorerQueryParameters.speed, // motion duration, ms
      opacityDuration: 250 / EqualityExplorerQueryParameters.speed, // fade duration, in ms
      onComplete: function() {}, // called when the animation completes
      onStop: function() {} // called when the animation is stopped (by calling stop)
    }, options );

    // Nodes for the operation
    var leftOperationNode = new UniversalOperationNode( operation, {
      font: options.font,
      centerX: options.leftX,
      centerY: options.startY
    } );
    var rightOperationNode = new UniversalOperationNode( operation, {
      font: options.font,
      centerX: options.rightX,
      centerY: options.startY
    } );

    // Animate both operation nodes together, so that the operation is applied to both sides simultaneously.
    assert && assert( !options.children, 'subtype sets its children' );
    options.children = [ leftOperationNode, rightOperationNode ];

    Node.call( this, options );

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
    var destination = new Vector2( self.x, self.y + options.distance );

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
