// Copyright 2018-2024, University of Colorado Boulder

/**
 * Displays the icon or symbol that represents a variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectVariable from '../model/ObjectVariable.js';
import Variable from '../model/Variable.js';

type SelfOptions = {
  iconScale?: number; // for variables that are displayed as an icon, e.g. apple, cat, coin
  fontSize?: number; // for variables that are displayed as a text symbol, e.g. 'x'
};

type VariableNodeOptions = SelfOptions;

export default class VariableNode extends Node {

  private readonly disposeVariableNode: () => void;

  public constructor( variable: Variable, providedOptions?: VariableNodeOptions ) {

    const options = optionize<VariableNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      iconScale: 1,
      fontSize: 24
    }, providedOptions );

    let symbolNode: Node;
    if ( variable instanceof ObjectVariable ) {

      // use an image for a variable associated with a real-world object
      symbolNode = new Image( variable.image, {
        scale: options.iconScale
      } );
    }
    else {

      // use text for a symbolic variable, e.g 'x'
      symbolNode = new Text( variable.symbolProperty, {
        font: new MathSymbolFont( options.fontSize )
      } );
    }

    options.children = [ symbolNode ];

    super( options );

    this.disposeVariableNode = () => {
      symbolNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposeVariableNode();
    super.dispose();
  }
}

equalityExplorer.register( 'VariableNode', VariableNode );