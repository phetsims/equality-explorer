// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  /**
   * @constructor
   */
  function VariablesModel() {

    // @public
    this.variableAccordionBoxExpandedProperty = new Property( true ); //TODO move to view

    // @public (read-only)
    this.variableRange = new RangeWithValue( -40, 40, 1 );

    // @public
    this.variableValueProperty = new Property( this.variableRange.defaultValue );
  }

  equalityExplorer.register( 'VariablesModel', VariablesModel );

  return inherit( Object, VariablesModel, {

    // @public resets the model
    reset: function() {
      this.variableAccordionBoxExpandedProperty.reset();
      this.variableValueProperty.reset();
    },

    // @public
    step: function( dt ) {
      //TODO implement step
    }
  } );
} );