// Copyright 2018-2021, University of Colorado Boulder

/**
 * Displays the values of variables in parenthesis.
 * E.g. '(x = 2)' or '(x = 1, y = 3)' or (sphere = 2, square = 1, triangle = 4).
 * Used in Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariableNode from './VariableNode.js';

class VariableValuesNode extends HBox {

  /**
   * @param {Variable[]} variables
   * @param {Object} [options]
   */
  constructor( variables, options ) {

    options = merge( {
      fontSize: 28,
      commaSeparated: true,
      spacingInsideTerms: 3,
      spacingBetweenTerms: 15
    }, options );

    assert && assert( options.spacing === undefined, 'VariableValuesNode sets spacing' );
    options.spacing = 0;

    const font = new PhetFont( options.fontSize );

    const children = []; // {Node[]}

    // '(' with normal font
    const leftParenNode = new Text( '(', { font: font } );
    children.push( leftParenNode );

    // E.g. {{symbol}} = {{value}}, for each variable
    for ( let i = 0; i < variables.length; i++ ) {

      const variable = variables[ i ];

      children.push( new HBox( {
        spacing: options.spacingInsideTerms,
        children: [

          // variable
          new VariableNode( variable, {
            iconScale: 0.35,
            fontSize: options.fontSize
          } ),

          // =
          new Text( MathSymbols.EQUAL_TO, { font: font } ),

          // N
          new Text( `${variable.valueProperty.value}`, { font: font } )
        ]
      } ) );

      // comma + space separator
      if ( i < variables.length - 1 ) {
        if ( options.commaSeparated ) {
          children.push( new Text( ',', { font: font } ) );
        }
        children.push( new HStrut( options.spacingBetweenTerms ) );
      }
    }

    const rightParenNode = new Text( ')', { font: font } );
    children.push( rightParenNode );

    assert && assert( !options.children, 'VariableValuesNode sets children' );
    options.children = children;

    super( options );
  }
}

equalityExplorer.register( 'VariableValuesNode', VariableValuesNode );

export default VariableValuesNode;