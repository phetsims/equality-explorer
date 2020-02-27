// Copyright 2018-2019, University of Colorado Boulder

/**
 * Displays the icon or symbol that represents a variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ObjectVariable from '../../basics/model/ObjectVariable.js';
import equalityExplorer from '../../equalityExplorer.js';

/**
 * @param {Variable} variable
 * @param {Object} [options]
 * @constructor
 */
function VariableNode( variable, options ) {

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
    symbolNode = new Text( variable.symbol, {
      font: new MathSymbolFont( options.fontSize )
    } );
  }

  assert && assert( !options.children, 'VariableNode sets children' );
  options.children = [ symbolNode ];

  Node.call( this, options );
}

equalityExplorer.register( 'VariableNode', VariableNode );

inherit( Node, VariableNode );
export default VariableNode;