// Copyright 2018, University of Colorado Boulder

/**
 * Animation sequence that translates a Node, then fades it out.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Animation = require( 'TWIXT/Animation' );
  var Easing = require( 'TWIXT/Easing' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var STEPPER = 'manual'; // Animation will be stepped via step function

  /**
   * @param {Node} node
   * @param {Object} [options]
   * @constructor
   */
  function TranslateThenFade( node, options ) {

    var self = this;

    options = _.extend( {
      destination: Vector2.ZERO, // destination location
      translateDuration: 0.7, // motion duration, in seconds
      fadeDuration: 0.25, // fade duration, in seconds
      onComplete: function() {}, // called when the animation completes
      onStop: function() {} // called when the animation is stopped (by calling stop)
    }, options );

    // @private
    this.onStop = options.onStop;

    // Property for animating position, unlink not needed.
    var positionProperty = new Property( node.translation );
    positionProperty.link( function( position ) {
      node.translation = position;
    } );

    // Property for animating opacity, unlink not needed.
    var opacityProperty = new NumberProperty( node.opacity );
    opacityProperty.link( function( opacity ) {
      node.opacity = opacity;
    } );

    // Animation for translate
    this.translateAnimation = new Animation( {
      stepper: STEPPER,
      duration: options.translateDuration,
      targets: [ {
        property: positionProperty,
        easing: Easing.QUINTIC_IN,
        to: options.destination
      } ]
    } );

    // Animation for fade
    this.fadeAnimation = new Animation( {
      stepper: STEPPER,
      duration: options.fadeDuration,
      targets: [ {
        property: opacityProperty,
        easing: Easing.LINEAR,
        to: 0
      } ]
    } );

    // When translation finishes, start opacity animation
    this.translateAnimation.finishEmitter.addListener( function() {
      self.fadeAnimation.start();
    } );

    // When fade finishes, perform callback
    this.fadeAnimation.finishEmitter.addListener( function() {
      options.onComplete();
    } );
  }

  equalityExplorer.register( 'TranslateThenFade', TranslateThenFade );

  return inherit( Object, TranslateThenFade, {

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step: function( dt ) {
      this.translateAnimation.step( dt );
      this.fadeAnimation.step( dt );
    },

    /**
     * Starts the animation.
     * @public
     */
    start: function() {
      this.translateAnimation.start();
    },

    /**
     * Stops the animation.
     * @public
     */
    stop: function() {
      this.translateAnimation.stop();
      this.fadeAnimation.stop();
      this.onStop();
    }
  } );
} );
