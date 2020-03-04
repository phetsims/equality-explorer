// Copyright 2017-2020, University of Colorado Boulder

/**
 * Abstract base type for ScreenViews in the Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import SceneControl from './SceneControl.js';

class EqualityExplorerScreenView extends ScreenView {
  /**
   * @param {EqualityExplorerModel} model
   * @param {Object} [options]
   * @abstract
   */
  constructor( model, options ) {

    options = merge( {

      // {boolean}
      // true = positive and negative terms in the toolbox, e.g. x, -x, 1, -1
      // false = only positive terms in the toolbox, e.g. x, 1
      hasNegativeTermsInToolbox: true
    }, options );

    super();

    // @private state of the Equation accordion box is global to the Screen,
    // see https://github.com/phetsims/equality-explorer/issues/124
    this.equationAccordionBoxExpandedProperty =
      new BooleanProperty( EqualityExplorerConstants.EQUATION_ACCORDION_BOX_EXPANDED );

    // @private state of the Snapshots accordion box is global to the Screen,
    // see https://github.com/phetsims/equality-explorer/issues/124
    this.snapshotsAccordionBoxExpandedProperty =
      new BooleanProperty( EqualityExplorerConstants.SNAPSHOTS_ACCORDION_BOX_EXPANDED );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        phet.log && phet.log( 'ResetAllButton pressed' );
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    // @private {EqualityExplorerScene[]} create the view for each scene
    this.sceneNodes = [];
    model.scenes.forEach( scene => {
      const sceneNode = this.createSceneNode( scene, model.sceneProperty,
        this.equationAccordionBoxExpandedProperty,
        this.snapshotsAccordionBoxExpandedProperty,
        this.layoutBounds, {
          hasNegativeTermsInToolbox: options.hasNegativeTermsInToolbox
        } );
      this.sceneNodes.push( sceneNode );
      this.addChild( sceneNode );
    } );

    // If the model has more than 1 scene, create a control for scene selection.
    if ( model.scenes.length > 1 ) {

      // Get the bounds of the Snapshot accordion box, relative to this ScreenView
      const snapshotsAccordionBox = this.sceneNodes[ 0 ].snapshotsAccordionBox;

      // Center the scene control in the space below the Snapshots accordion box
      const sceneControl = new SceneControl( model.scenes, model.sceneProperty, {
        centerX: snapshotsAccordionBox.centerX,
        centerY: snapshotsAccordionBox.bottom + ( resetAllButton.top - snapshotsAccordionBox.bottom ) / 2
      } );
      this.addChild( sceneControl );
    }

    // Make the selected scene visible. unlink not needed.
    model.sceneProperty.link( scene => {
      for ( let i = 0; i < this.sceneNodes.length; i++ ) {
        this.sceneNodes[ i ].visible = ( this.sceneNodes[ i ].scene === scene );
      }
    } );
  }

  // @public
  reset() {
    this.equationAccordionBoxExpandedProperty.reset();
    this.snapshotsAccordionBoxExpandedProperty.reset();
    this.sceneNodes.forEach( sceneNode => {
      sceneNode.reset && sceneNode.reset();
    } );
  }

  /**
   * Animates the view.
   * @param {number} dt - elapsed time, in seconds
   * @public
   */
  step( dt ) {

    // animate the view for the selected scene
    for ( let i = 0; i < this.sceneNodes.length; i++ ) {
      const sceneNode = this.sceneNodes[ i ];
      if ( sceneNode.visible ) {
        sceneNode.step && sceneNode.step( dt );
        break;
      }
    }
  }

  /**
   * Creates the Node for this scene.
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected Scene
   * @param {BooleanProperty} equationAccordionBoxExpandedProperty
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @returns {Node}
   * @protected
   * @abstract
   */
  createSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
                   snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {
    throw new Error( 'createSceneNode must be implemented by subtype' );
  }
}

equalityExplorer.register( 'EqualityExplorerScreenView', EqualityExplorerScreenView );

export default EqualityExplorerScreenView;