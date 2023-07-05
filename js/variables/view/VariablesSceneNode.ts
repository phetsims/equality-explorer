// Copyright 2017-2023, University of Colorado Boulder

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
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

export type VariablesSceneNodeOptions = SelfOptions & StrictOmit<BasicsSceneNodeOptions, 'variableValuesVisibleProperty'>;

export default class VariablesSceneNode extends BasicsSceneNode {

  // whether variable values are visible in snapshots
  private readonly variableValuesVisibleProperty: Property<boolean>;

  // whether the Variables accordion box is expanded or collapsed
  private readonly variablesAccordionBoxExpandedProperty: Property<boolean>;

  public constructor( scene: EqualityExplorerScene,
                      equationAccordionBoxExpandedProperty: Property<boolean>,
                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                      layoutBounds: Bounds2,
                      providedOptions: VariablesSceneNodeOptions ) {

    const options = optionize<VariablesSceneNodeOptions, SelfOptions, BasicsSceneNodeOptions>()( {

      // BasicsSceneNode options
      termsToolboxSpacing: 30 // horizontal spacing between terms in the toolbox
    }, providedOptions );

    const variableValuesVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'variableValuesVisibleProperty' )
    } );
    options.variableValuesVisibleProperty = variableValuesVisibleProperty;

    super( scene, equationAccordionBoxExpandedProperty, snapshotsAccordionBoxExpandedProperty, layoutBounds, options );

    const variables = scene.variables!;
    assert && assert( variables && variables.length > 0 );

    this.variableValuesVisibleProperty = variableValuesVisibleProperty;
    this.variablesAccordionBoxExpandedProperty = new BooleanProperty( true, {

      // singular vs plural tandem name, to match VariablesAccordionBox title
      tandem: ( variables.length === 1 ) ?
              options.tandem.createTandem( 'variableAccordionBoxExpandedProperty' ) :
              options.tandem.createTandem( 'variablesAccordionBoxExpandedProperty' )
    } );

    // Variables accordion box, above the Snapshots accordion box
    const variablesAccordionBox = new VariablesAccordionBox( variables, {
      expandedProperty: this.variablesAccordionBoxExpandedProperty,
      fixedWidth: this.snapshotsAccordionBox.width, // same width as Snapshots
      right: this.snapshotsAccordionBox.right,
      top: this.snapshotsAccordionBox.top,

      // singular vs plural tandem name, to match VariablesAccordionBox title
      tandem: ( variables.length === 1 ) ?
              options.tandem.createTandem( 'variableAccordionBox' ) :
              options.tandem.createTandem( 'variablesAccordionBox' )
    } );
    this.addChild( variablesAccordionBox );
    variablesAccordionBox.moveToBack();

    const snapshotsAccordionBoxTop = this.snapshotsAccordionBox.top; // save the original position
    variablesAccordionBox.visibleProperty.link( visible => {
      if ( visible ) {
        // shift the Snapshots accordion box down
        this.snapshotsAccordionBox.top = variablesAccordionBox.bottom + 10;
      }
      else {
        this.snapshotsAccordionBox.top = snapshotsAccordionBoxTop;
      }
    } );
  }

  public override reset(): void {
    this.variablesAccordionBoxExpandedProperty.reset();
    this.variableValuesVisibleProperty.reset();
    super.reset();
  }
}

equalityExplorer.register( 'VariablesSceneNode', VariablesSceneNode );