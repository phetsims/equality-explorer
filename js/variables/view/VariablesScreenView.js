// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var VariablesSceneNode = require( 'EQUALITY_EXPLORER/variables/view/VariablesSceneNode' );

  /**
   * @param {VariablesModel} model
   * @constructor
   */
  function VariablesScreenView( model ) {

    EqualityExplorerScreenView.call( this, model );

    // @private
    this.sceneNode = new VariablesSceneNode( model.scene, new Property( model.scene ), this.layoutBounds );
    this.addChild( this.sceneNode );
  }

  equalityExplorer.register( 'VariablesScreenView', VariablesScreenView );

  return inherit( EqualityExplorerScreenView, VariablesScreenView, {

    /**
     * Resets things that are specific to the view.
     * @public
     */
    reset: function() {
      this.sceneNode.reset();
    }
  } );
} );