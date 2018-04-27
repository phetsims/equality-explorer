// Copyright 2017-2018, University of Colorado Boulder

/**
 * Base type for displaying scenes in Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OopsDialog = require( 'EQUALITY_EXPLORER/common/view/OopsDialog' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );

  // string
  var numberTooBigString = require( 'string!EQUALITY_EXPLORER/numberTooBig' );

  /**
   * @param {Scene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Node} termsLayer - parent for all TermNodes
   * @param {Object} [options]
   * @constructor
   */
  function SceneNode( scene, sceneProperty, termsLayer, options ) {

    // @public (read-only)
    this.scene = scene;

    // @private
    this.termsLayer = termsLayer;

    /**
     * When a term is created in the model, create the corresponding view.
     * @param {TermCreator} termCreator
     * @param {Term} term
     * @param {Event|null} event - event is non-null when the term was created via user interaction
     */
    var termCreatedListener = function( termCreator, term, event ) {

      // create a TermNode
      var termNode = termCreator.createTermNode( term );
      termsLayer.addChild( termNode );

      // Clean up when the term is disposed. Term.dispose handles removal of this listener.
      term.disposedEmitter.addListener( function( term ) {
        termNode.dispose();
      } );

      // start a drag cycle by forwarding the event to termNode.
      if ( event ) {
        termNode.startDrag( event );
      }
    };

    // When the maxInteger limit is exceeded, dispose of all terms that are not on the scale, and display a dialog.
    var dialog = null; // dialog will be reused
    var maxIntegerExceededListener = function() {
      phet.log && phet.log( 'maxInteger exceeded' );
      scene.disposeTermsNotOnScale();
      dialog = dialog || new OopsDialog( numberTooBigString );
      dialog.show();
    };

    scene.allTermCreators.forEach( function( termCreator ) {
      termCreator.termCreatedEmitter.addListener( termCreatedListener ); // removeListener not needed
      termCreator.maxIntegerExceededEmitter.addListener( maxIntegerExceededListener ); // removeListener not needed
    } );

    Node.call( this, options );
  }

  equalityExplorer.register( 'SceneNode', SceneNode );

  return inherit( Node, SceneNode, {

    /**
     * Performs sum-to-zero animation for terms that have summed to zero.
     * @param {TermCreator[]} termCreators - term creators whose term summed to zero
     * @public
     */
    animateSumToZero: function( termCreators ) {

      for ( var i = 0; i < termCreators.length; i++ ) {

        var termCreator = termCreators[ i ];

        assert && assert( termCreator.combineLikeTermsEnabled,
          'animateSumToZero should only be used when combineLikeTermsEnabled' );

        // determine where the cell that contained the term is currently located
        var cellCenter = termCreator.plate.getLocationOfCell( termCreator.likeTermsCell );

        // display the animation in that cell
        var sumToZeroNode = new SumToZeroNode( {
          variable: termCreator.variable || null,
          center: cellCenter,
          fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
        } );
        this.termsLayer.addChild( sumToZeroNode );
        sumToZeroNode.startAnimation();
      }
    }
  } );
} );
