// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScene = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerScene' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @constructor
   */
  function BasicsModel() {

    // @public
    this.scenes = [
      new EqualityExplorerScene( new Text( '1', { font: new PhetFont( 30 ) } ) ),
      new EqualityExplorerScene( new Text( '2', { font: new PhetFont( 30 ) } ) ),
      new EqualityExplorerScene( new Text( '3', { font: new PhetFont( 30 ) } ) )
    ];

    // @public
    this.sceneProperty = new Property( this.scenes[ 0 ] );
  }

  equalityExplorer.register( 'BasicsModel', BasicsModel );

  return inherit( Object, BasicsModel, {

    // @public resets the model
    reset: function() {
      this.scene.reset();
    },

    //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle model animation here.
    }
  } );
} );