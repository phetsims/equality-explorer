// Copyright 2017-2018, University of Colorado Boulder

/**
 * A '0' or '0x' (with optional halo) that fades out.
 * Used to indicate that 1 and -1, or x and -x, have summed to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OpacityTo = require( 'TWIXT/OpacityTo' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function SumToZeroNode( options ) {

    options = _.extend( {
      symbol: null, // optional symbol that appears after the '0', e.g. '0x'
      haloRadius: 20,
      haloBaseColor: 'transparent', // no visible halo, set this if you want to see the halo
      fontSize: EqualityExplorerConstants.SUM_TO_ZERO_SMALL_FONT_SIZE
    }, options );

    var zeroNode = new Text( '0', {
      font: new PhetFont( options.fontSize )
    } );

    var contentNode = null;
    if ( options.symbol ) {

      var symbolNode = new Text( options.symbol, {
        font: new MathSymbolFont( options.fontSize )
      } );
      
      contentNode = new HBox( {
        spacing: 0,
        children: [ zeroNode, symbolNode ] // e.g. '0x'
      } );
    }
    else {

      // no symbol, just show '0'
      contentNode = zeroNode;
    }

    var haloNode = new HaloNode( options.haloRadius, {
      baseColor: options.haloBaseColor,
      center: contentNode.center
    } );

    assert && assert( !options.children, 'SumToZeroNode sets children' );
    options.children = [ haloNode, contentNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'SumToZeroNode', SumToZeroNode );

  return inherit( Node, SumToZeroNode, {

    /**
     * Starts the animation.
     * @public
     */
    startAnimation: function() {

      var self = this;

      var options = {
        startOpacity: 1,
        endOpacity: 0,
        duration: 750, // fade out time, ms
        easing: TWEEN.Easing.Quintic.In, // most of opacity change happens at end of duration
        onStart: function() {
          self.visible = true; // in case a client has set this Node invisible
        },
        onComplete: function() {
          self.dispose(); // removes this Node from the scenegraph
        }
      };

      // start animation, gradually fade out by modulating opacity
      var animation = new OpacityTo( this, options );
      animation.start( phet.joist.elapsedTime );
    }
  } );
} );
 