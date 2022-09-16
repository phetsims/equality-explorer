// Copyright 2017-2022, University of Colorado Boulder

/**
 * Fixed-size panel that displays an equation or inequality.
 * The equation is scaled to fix the panel.
 * The equation's relational operator remains horizontally centered in the panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import TermCreator from '../model/TermCreator.js';
import EquationNode, { EquationNodeOptions } from './EquationNode.js';

type SelfOptions = {

  // this panel is designed to be a fixed size, regardless of its content
  contentWidth?: number;
  contentHeight?: number;

  // options passed to EquationNode constructor
  equationNodeOptions?: EquationNodeOptions;
};

type EquationPanelOptions = SelfOptions;

export default class EquationPanel extends Panel {

  /**
   * @param leftTermCreators - left side of equation
   * @param rightTermCreators - right side of equation
   * @param [providedOptions]
   */
  public constructor( leftTermCreators: TermCreator[], rightTermCreators: TermCreator[], providedOptions?: EquationPanelOptions ) {

    const options = optionize<EquationPanelOptions, StrictOmit<SelfOptions, 'equationNodeOptions'>, PanelOptions>()( {

      // SelfOptions
      contentWidth: 100,
      contentHeight: 60,

      // PanelOptions
      fill: null,
      stroke: null,
      resize: false,
      cornerRadius: EqualityExplorerConstants.PANEL_CORNER_RADIUS,
      xMargin: 5,
      yMargin: 5

    }, providedOptions );

    // use an invisible rectangle to enforce fixed content size, stroke 'red' with ?dev
    const invisibleRectangle = new Rectangle( 0, 0, options.contentWidth, options.contentHeight );

    const equationNode = new EquationNode( leftTermCreators, rightTermCreators, options.equationNodeOptions );

    // wrapper to avoid exceeding stack size when bounds of equationNode changes
    const equationParent = new Node( { children: [ equationNode ] } );

    // off is not needed
    equationNode.boundsProperty.lazyLink( () => {

      // Compute the scale required to keep the equation centered on the relational operator.
      // This is more complicated than setting maxWidth because the equation's relation operator is
      // centered in the panel, and only one side of the equation may get too wide.
      // equationNode.x is the center of the equation's relational operator.
      const maxSideWidth = options.contentWidth / 2;
      const leftSideOverflow = Math.max( 0, equationNode.x - equationNode.left - maxSideWidth );
      const rightSideOverflow = Math.max( 0, equationNode.right - equationNode.x - maxSideWidth );
      const maxOverflow = Math.max( leftSideOverflow, rightSideOverflow );
      const xScale = maxSideWidth / ( maxSideWidth + maxOverflow );

      // vertical scale
      const yScale = options.contentHeight / equationNode.height;

      // Scale and center the parent
      equationParent.setScaleMagnitude( Math.min( xScale, yScale ) );
      equationParent.x = invisibleRectangle.centerX;
      equationParent.centerY = invisibleRectangle.centerY;
    } );

    const contentNode = new Node( {
      children: [ invisibleRectangle, equationParent ]
    } );

    super( contentNode, options );
  }
}

equalityExplorer.register( 'EquationPanel', EquationPanel );