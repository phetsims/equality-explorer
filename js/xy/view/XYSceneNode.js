// Copyright 2017-2018, University of Colorado Boulder

/**
 * View of a scene in the 'Variables' screen.
 * Same as the 'Basics' screen, but with a control for changing the variable value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VariablesSceneNode = require( 'EQUALITY_EXPLORER/variables/view/VariablesSceneNode' );

  /**
   * @param {XYScene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function XYSceneNode( scene, sceneProperty, layoutBounds, options ) {

    options = _.extend( {
      termsToolboxContentSize: new Dimension2( 270, 50 ),
      termsToolboxSpacing: 12 // horizontal spacing between terms in the toolbox
    }, options );

    VariablesSceneNode.call( this, scene, sceneProperty, layoutBounds, options );
  }

  equalityExplorer.register( 'XYSceneNode', XYSceneNode );

  return inherit( VariablesSceneNode, XYSceneNode );
} );