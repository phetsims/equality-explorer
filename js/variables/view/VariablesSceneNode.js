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
  var BasicsSceneNode = require( 'EQUALITY_EXPLORER/basics/view/BasicsSceneNode' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VariablesAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariablesAccordionBox' );

  /**
   * @param {VariablesScene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function VariablesSceneNode( scene, sceneProperty, layoutBounds, options ) {

    options = _.extend( {
      termsToolboxSpacing: 30 // horizontal spacing between terms in the toolbox
    }, options );

    // @private whether the Variable accordion box is expanded or collapsed
    this.variablesAccordionBoxExpandedProperty = new BooleanProperty( true );

    // @private whether variable values are visible in snapshots
    this.variableValuesVisibleProperty = new BooleanProperty( true );

    assert && assert( !options.variableValuesVisibleProperty, 'VariablesSceneNode sets variableValuesVisibleProperty' );
    options.variableValuesVisibleProperty = this.variableValuesVisibleProperty;

    BasicsSceneNode.call( this, scene, sceneProperty, layoutBounds, options );

    // Variables accordion box, above the Snapshots accordion box
    var variablesAccordionBox = new VariablesAccordionBox( scene.variables, {
      expandedProperty: this.variablesAccordionBoxExpandedProperty,
      fixedWidth: this.snapshotsAccordionBox.width, // same width as Snapshots
      right: this.snapshotsAccordionBox.right,
      top: this.snapshotsAccordionBox.top
    } );
    this.addChild( variablesAccordionBox );
    variablesAccordionBox.moveToBack();
    this.snapshotsAccordionBox.top = variablesAccordionBox.bottom + 10;
  }

  equalityExplorer.register( 'VariablesSceneNode', VariablesSceneNode );

  return inherit( BasicsSceneNode, VariablesSceneNode, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.variablesAccordionBoxExpandedProperty.reset();
      this.variableValuesVisibleProperty.reset();
      BasicsSceneNode.prototype.reset.call( this );
    }
  } );
} );