// Copyright 2017-2019, University of Colorado Boulder

/**
 * A '0' or '0x' (with optional halo) that fades out.
 * Used to indicate that 1 and -1, or x and -x, have summed to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const Easing = require( 'TWIXT/Easing' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function SumToZeroNode( options ) {

    const self = this;

    options = merge( {
      variable: null, // {Variable|null} determines whether we render '0' or '0x' (for example)
      haloRadius: 20,
      haloBaseColor: 'transparent', // no visible halo, set this if you want to see the halo
      fontSize: EqualityExplorerConstants.SUM_TO_ZERO_SMALL_FONT_SIZE
    }, options );

    const zeroNode = new Text( '0', {
      font: new PhetFont( options.fontSize )
    } );

    let contentNode = null;
    if ( options.variable ) {

      const symbolNode = new Text( options.variable.symbol, {
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

    const haloNode = new HaloNode( options.haloRadius, {
      baseColor: options.haloBaseColor,
      center: contentNode.center
    } );

    assert && assert( !options.children, 'SumToZeroNode sets children' );
    options.children = [ haloNode, contentNode ];

    Node.call( this, options );

    // Property to be animated
    const opacityProperty = new NumberProperty( this.opacity );

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
 