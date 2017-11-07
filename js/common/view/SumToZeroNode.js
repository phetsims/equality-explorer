// Copyright 2017, University of Colorado Boulder

/**
 * A '0' or '0x' with a yellow halo around it that fades out. 
 * Used to indicate that 1 and -1, or x and -x, have summed to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ConstantItem = require( 'EQUALITY_EXPLORER/common/model/ConstantItem' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OpacityTo = require( 'TWIXT/OpacityTo' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Text = require( 'SCENERY/nodes/Text' );
  var XItem = require( 'EQUALITY_EXPLORER/common/model/XItem' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {constructor} itemConstructor
   * @param {Object} [options]
   * @constructor
   */
  function SumToZeroNode( itemConstructor, options ) {

    assert && assert( itemConstructor === ConstantItem || itemConstructor === XItem,
      'unsupported item type' );

    options = _.extend( {
      haloRadius: 20,
      fontSize: 18
    }, options );

    var zeroNode = new Text( '0', {
      font: new PhetFont( options.fontSize )
    } );

    var symbolNode = null;
    if ( itemConstructor === ConstantItem ) {
      symbolNode = zeroNode;
    }
    else {
      var xNode = new Text( xString, {
        font: new MathSymbolFont( options.fontSize )
      } );
      symbolNode = new HBox( {
        spacing: 0,
        children: [ zeroNode, xNode ]
      } );
    }

    var haloFill = new RadialGradient( 0, 0, 0, 0, 0, options.haloRadius )
      .addColorStop( 0.5, 'rgba( 255, 255, 0, 1 )' )
      .addColorStop( 1, 'rgba( 255, 255, 0, 0 )' );
    var haloNode = new Circle( options.haloRadius, {
      fill: haloFill,
      center: symbolNode.center
    } );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [ haloNode, symbolNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'SumToZeroNode', SumToZeroNode );

  return inherit( Node, SumToZeroNode, {

    /**
     * Starts animation.
     *
     * @public
     */
    startAnimation: function() {

      // start animation, gradually fade out by modulating opacity
      var self = this;
      this.animation = new OpacityTo( this, {
        startOpacity: 0.85,
        endOpacity: 0,
        duration: ( EqualityExplorerQueryParameters.slowMotion ? 2000 : 500 ), // fade out time, ms
        easing: TWEEN.Easing.Quintic.In, // most of opacity change happens at end of duration
        onStart: function() {
          self.visible = true;
        },
        onComplete: function() {
          self.visible = false;
          self.dispose();
        }
      } );
      this.animation.start( phet.joist.elapsedTime );
    }
  } );
} );
 