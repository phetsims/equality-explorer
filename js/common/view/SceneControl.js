// Copyright 2017, University of Colorado Boulder

/**
 * Radio buttons for selecting a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @param {Scene[]} scenes
   * @param {Property.<Scene>} sceneProperty
   * @param {Object} [options]
   * @constructor
   */
  function SceneControl( scenes, sceneProperty, options ) {

    options = _.extend( {

      // supertype options
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 8,
      buttonContentXMargin: 15,
      buttonContentYMargin: 12
    }, options );

    // describe a radio button for each scene
    var contentArray = [];
    scenes.forEach( function( scene ) {
      assert && assert( scene.icon, 'scene must have an icon' );
      contentArray.push( {
        value: scene,
        node: new Node( { children: [ scene.icon ] } ) // wrap the icon since we're using scenery DAG feature
      } );
    } );

    RadioButtonGroup.call( this, sceneProperty, contentArray, options );
  }

  equalityExplorer.register( 'SceneControl', SceneControl );

  return inherit( RadioButtonGroup, SceneControl );
} );
