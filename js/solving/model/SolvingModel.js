// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with VariablesModel
/**
 * Model for the 'Solving' screen.
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
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var SolvingScene = require( 'EQUALITY_EXPLORER/solving/model/SolvingScene' );

  /**
   * @constructor
   */
  function SolvingModel() {

    // @public
    this.operatorProperty = new Property( EqualityExplorerConstants.PLUS );
    this.operandProperty = new Property( 1 );

    // @public (read-only)
    this.variableRange = new RangeWithValue( -40, 40, 1 );

    // @public
    this.variableValueProperty = new Property( this.variableRange.defaultValue );

    // @public (read-only)
    this.scene = new SolvingScene();

    //TODO make this go away
    // @public
    this.sceneProperty = new Property( this.scene );
    this.sceneProperty.lazyLink( function( scene ) {
      throw new Error( 'sceneProperty should never change, there is only 1 scene' );
    } );
  }

  equalityExplorer.register( 'SolvingModel', SolvingModel );

  return inherit( Object, SolvingModel, {

    // @public resets the model
    reset: function() {
      this.operatorProperty.reset();
      this.operandProperty.reset();
      this.variableValueProperty.reset();
      this.scene.reset();
    },

    // @public
    step: function( dt ) {
      this.scene.step( dt );
    }
  } );
} );