// Copyright 2018-2024, University of Colorado Boulder

/**
 * Displays an ObjectTerm.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Font, HBox, HBoxOptions, Image, ImageOptions, Node, Text } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ObjectTerm from '../model/ObjectTerm.js';
import ObjectTermCreator from '../model/ObjectTermCreator.js';
import TermNode, { TermNodeOptions } from './TermNode.js';

// constants
const DEFAULT_COEFFICIENT_FONT = new PhetFont( 28 );
const ICON_SCALE_MULTIPLIER = 0.7; // use this to adjust size of icon relative to coefficient

type SelfOptions = EmptySelfOptions;

type ObjectTermNodeOptions = SelfOptions & TermNodeOptions;

export default class ObjectTermNode extends TermNode {

  public constructor( termCreator: ObjectTermCreator, term: ObjectTerm, providedOptions?: ObjectTermNodeOptions ) {

    const contentNode = ObjectTermNode.createInteractiveTermNode( term.objectVariable.image, {
      maxHeight: term.diameter
    } );

    const shadowNode = new Image( term.objectVariable.shadow, {
      maxHeight: term.diameter,
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    super( termCreator, term, contentNode, shadowNode, providedOptions );
  }

  /**
   * Creates the representation of an ObjectTerm that the user interacts with.
   */
  public static createInteractiveTermNode( image: HTMLImageElement, providedOptions?: InteractiveTermNodeOptions ): Node {
    //TODO https://github.com/phetsims/equality-explorer/issues/200 PhET-iO dynamic element
    return new InteractiveTermNode( image, providedOptions );
  }

  /**
   * Creates the representation of an ObjectTerm that is shown in equations.
   */
  public static createEquationTermNode( coefficient: number, icon: Node, providedOptions?: EquationTermNodeOptions ): Node {
    //TODO https://github.com/phetsims/equality-explorer/issues/200 PhET-iO dynamic element
    return new EquationTermNode( coefficient, icon, providedOptions );
  }
}

type InteractiveTermNodeSelfOptions = EmptySelfOptions;
type InteractiveTermNodeOptions = InteractiveTermNodeSelfOptions & ImageOptions;

/**
 * The representation of a term that the user interacts with, in this case the object type's icon.
 * No coefficient is shown because every ObjectTerm has an implicit coefficient of 1.
 */
class InteractiveTermNode extends Image {
  public constructor( image: HTMLImageElement, providedOptions?: InteractiveTermNodeOptions ) {

    const options = optionize<InteractiveTermNodeOptions, InteractiveTermNodeSelfOptions, ImageOptions>()( {

      // ImageOptions
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    }, providedOptions );

    super( image, options );
  }
}

type EquationTermNodeSelfOptions = {
  font?: Font;
};
type EquationTermNodeOptions = EquationTermNodeSelfOptions & StrictOmit<HBoxOptions, 'children'>;

/**
 * The representation of a term that is shown in equations.
 * Since every ObjectTerm has an implicit coefficient of 1, the coefficient is an integer.
 */
class EquationTermNode extends HBox {
  public constructor( coefficient: number, icon: Node, providedOptions?: EquationTermNodeOptions ) {

    const options = optionize<EquationTermNodeOptions, EquationTermNodeSelfOptions, HBoxOptions>()( {

      // EquationTermNodeSelfOptions
      font: DEFAULT_COEFFICIENT_FONT,

      // HBoxOptions
      spacing: 2
    }, providedOptions );

    const coefficientText = new Text( coefficient, { font: options.font } );

    const iconWrapper = new Node( {
      children: [ icon ],
      scale: ICON_SCALE_MULTIPLIER * coefficientText.height / icon.height
    } );

    options.children = [ coefficientText, iconWrapper ];

    super( options );
  }
}

equalityExplorer.register( 'ObjectTermNode', ObjectTermNode );