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
  var Animation = require( 'TWIXT/Animation' );
  var Easing = require( 'TWIXT/Easing' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function SumToZeroNode( options ) {

    var self = this;

    options = _.extend( {
      variable: null, // {Variable|null} determines whether we render '0' or '0x' (for example)
      haloRadius: 20,
      haloBaseColor: 'transparent', // no visible halo, set this if you want to see the halo
      fontSize: EqualityExplorerConstants.SUM_TO_ZERO_SMALL_FONT_SIZE
    }, options );

    var zeroNode = new Text( '0', {
      font: new PhetFont( options.fontSize )
    } );

    var contentNode = null;
    if ( options.variable ) {

      var symbolNode = new Text( options.variable.symbol, {
        font: new MathSymbolFont( options.fontSize )
      } );

      contentNode = new HBox( {
        spacing: 0,
        children: [ zeroNode, symbolNode ] // e.g. '0x'
      } );
    }
    else {

      // no variable, just show '0'
      contentNode = zeroNode;
    }
    contentNode.maxWidth = 2 * options.haloRadius;

    var haloNode = new HaloNode( options.haloRadius, {
      baseColor: options.haloBaseColor,
      center: contentNode.center
    } );

    assert && assert( !options.children, 'SumToZeroNode sets children' );
    options.children = [ haloNode, contentNode ];

    Node.call( this, options );

    // Property to be animated
    var opacityProperty = new NumberProperty( this.opacity );

    // unlink not needed
    opacityProperty.link( function( opacity ) {
      self.opacity = opacity;
    } );

    // @private
    this.animation = new Animation( {
      duration: 0.75,
      targets: [ {
        property: opacityProperty,
        easing: Easing.QUINTIC_IN,
        to: 0
      } ]
    } );

    // removeListener not needed
    this.animation.finishEmitter.addListener( function() {
      self.dispose(); // removes this Node from the scenegraph
    } );
  }

  equalityExplorer.register( 'SumToZeroNode', SumToZeroNode );

  return inherit( Node, SumToZeroNode, {

    /**
     * Starts the animation.
     * @public
     */
    startAnimation: function() {
      this.animation.start();
    }
  } );
} );
 