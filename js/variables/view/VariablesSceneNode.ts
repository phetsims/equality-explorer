// Copyright 2017-2022, University of Colorado Boulder

/**
 * View of a scene in the 'Variables' screen.
 * Same as the 'Basics' screen, but with a control for changing the variable value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import BasicsSceneNode, { BasicsSceneNodeOptions } from '../../basics/view/BasicsSceneNode.js';
import VariablesAccordionBox from '../../common/view/VariablesAccordionBox.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = EmptySelfOptions;

export type VariablesSceneNodeOptions = SelfOptions & BasicsSceneNodeOptions;

export default class VariablesSceneNode extends BasicsSceneNode {

  // whether the Variables accordion box is expanded or collapsed
  private readonly variablesAccordionBoxExpandedProperty: Property<boolean>;

  // whether variable values are visible in snapshots
  private readonly variableValuesVisibleProperty: Property<boolean>;

  public constructor( scene: EqualityExplorerScene,
                      equationAccordionBoxExpandedProperty: Property<boolean>,
                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                      layoutBounds: Bounds2,
                      providedOptions?: VariablesSceneNodeOptions ) {

    const options = optionize<VariablesSceneNodeOptions, SelfOptions, BasicsSceneNodeOptions>()( {

      // BasicsSceneNode options
      termsToolboxSpacing: 30 // horizontal spacing between terms in the toolbox
    }, providedOptions );

    // whether variable values are visible in snapshots
    const variableValuesVisibleProperty = new BooleanProperty( true );

    assert && assert( !options.variableValuesVisibleProperty, 'VariablesSceneNode sets variableValuesVisibleProperty' );
    options.variableValuesVisibleProperty = variableValuesVisibleProperty;

    super( scene, equationAccordionBoxExpandedProperty, snapshotsAccordionBoxExpandedProperty, layoutBounds, options );

    this.variablesAccordionBoxExpandedProperty = new BooleanProperty( true );

    const variables = scene.variables!;
    assert && assert( variables );

    // Variables accordion box, above the Snapshots accordion box
    const variablesAccordionBox = new VariablesAccordionBox( variables, {
      expandedProperty: this.variablesAccordionBoxExpandedProperty,
      fixedWidth: this.snapshotsAccordionBox.width, // same width as Snapshots
      right: this.snapshotsAccordionBox.right,
      top: this.snapshotsAccordionBox.top
    } );
    this.addChild( variablesAccordionBox );
    variablesAccordionBox.moveToBack();

    // shift the Snapshots accordion box down
    this.snapshotsAccordionBox.top = variablesAccordionBox.bottom + 10;

    this.variableValuesVisibleProperty = variableValuesVisibleProperty;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    this.variablesAccordionBoxExpandedProperty.reset();
    this.variableValuesVisibleProperty.reset();
    super.reset();
  }
}

equalityExplorer.register( 'VariablesSceneNode', VariablesSceneNode );