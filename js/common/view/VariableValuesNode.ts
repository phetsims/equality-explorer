// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays the values of variables in parenthesis.
 * E.g. '(x = 2)' or '(x = 1, y = 3)' or (sphere = 2, square = 1, triangle = 4).
 * Used in Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, HBoxOptions, HStrut, Node, Text } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import Variable from '../model/Variable.js';
import VariableNode from './VariableNode.js';

type SelfOptions = {
  fontSize?: number;
  commaSeparated?: boolean;
  spacingInsideTerms?: number;
  spacingBetweenTerms?: number;
};

type VariableValuesNodeOptions = SelfOptions &
  PickOptional<HBoxOptions, 'opacity' | 'scale' | 'visibleProperty'> &
  PickRequired<HBoxOptions, 'tandem'>;

export default class VariableValuesNode extends HBox {

  private readonly disposeVariableValuesNode: () => void;

  /**
   * @param variables - in the order that they appear, from left to right
   * @param providedOptions
   */
  public constructor( variables: Variable[], providedOptions?: VariableValuesNodeOptions ) {

    const options = optionize<VariableValuesNodeOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      fontSize: 28,
      commaSeparated: true,
      spacingInsideTerms: 3,
      spacingBetweenTerms: 15,

      // HBoxOptions
      // De-emphasize variable values by scaling them down.
      // See https://github.com/phetsims/equality-explorer/issues/110
      scale: 0.75

    }, providedOptions );

    assert && assert( options.spacing === undefined, 'VariableValuesNode sets spacing' );
    options.spacing = 0;

    const font = new PhetFont( options.fontSize );

    const children: Node[] = [];
    const disposeNodes: Node[] = []; // Nodes that will need to be disposed

    // '(' with normal font
    const leftParenText = new Text( '(', { font: font } );
    children.push( leftParenText );

    // E.g. {{symbol}} = {{value}}, for each variable
    for ( let i = 0; i < variables.length; i++ ) {

      const variable = variables[ i ];

      const variableNode = new VariableNode( variable, {
        iconScale: 0.35,
        fontSize: options.fontSize
      } );
      disposeNodes.push( variableNode ); // because variableNode may be linked to a StringProperty

      children.push( new HBox( {
        spacing: options.spacingInsideTerms,
        children: [

          // variable
          variableNode,

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

    const rightParenText = new Text( ')', { font: font } );
    children.push( rightParenText );

    options.children = children;

    super( options );

    this.disposeVariableValuesNode = () => {
      disposeNodes.forEach( node => node.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeVariableValuesNode();
    super.dispose();
  }
}

equalityExplorer.register( 'VariableValuesNode', VariableValuesNode );