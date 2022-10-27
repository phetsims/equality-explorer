// Copyright 2022, University of Colorado Boulder

//TODO big problem: SnapshotNode (view) does not use Snapshot (model)
/**
 * SnapshotNode is the view of a snapshot, with optional values for the variables that appear in that snapshot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { FlowBox, FlowBoxOptions, Node } from '../../../../scenery/js/imports.js';
import EquationNode from './EquationNode.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';
import VariableValuesNode from './VariableValuesNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import equalityExplorer from '../../equalityExplorer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

const EQUATION_FONT_SIZE = 22;
const FRACTION_FONT_SIZE = 14;

type SelfOptions = {

  // are variable values separated by commas?
  commaSeparated?: boolean;

  // (0,1], see https://github.com/phetsims/equality-explorer/issues/113
  variableValuesOpacity?: number;

  // whether variable values are visible in snapshots, null mean this feature is not used
  variableValuesVisibleProperty?: TReadOnlyProperty<boolean> | null;
};

type SnapshotNodeOptions = SelfOptions &
  PickOptional<FlowBoxOptions, 'maxWidth' | 'maxHeight'> &
  PickRequired<FlowBoxOptions, 'orientation'>;

export default class SnapshotNode extends FlowBox {

  private readonly disposeSnapshotNode: () => void;

  public constructor( scene: EqualityExplorerScene, providedOptions: SnapshotNodeOptions ) {

    const options = optionize<SnapshotNodeOptions, SelfOptions, FlowBoxOptions>()( {

      // SelfOptions
      commaSeparated: true,
      variableValuesOpacity: 1,
      variableValuesVisibleProperty: null,

      // FlowBoxOptions
      pickable: false,
      tandem: Tandem.OPTIONAL //TODO make tandem required in SnapshotNodeOptions
    }, providedOptions );

    assert && assert( options.variableValuesOpacity > 0 && options.variableValuesOpacity <= 1 );

    options.spacing = ( options.orientation === 'horizontal' ) ? 20 : 8;

    const children: Node[] = [];

    const equationNode = new EquationNode( scene.leftTermCreators, scene.rightTermCreators, {
      updateEnabled: false, // equation is static
      symbolFontSize: EQUATION_FONT_SIZE,
      operatorFontSize: EQUATION_FONT_SIZE,
      integerFontSize: EQUATION_FONT_SIZE,
      fractionFontSize: FRACTION_FONT_SIZE,
      relationalOperatorFontSize: EQUATION_FONT_SIZE,
      relationalOperatorSpacing: 15,
      pickable: false,
      tandem: options.tandem.createTandem( 'equationNode' )
    } );
    children.push( equationNode );

    // optionally show variable values, e.g. '(x = 2)' or '(x = 1, y = 3)'
    let variableValuesNode: Node;
    if ( scene.variables && options.variableValuesVisibleProperty ) {
      variableValuesNode = new VariableValuesNode( scene.variables, {
        commaSeparated: options.commaSeparated,
        fontSize: EQUATION_FONT_SIZE,
        opacity: options.variableValuesOpacity,
        visibleProperty: options.variableValuesVisibleProperty,
        tandem: options.tandem.createTandem( 'variableValuesNode' )
      } );
      children.push( variableValuesNode );
    }

    options.children = children;

    super( options );

    this.disposeSnapshotNode = () => {
      children.forEach( child => child.dispose() );
    };
  }

  //TODO should SnapshotNode be allocated statically, then make dispose fail?
  public override dispose(): void {
    this.disposeSnapshotNode();
    super.dispose();
  }
}

equalityExplorer.register( 'SnapshotNode', SnapshotNode );