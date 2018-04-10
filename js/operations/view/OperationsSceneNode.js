// Copyright 2017-2018, University of Colorado Boulder

/**
 * View of a scene in the 'Operations' screen.
 * Like the scene in the 'Variables' screen, but with an added control for applying a universal operation.
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
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var UniversalOperationControl = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationControl' );
  var VariablesSceneNode = require( 'EQUALITY_EXPLORER/variables/view/VariablesSceneNode' );

  /**
   * @param {Scene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function OperationsSceneNode( scene, sceneProperty, layoutBounds, options ) {

    var self = this;

    options = _.extend( {
      organizeButtonVisible: false // like terms are combines, so the organize button is not relevant in this screen
    }, options );

    VariablesSceneNode.call( this, scene, sceneProperty, layoutBounds, options );

    // Layer when universal operation animation occurs
    var operationAnimationLayer = new Node();

    // @private Universal Operation, below Equation accordion box
    this.universalOperationControl = new UniversalOperationControl( scene, operationAnimationLayer, {
      centerX: scene.scale.location.x, // centered on the scale
      top: this.equationAccordionBox.bottom + 10
    } );
    this.addChild( this.universalOperationControl );
    this.universalOperationControl.moveToBack();

    // Put animation layer on top of everything
    this.addChild( operationAnimationLayer );

    // Perform sum-to-zero animation for any terms that became zero as the result of a universal operation.
    scene.sumToZeroEmitter.addListener(

      // @param {TermCreator[]} termCreators - term creators whose term summed to zero
      function( termCreators ) {

        for ( var i = 0; i < termCreators.length; i++ ) {

          var termCreator = termCreators[ i ];

          // determine where the cell that contained the term is currently located
          var cellCenter = termCreator.plate.getLocationOfCell( termCreator.likeTermsCell );

          // display the animation in that cell
          var sumToZeroNode = new SumToZeroNode( {
            variable: termCreator.variable || null,
            center: cellCenter,
            fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
          } );
          self.termsLayer.addChild( sumToZeroNode );
          sumToZeroNode.startAnimation();
        }
      } );
  }

  equalityExplorer.register( 'OperationsSceneNode', OperationsSceneNode );

  return inherit( VariablesSceneNode, OperationsSceneNode, {

    /**
     * @public
     * @override
     */
    reset: function() {

      // universal operation control has Properties and animations that may be in progress
      this.universalOperationControl.reset();

      VariablesSceneNode.prototype.reset.call( this );
    }
  } );
} );