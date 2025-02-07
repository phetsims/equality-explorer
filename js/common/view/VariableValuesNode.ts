// Copyright 2018-2023, University of Colorado Boulder

/**
 * Displays the values of variables in parenthesis.
 * E.g. '(x = 2)' or '(x = 1, y = 3)' or (sphere = 2, square = 1, triangle = 4).
 * This is used for snapshots, so the displayed value does not update when the variable's value changes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Font from '../../../../scenery/js/util/Font.js';
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

  private readonly variables: Variable[];
  private readonly font: Font;
  private readonly fontSize: number;
  private readonly commaSeparated: boolean;
  private readonly spacingInsideTerms: number;
  private readonly spacingBetweenTerms: number;
  private readonly disposeNodes: Node[]; // Nodes that need to be disposed

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
      scale: 0.75,
      spacing: 0,
      isDisposable: false

    }, providedOptions );

    super( options );

    this.variables = variables;
    this.font = new PhetFont( options.fontSize );
    this.fontSize = options.fontSize;
    this.commaSeparated = options.commaSeparated;
    this.spacingInsideTerms = options.spacingInsideTerms;
    this.spacingBetweenTerms = options.spacingBetweenTerms;
    this.disposeNodes = [];

    this.update();
  }

  public update(): void {

    this.disposeNodes.forEach( node => node.dispose() );
    this.disposeNodes.length = 0;

    const children: Node[] = [];

    // '(' with normal font
    const leftParenText = new Text( '(', { font: this.font } );
    children.push( leftParenText );

    // E.g. {{symbol}} = {{value}}, for each variable
    for ( let i = 0; i < this.variables.length; i++ ) {

      const variable = this.variables[ i ];

      const variableNode = new VariableNode( variable, {
        iconScale: 0.35,
        fontSize: this.fontSize
      } );
      this.disposeNodes.push( variableNode ); // because variableNode may be linked to a StringProperty

      children.push( new HBox( {
        spacing: this.spacingInsideTerms,
        children: [

          // variable
          variableNode,

          // =
          new Text( MathSymbols.EQUAL_TO, { font: this.font } ),

          // N
          new Text( `${variable.valueProperty.value}`, { font: this.font } )
        ]
      } ) );

      // comma + space separator
      if ( i < this.variables.length - 1 ) {
        if ( this.commaSeparated ) {
          children.push( new Text( ',', { font: this.font } ) );
        }
        children.push( new HStrut( this.spacingBetweenTerms ) );
      }
    }

    const rightParenText = new Text( ')', { font: this.font } );
    children.push( rightParenText );

    this.children = children;
  }
}

equalityExplorer.register( 'VariableValuesNode', VariableValuesNode );