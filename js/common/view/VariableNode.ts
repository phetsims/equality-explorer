// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays the icon or symbol that represents a variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import { Image, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import ObjectVariable from '../../basics/model/ObjectVariable.js';
import equalityExplorer from '../../equalityExplorer.js';
import Variable from '../model/Variable.js';

type SelfOptions = {
  iconScale?: number; // for variables that are displayed as an icon, e.g. apple, cat, coin
  fontSize?: number; // for variables that are displayed as a text symbol, e.g. 'x'
};

type VariableNodeOptions = SelfOptions;

export default class VariableNode extends Node {

  public constructor( variable: Variable, providedOptions?: VariableNodeOptions ) {

    const options = optionize<VariableNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      iconScale: 1,
      fontSize: 24
    }, providedOptions );

    let symbolNode;
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

    assert && assert( !options.children, 'VariableNode sets children' );
    options.children = [ symbolNode ];

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'VariableNode', VariableNode );