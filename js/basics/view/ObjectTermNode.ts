// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays an ObjectTerm.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Font, HBox, HBoxOptions, Image, ImageOptions, Node, Text } from '../../../../scenery/js/imports.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import TermNode, { TermNodeOptions } from '../../common/view/TermNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectTerm from '../model/ObjectTerm.js';
import ObjectTermCreator from '../model/ObjectTermCreator.js';

// constants
const DEFAULT_COEFFICIENT_FONT = new PhetFont( 28 );
const ICON_SCALE_MULTIPLIER = 0.7; // use this to adjust size of icon relative to coefficient

type SelfOptions = EmptySelfOptions;

type ObjectTermNodeOptions = SelfOptions & TermNodeOptions;

export default class ObjectTermNode extends TermNode {

  public constructor( termCreator: ObjectTermCreator, term: ObjectTerm, providedOptions?: ObjectTermNodeOptions ) {

    const contentNode = ObjectTermNode.createInteractiveTermNode( term.variable.image, {
      maxHeight: term.diameter
    } );

    const shadowNode = new Image( term.variable.shadow, {
      maxHeight: term.diameter,
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    super( termCreator, term, contentNode, shadowNode, providedOptions );
  }

  /**
   * Creates the representation of an ObjectTerm that the user interacts with.
   */
  public static createInteractiveTermNode( image: HTMLImageElement, providedOptions?: InteractiveObjectTermNodeOptions ): Node {
    return new InteractiveObjectTermNode( image, providedOptions );
  }

  /**
   * Creates the representation of an ObjectTerm that is shown in equations.
   */
  public static createEquationTermNode( coefficient: number, icon: Node, providedOptions?: EquationObjectTermNodeOptions ): Node {
    return new EquationObjectTermNode( coefficient, icon, providedOptions );
  }
}

type InteractiveObjectTermNodeSelfOptions = EmptySelfOptions;
type InteractiveObjectTermNodeOptions = InteractiveObjectTermNodeSelfOptions & ImageOptions;

/**
 * The representation of a term that the user interacts with, in this case the object type's icon.
 * No coefficient is shown because every ObjectTerm has an implicit coefficient of 1.
 */
class InteractiveObjectTermNode extends Image {
  public constructor( image: HTMLImageElement, providedOptions?: InteractiveObjectTermNodeOptions ) {

    const options = optionize<InteractiveObjectTermNodeOptions, InteractiveObjectTermNodeSelfOptions, ImageOptions>()( {

      // ImageOptions
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    }, providedOptions );

    super( image, options );
  }
}

type EquationObjectTermNodeSelfOptions = {
  font?: Font;
};
type EquationObjectTermNodeOptions = EquationObjectTermNodeSelfOptions & StrictOmit<HBoxOptions, 'children'>;

/**
 * The representation of a term that is shown in equations.
 * Since every ObjectTerm has an implicit coefficient of 1, the coefficient is an integer.
 */
class EquationObjectTermNode extends HBox {
  public constructor( coefficient: number, icon: Node, providedOptions?: EquationObjectTermNodeOptions ) {

    const options = optionize<EquationObjectTermNodeOptions, EquationObjectTermNodeSelfOptions, HBoxOptions>()( {

      // EquationObjectTermNodeSelfOptions
      font: DEFAULT_COEFFICIENT_FONT,

      // HBoxOptions
      spacing: 2
    }, providedOptions );

    const coefficientNode = new Text( coefficient, { font: options.font } );

    const iconWrapper = new Node( {
      children: [ icon ],
      scale: ICON_SCALE_MULTIPLIER * coefficientNode.height / icon.height
    } );

    options.children = [ coefficientNode, iconWrapper ];

    super( options );
  }
}

equalityExplorer.register( 'ObjectTermNode', ObjectTermNode );