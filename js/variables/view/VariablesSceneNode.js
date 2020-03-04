// Copyright 2017-2020, University of Colorado Boulder

/**
 * View of a scene in the 'Variables' screen.
 * Same as the 'Basics' screen, but with a control for changing the variable value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import BasicsSceneNode from '../../basics/view/BasicsSceneNode.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import VariablesAccordionBox from '../../common/view/VariablesAccordionBox.js';
import equalityExplorer from '../../equalityExplorer.js';

class VariablesSceneNode extends BasicsSceneNode {

  /**
   * @param {VariablesScene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {BooleanProperty} equationAccordionBoxExpandedProperty
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( scene, sceneProperty, equationAccordionBoxExpandedProperty,
               snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {

    options = merge( {

      // BasicsSceneNode options
      termsToolboxSpacing: 30 // horizontal spacing between terms in the toolbox
    }, options );

    // whether variable values are visible in snapshots
    const variableValuesVisibleProperty = new BooleanProperty( true );

    assert && assert( !options.variableValuesVisibleProperty, 'VariablesSceneNode sets variableValuesVisibleProperty' );
    options.variableValuesVisibleProperty = variableValuesVisibleProperty;

    super( scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );

    // @private whether the Variables accordion box is expanded or collapsed
    this.variablesAccordionBoxExpandedProperty =
      new BooleanProperty( EqualityExplorerConstants.VARIABLES_ACCORDION_BOX_EXPANDED );

    // Variables accordion box, above the Snapshots accordion box
    const variablesAccordionBox = new VariablesAccordionBox( scene.variables, {
      expandedProperty: this.variablesAccordionBoxExpandedProperty,
      fixedWidth: this.snapshotsAccordionBox.width, // same width as Snapshots
      right: this.snapshotsAccordionBox.right,
      top: this.snapshotsAccordionBox.top
    } );
    this.addChild( variablesAccordionBox );
    variablesAccordionBox.moveToBack();

    // shift the Snapshots accordion box down
    this.snapshotsAccordionBox.top = variablesAccordionBox.bottom + 10;

    // @private
    this.variableValuesVisibleProperty = variableValuesVisibleProperty;
  }

  /**
   * @public
   */
  reset() {
    this.variablesAccordionBoxExpandedProperty.reset();
    this.variableValuesVisibleProperty.reset();
  }
}

equalityExplorer.register( 'VariablesSceneNode', VariablesSceneNode );

export default VariablesSceneNode;