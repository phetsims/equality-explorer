// Copyright 2017-2018, University of Colorado Boulder

/**
 * The sole scene in the 'Numbers' screen.
 * This scene has constant terms only on both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerScene = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerScene' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function NumbersScene() {
    EqualityExplorerScene.call( this, [ new ConstantTermCreator() ], [ new ConstantTermCreator() ], {
      debugName: 'numbers'
    } );
  }

  equalityExplorer.register( 'NumbersScene', NumbersScene );

  return inherit( EqualityExplorerScene, NumbersScene );
} );
