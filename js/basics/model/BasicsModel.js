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

      //TODO temporary icons
      new EqualityExplorerScene( new Text( '1', { font: new PhetFont( 30 ) } ) ),
      new EqualityExplorerScene( new Text( '2', { font: new PhetFont( 30 ) } ) ),
      new EqualityExplorerScene( new Text( '3', { font: new PhetFont( 30 ) } ) )
    ];

    // @public the selected scene
    this.sceneProperty = new Property( this.scenes[ 0 ] );
  }

  equalityExplorer.register( 'BasicsModel', BasicsModel );

  return inherit( Object, BasicsModel, {

    // @public resets the model
    reset: function() {
      for ( var i = 0; i < this.scenes.length; i++ ) {
        this.scenes[ i ].reset();
      }
      this.sceneProperty.reset();
    },

    /**
     * Updates time-dependent parts of the model.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {

      //TODO is this an appropriate value?
      dt = Math.min( dt, 0.1 );

      // step the selected scene
      for ( var i = 0; i < this.categories.length; i++ ) {
        if ( this.scenes[ i ] === this.sceneProperty.value ) {
          this.scenes[ i ].step( dt );
          break;
        }
      }
    }
  } );
} );