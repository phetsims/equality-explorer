// Copyright 2017-2022, University of Colorado Boulder

/**
 * Abstract base type for displaying scenes in Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import { Node } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import SumToZeroNode from './SumToZeroNode.js';

export default class EqualityExplorerSceneNode extends Node {

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
   * @param {Node} termsLayer - parent for all TermNodes
   * @param {Object} [options]
   * @abstract
   */
  constructor( scene, sceneProperty, termsLayer, options ) {

    super();

    // @public (read-only)
    this.scene = scene;

    // @private
    this.termsLayer = termsLayer;

    /**
     * When a term is created in the model, create the corresponding view.
     * @param {TermCreator} termCreator
     * @param {Term} term
     * @param {SceneryEvent|null} event - event is non-null when the term was created via user interaction
     */
    const termCreatedListener = ( termCreator, term, event ) => {

      // create a TermNode
      const termNode = termCreator.createTermNode( term );
      termsLayer.addChild( termNode );

      // Clean up when the term is disposed. Term.dispose handles removal of this listener.
      term.disposedEmitter.addListener( term => termNode.dispose() );

      // start a drag cycle by forwarding the event to termNode.
      if ( event ) {
        termNode.startDrag( event );
      }
    };

    // When the maxInteger limit is exceeded, dispose of all terms that are not on the scale, and display a dialog.
    let dialog = null; // dialog will be reused
    const maxIntegerExceededListener = () => {
      phet.log && phet.log( 'maxInteger exceeded' );
      scene.disposeTermsNotOnScale();
      dialog = dialog || new OopsDialog( EqualityExplorerStrings.numberTooBigStringProperty );
      dialog.show();
    };

    scene.allTermCreators.forEach( termCreator => {
      termCreator.termCreatedEmitter.addListener( termCreatedListener ); // removeListener not needed
      termCreator.maxIntegerExceededEmitter.addListener( maxIntegerExceededListener ); // removeListener not needed
    } );

    this.mutate( options );
  }

  /**
   * Performs sum-to-zero animation for terms that have summed to zero.
   * Intended to be used in screens where like terms are combined in one cell on the scale,
   * and that involve applying universal operations.  Because universal operations may result
   * in more than one term summing to zero, we need to perform sum-to-zero animations after
   * the operation has been applied to all terms, so that the scale is in its final position.
   *
   * @param {TermCreator[]} termCreators - term creators whose term summed to zero
   * @public
   */
  animateSumToZero( termCreators ) {

    for ( let i = 0; i < termCreators.length; i++ ) {

      const termCreator = termCreators[ i ];

      assert && assert( termCreator.combineLikeTermsEnabled,
        'animateSumToZero should only be used when combineLikeTermsEnabled' );

      // determine where the cell that contained the term is currently located
      const cellCenter = termCreator.plate.getPositionOfCell( termCreator.likeTermsCell );

      // display the animation in that cell
      const sumToZeroNode = new SumToZeroNode( {
        variable: termCreator.variable || null,
        fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE,
        center: cellCenter
      } );
      this.termsLayer.addChild( sumToZeroNode );
      sumToZeroNode.startAnimation();
    }
  }
}

equalityExplorer.register( 'EqualityExplorerSceneNode', EqualityExplorerSceneNode );