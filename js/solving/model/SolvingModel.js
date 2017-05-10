// Copyright 2017, University of Colorado Boulder

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

  /**
   * @constructor
   */
  function SolvingModel() {

    // @public
    this.operatorProperty = new Property( EqualityExplorerConstants.PLUS );
    this.operandProperty = new Property( 1 );
  }

  equalityExplorer.register( 'SolvingModel', SolvingModel );

  return inherit( Object, SolvingModel, {

    // @public resets the model
    reset: function() {
      this.operatorProperty.reset();
      this.operandProperty.reset();
    },

    // @public
    step: function( dt ) {
      //TODO implement step
    }
  } );
} );