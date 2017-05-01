// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EquationAccordionBox = require( 'EQUALITY_EXPLORER/common/view/EquationAccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );
  var VariableAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariableAccordionBox' );

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function EqualityExplorerSceneNode( scene, layoutBounds, options ) {

    options = options || {};

    var snapshotsAccordionBox = new SnapshotsAccordionBox( {
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var variableAccordionBox = new VariableAccordionBox( scene.variableValueProperty, scene.variableRange, {
      top: snapshotsAccordionBox.bottom + 10,
      right: snapshotsAccordionBox.right
    } );

    var equationAccordionBox = new EquationAccordionBox( {
      centerX: ( snapshotsAccordionBox.right - layoutBounds.left ) / 2,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ snapshotsAccordionBox, variableAccordionBox, equationAccordionBox ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'EqualityExplorerSceneNode', EqualityExplorerSceneNode );

  return inherit( Node, EqualityExplorerSceneNode );
} );
