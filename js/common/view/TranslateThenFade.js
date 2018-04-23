// Copyright 2018, University of Colorado Boulder

/**
 * Animation sequence that translates a Node, then fades it out.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoveTo = require( 'TWIXT/MoveTo' );
  var OpacityTo = require( 'TWIXT/OpacityTo' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Node} node
   * @param {Object} [options]
   * @constructor
   */
  function TranslateThenFade( node, options ) {

    var self = this;

    options = _.extend( {
      destination: Vector2.ZERO, // destination location
      translateDuration: 700, // motion duration, ms
      fadeDuration: 250, // fade duration, in ms
      onComplete: function() {}, // called when the animation completes
      onStop: function() {} // called when the animation is stopped (by calling stop)
    }, options );

    // @private
    this.onStop = options.onStop;

    // @private fade animation, started when the translation completes
    this.opacityTo = new OpacityTo( node, {
      duration: options.fadeDuration,
      endOpacity: 0,
      easing: TWEEN.Easing.Linear.None,
      onComplete: function() {
        options.onComplete();
      }
    } );

    // @private translation animation
    this.moveTo = new MoveTo( node, options.destination, {
      duration: options.translateDuration,
      constantSpeed: false,
      easing: TWEEN.Easing.Quintic.In,
      onComplete: function() {
        self.opacityTo.start(); // when translation completes, start the fade
      }
    } );
  }

  equalityExplorer.register( 'TranslateThenFade', TranslateThenFade );

  return inherit( Object, TranslateThenFade, {

    /**
     * Starts the animation.
     * @public
     */
    start: function() {
      this.moveTo.start();
    },

    /**
     * Stops the animation.
     * @public
     */
    stop: function() {
      this.moveTo.stop();
      this.opacityTo.stop();
      this.onStop();
    }
  } );
} );
