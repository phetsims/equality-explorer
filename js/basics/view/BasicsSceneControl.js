// Copyright 2017, University of Colorado Boulder

/**
 * Radio buttons for selecting a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @param {BasicsScene[]} scenes
   * @param {Property.<BasicsScene>} sceneProperty
   * @param {Object} [options]
   * @constructor
   */
  function BasicsSceneControl( scenes, sceneProperty, options ) {

    options = _.extend( {

      // RadioButtonGroup options
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 12,
      buttonContentXMargin: 15,
      buttonContentYMargin: 12
    }, options );

    // describe a radio button for each scene
    var contentArray = [];
    scenes.forEach( function( scene ) {
      contentArray.push( {
        value: scene,
        node: scene.icon
      } );
    } );

    RadioButtonGroup.call( this, sceneProperty, contentArray, options );
  }

  equalityExplorer.register( 'BasicsSceneControl', BasicsSceneControl );

  return inherit( RadioButtonGroup, BasicsSceneControl );
} );
