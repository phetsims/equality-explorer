// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays the icon or symbol that represents a variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import { Image, Node, Text } from '../../../../scenery/js/imports.js';
import ObjectVariable from '../../basics/model/ObjectVariable.js';
import equalityExplorer from '../../equalityExplorer.js';

export default class VariableNode extends Node {

  /**
   * @param {Variable} variable
   * @param {Object} [options]
   */
  constructor( variable, options ) {

    options = merge( {
      iconScale: 1, // for variables that are displayed as an icon, e.g. apple, cat, coin
      fontSize: 24 // for variables that are displayed as a text symbol, e.g. 'x'
    }, options );

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

  // @public
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'VariableNode', VariableNode );