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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VariablesAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariablesAccordionBox' );

  /**
   * @param {VariablesScene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function VariablesSceneNode( scene, sceneProperty, snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {

    options = _.extend( {

      // BasicsSceneNode options
      termsToolboxSpacing: 30 // horizontal spacing between terms in the toolbox
    }, options );

    // @private whether the Variables accordion box is expanded or collapsed
    this.variablesAccordionBoxExpandedProperty =
      new BooleanProperty( EqualityExplorerConstants.VARIABLES_ACCORDION_BOX_EXPANDED );

    // @private whether variable values are visible in snapshots
    this.variableValuesVisibleProperty = new BooleanProperty( true );

    assert && assert( !options.variableValuesVisibleProperty, 'VariablesSceneNode sets variableValuesVisibleProperty' );
    options.variableValuesVisibleProperty = this.variableValuesVisibleProperty;

    BasicsSceneNode.call( this, scene, sceneProperty, snapshotsAccordionBoxExpandedProperty, layoutBounds, options );

    // Variables accordion box, above the Snapshots accordion box
    var variablesAccordionBox = new VariablesAccordionBox( scene.variables, {
      expandedProperty: this.variablesAccordionBoxExpandedProperty,
      fixedWidth: this.snapshotsAccordionBox.width, // same width as Snapshots
      right: this.snapshotsAccordionBox.right,
      top: this.snapshotsAccordionBox.top
    } );
    this.addChild( variablesAccordionBox );
    variablesAccordionBox.moveToBack();

    // shift the Snapshots accordion box down
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