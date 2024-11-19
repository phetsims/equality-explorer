// Copyright 2017-2024, University of Colorado Boulder

/**
 * A '0' or '0x' (with optional halo) that fades out.
 * Used to indicate that 1 and -1, or x and -x, have summed to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, NodeOptions, NodeTranslationOptions, TColor, Text } from '../../../../scenery/js/imports.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import TermCreator from '../model/TermCreator.js';
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
    const opacityProperty = new NumberProperty( this.opacity, {
      range: new Range( 0, 1 )
    } );

    opacityProperty.link( opacity => {
      this.opacity = opacity;
    } );

    //TODO https://github.com/phetsims/equality-explorer/issues/197 stateful animation?
    this.animation = new Animation( {
      duration: 0.75,
      targets: [ {
        property: opacityProperty,
        easing: Easing.QUINTIC_IN,
        to: 0
      } ]
    } );

    // removes this Node from the scene graph
    this.animation.finishEmitter.addListener( () => this.dispose() );

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

  /**
   * Performs sum-to-zero animation for terms that have summed to zero.
   * Intended to be used in screens where like terms are combined in one cell on the scale,
   * and that involve applying universal operations.  Because universal operations may result
   * in more than one term summing to zero, we need to perform sum-to-zero animations after
   * the operation has been applied to all terms, so that the scale is in its final position.
   * @param termCreators - term creators whose term summed to zero
   * @param termsLayer
   */
  public static animateSumToZero( termCreators: TermCreator[], termsLayer: Node ): void {

    for ( let i = 0; i < termCreators.length; i++ ) {

      const termCreator = termCreators[ i ];

      assert && assert( termCreator.combineLikeTermsEnabled,
        'animateSumToZero should only be used when combineLikeTermsEnabled' );

      const likeTermsCell = termCreator.likeTermsCell!;
      assert && assert( likeTermsCell !== null );

      // determine where the cell that contained the term is currently located
      const cellCenter = termCreator.plate.getPositionOfCell( likeTermsCell );

      // display the animation in that cell
      const sumToZeroNode = new SumToZeroNode( {
        variable: termCreator.variable,
        fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE,
        center: cellCenter
      } );
      termsLayer.addChild( sumToZeroNode );
      sumToZeroNode.startAnimation();
    }
  }
}

equalityExplorer.register( 'SumToZeroNode', SumToZeroNode );