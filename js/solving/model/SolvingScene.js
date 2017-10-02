// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with VariablesScene
/**
 * The sole scene in the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var Property = require( 'AXON/Property' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @constructor
   */
  function SolvingScene() {

    // @public (read-only) the value of the variable 'x'
    this.xProperty = new Property( EqualityExplorerConstants.X_RANGE.defaultValue );

    // @public (read-only) operator and operand for 'universal operation'
    this.operatorProperty = new Property( EqualityExplorerConstants.PLUS );
    this.operandProperty = new Property( 1 );

    Scene.call( this, 'solving', createItemCreators( this.xProperty ), createItemCreators( this.xProperty ) );
  }

  equalityExplorer.register( 'SolvingScene', SolvingScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {Property.<number>} xProperty
   * @returns {ItemCreator[]}
   */
  function createItemCreators( xProperty ) {

    var positiveXCreator = new ItemCreator( 'x', xProperty.value, ItemIcons.POSITIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      variableTerm: true
    } );
    var negativeXCreator = new ItemCreator( '-x', -xProperty.value, ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      variableTerm: true
    } );

    // unlink not needed
    xProperty.link( function( x ) {
      positiveXCreator.weightProperty.value = x;
      negativeXCreator.weightProperty.value = -x;
    } );

    return [
      positiveXCreator,
      negativeXCreator,
      new ItemCreator( '1', 1, ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        constantTerm: true
      } ),
      new ItemCreator( '-1', -1, ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        constantTerm: true
      } )
    ];
  }

  return inherit( Scene, SolvingScene, {

    // @public
    reset: function() {
      this.xProperty.reset();
      this.operatorProperty.reset();
      this.operandProperty.reset();
      Scene.prototype.reset.call( this );
    }
  } );
} );
