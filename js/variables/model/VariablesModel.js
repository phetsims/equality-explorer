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
  var VariablesScene = require( 'EQUALITY_EXPLORER/variables/model/VariablesScene' );

  /**
   * @constructor
   */
  function VariablesModel() {

    // @public (read-only)
    this.variableRange = new RangeWithValue( -40, 40, 1 );

    // @public
    this.variableValueProperty = new Property( this.variableRange.defaultValue );

    // @public (read-only)
    this.scene = new VariablesScene();

    //TODO make this go away
    // @public
    this.sceneProperty = new Property( this.scene );
    this.sceneProperty.lazyLink( function( scene ) {
      throw new Error( 'sceneProperty should never change, there is only 1 scene' );
    } );
  }

  equalityExplorer.register( 'VariablesModel', VariablesModel );

  return inherit( Object, VariablesModel, {

    // @public resets the model
    reset: function() {
      this.variableValueProperty.reset();
    },

    // @public
    step: function( dt ) {
      //TODO implement step
    }
  } );
} );