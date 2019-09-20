// Copyright 2017-2019, University of Colorado Boulder

/**
 * Radio buttons for selecting a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @param {EqualityExplorerScene[]} scenes - the scene choices
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the scene that is currently selected
   * @param {Object} [options]
   * @constructor
   */
  function SceneControl( scenes, sceneProperty, options ) {

    options = _.extend( {

      // RadioButtonGroup options
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 8,
      buttonContentXMargin: 15,
      buttonContentYMargin: 12
    }, options );

    // describe a radio button for each scene
    const contentArray = [];
    scenes.forEach( function( scene ) {
      assert && assert( scene.icon, 'scene must have an icon' );
      contentArray.push( {
        value: scene,
        node: scene.icon
      } );
    } );

    RadioButtonGroup.call( this, sceneProperty, contentArray, options );
  }

  equalityExplorer.register( 'SceneControl', SceneControl );

  return inherit( RadioButtonGroup, SceneControl );
} );
