// Copyright 2017-2022, University of Colorado Boulder

/**
 * A '0' or '0x' (with optional halo) that fades out.
 * Used to indicate that 1 and -1, or x and -x, have summed to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, NodeOptions, NodeTranslationOptions, TColor, Text } from '../../../../scenery/js/imports.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import Variable from '../model/Variable.js';
import HaloNode from './HaloNode.js';

type SelfOptions = {
  variable?: Variable | null; // determines whether we render '0' or '0x' (for example)
  haloRadius?: number;
  haloBaseColor?: TColor; // no visible halo, set this if you want to see the halo
  fontSize?: number;
};

type SumToZeroNodeOptions = SelfOptions & NodeTranslationOptions;

export default class SumToZeroNode extends Node {

  private animation: Animation;
  private readonly disposeSumToZeroNode: () => void;

  public constructor( providedOptions?: SumToZeroNodeOptions ) {

    const options = optionize<SumToZeroNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      variable: null,
      haloRadius: 20,
      haloBaseColor: 'transparent',
      fontSize: EqualityExplorerConstants.SUM_TO_ZERO_SMALL_FONT_SIZE
    }, providedOptions );

    const zeroText = new Text( '0', {
      font: new PhetFont( options.fontSize )
    } );

    let contentNode: Node;
    let symbolText: Node;
    if ( options.variable ) {

      symbolText = new Text( options.variable.symbolProperty, {
        font: new MathSymbolFont( options.fontSize )
      } );

      contentNode = new HBox( {
        spacing: 0,
        children: [ zeroText, symbolText ] // e.g. '0x'
      } );
    }
    else {

      // no variable, just show '0'
      contentNode = zeroText;
    }
    contentNode.maxWidth = 2 * options.haloRadius;

    const haloNode = new HaloNode( options.haloRadius, {
      baseColor: options.haloBaseColor,
      center: contentNode.center
    } );

    options.children = [ haloNode, contentNode ];

    super( options );

    // Property to be animated
    const opacityProperty = new NumberProperty( this.opacity );

    // unlink not needed
    opacityProperty.link( opacity => {
      this.opacity = opacity;
    } );

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

    this.disposeSumToZeroNode = () => {
      symbolText && symbolText.dispose();
    };
  }

  public override dispose(): void {
    this.disposeSumToZeroNode();
    super.dispose();
  }

  /**
   * Starts the animation.
   */
  public startAnimation(): void {
    this.animation.start();
  }
}

equalityExplorer.register( 'SumToZeroNode', SumToZeroNode );