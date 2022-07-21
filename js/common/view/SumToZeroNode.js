// Copyright 2017-2022, University of Colorado Boulder

/**
 * A '0' or '0x' (with optional halo) that fades out.
 * Used to indicate that 1 and -1, or x and -x, have summed to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import HaloNode from './HaloNode.js';

class SumToZeroNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

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

    super( options );

    // Property to be animated
    const opacityProperty = new NumberProperty( this.opacity );

    // unlink not needed
    opacityProperty.link( opacity => {
      this.opacity = opacity;
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
    this.animation.finishEmitter.addListener( () => this.dispose() ); // removes this Node from the scenegraph
  }

  /**
   * Starts the animation.
   * @public
   */
  startAnimation() {
    this.animation.start();
  }
}

equalityExplorer.register( 'SumToZeroNode', SumToZeroNode );

export default SumToZeroNode;