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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var VariableAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariableAccordionBox' );

  /**
   * @param {VariablesModel} model
   * @constructor
   */
  function VariablesScreenView( model ) {

    var self = this;

    ScreenView.call( this );

    // @private
    this.variableAccordionBoxExpandedProperty = new Property( true );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        self.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    var variableAccordionBox = new VariableAccordionBox( model.variableValueProperty, model.variableRange, {
      expandedProperty: this.variableAccordionBoxExpandedProperty,
      center: this.layoutBounds.center
    } );
    this.addChild( variableAccordionBox );
  }

  equalityExplorer.register( 'VariablesScreenView', VariablesScreenView );

  return inherit( ScreenView, VariablesScreenView, {

    // @public
    reset: function() {
      this.variableAccordionBoxExpandedProperty.reset();
    }
  } );
} );