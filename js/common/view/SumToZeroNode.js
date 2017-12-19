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
  var ConstantItem = require( 'EQUALITY_EXPLORER/common/model/ConstantItem' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OpacityTo = require( 'TWIXT/OpacityTo' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableItem = require( 'EQUALITY_EXPLORER/common/model/VariableItem' );

  /**
   * @param {constructor} itemConstructor - constructor that identifies the type of item that has disappeared
   * @param {string|null} symbol - the symbol for a variable
   * @param {Object} [options]
   * @constructor
   */
  function SumToZeroNode( itemConstructor, symbol, options ) {

    assert && assert( itemConstructor === ConstantItem || itemConstructor === VariableItem,
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

      // 1 and -1 sum to '0'
      symbolNode = zeroNode;
    }
    else {

      // x and -x sum to '0x'
      assert && assert( symbol, 'expected a symbol' );
      var xNode = new Text( symbol, {
        font: new MathSymbolFont( options.fontSize )
      } );
      symbolNode = new HBox( {
        spacing: 0,
        children: [ zeroNode, xNode ]
      } );
    }

    var haloNode = new HaloNode( options.haloRadius, {
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
     * @public
     */
    startAnimation: function() {

      var options = {
        startOpacity: 0.85,
        endOpacity: 0,
        duration: 500, // fade out time, ms
        easing: TWEEN.Easing.Quintic.In, // most of opacity change happens at end of duration
        onStart: function() {
          self.visible = true; // in case a client has set this Node invisible
        },
        onComplete: function() {
          self.dispose(); // removes this Node from the scenegraph
        }
      };

      // scale the duration based on 'speed' query parameter
      options.duration = options.duration / EqualityExplorerQueryParameters.speed;

      // start animation, gradually fade out by modulating opacity
      var self = this;
      this.animation = new OpacityTo( this, options );
      this.animation.start( phet.joist.elapsedTime );
    }
  } );
} );
 