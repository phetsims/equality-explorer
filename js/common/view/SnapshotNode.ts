// Copyright 2022-2023, University of Colorado Boulder

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
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Snapshot from '../model/Snapshot.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';

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
  PickRequired<FlowBoxOptions, 'orientation' | 'tandem'>;

export default class SnapshotNode extends FlowBox {

  public constructor( snapshotProperty: Property<Snapshot | null>,
                      scene: EqualityExplorerScene,
                      providedOptions: SnapshotNodeOptions ) {

    const options = optionize<SnapshotNodeOptions, SelfOptions, FlowBoxOptions>()( {

      // SelfOptions
      commaSeparated: true,
      variableValuesOpacity: 1,
      variableValuesVisibleProperty: null,

      // FlowBoxOptions
      pickable: false,
      visibleProperty: new DerivedProperty( [ snapshotProperty ], snapshot => ( snapshot !== null ) )
    }, providedOptions );

    assert && assert( options.variableValuesOpacity > 0 && options.variableValuesOpacity <= 1 );

    options.spacing = ( options.orientation === 'horizontal' ) ? 20 : 8;

    const children: Node[] = [];

    // It's unfortunate that EquationNode is not created from snapshotProperty. But creating it from what's
    // currently on the balance scale allows us to reuse the same code that displays the equation for the
    // balance scale. And the end result is correct.
    const equationNode = new EquationNode( scene.leftTermCreators, scene.rightTermCreators, {
      updateEnabled: false, // equation is static, call equationNode.update when snapshotProperty changes!
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
    let variableValuesNode: VariableValuesNode;
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

    // Because we created equationNode with updateEnabled: false, the equation does not automatically
    // synchronize with what's on the balance scale, and we need to explicitly request an update.
    snapshotProperty.link( snapshot => {
      if ( snapshot !== null ) {
        equationNode.update();
        variableValuesNode && variableValuesNode.update();
      }
    } );

    this.addLinkedElement( snapshotProperty );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'SnapshotNode', SnapshotNode );