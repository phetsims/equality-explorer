// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OperationNode = require( 'EQUALITY_EXPLORER/common/view/OperationNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {SolvingModel} model
   * @constructor
   */
  function SolvingScreenView( model ) {

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    // Universal Operation
    var operationNode = new OperationNode( model.operatorProperty, model.operandProperty, {
      center: this.layoutBounds.center
    } );
    this.addChild( operationNode );
  }

  equalityExplorer.register( 'SolvingScreenView', SolvingScreenView );

  return inherit( ScreenView, SolvingScreenView );
} );