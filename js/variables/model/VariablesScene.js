// Copyright 2017, University of Colorado Boulder

/**
 * The sole scene in the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @constructor
   */
  function VariablesScene() {

    var self = this;

    // @public (read-only) range of variable 'x'
    this.xRange = EqualityExplorerConstants.X_RANGE;

    // @public (read-only) the value of the variable 'x'
    this.xProperty = new NumberProperty( this.xRange.defaultValue );

    // valid xProperty
    this.xProperty.link( function( x ) {
      assert && assert( self.xRange.contains( x ), 'x out of range: ' + x );
    } );

    Scene.call( this, 'variables',
      createItemCreators( this.xProperty, EqualityExplorerQueryParameters.leftVariables ),
      createItemCreators( this.xProperty, EqualityExplorerQueryParameters.rightVariables )
    );
  }

  equalityExplorer.register( 'VariablesScene', VariablesScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {Property.<number>} xProperty
   * @param {number} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( xProperty, numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 4 );

    var positiveXCreator = new ItemCreator( 'x', ItemIcons.POSITIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: xProperty.value,
      numberOfItemsOnScale: numberOfItemsOnScale[ 0 ],
      variableTerm: true
    } );

    var negativeXCreator = new ItemCreator( '-x', ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: -xProperty.value,
      numberOfItemsOnScale: numberOfItemsOnScale[ 1 ],
      variableTerm: true
    } );

    // unlink not needed
    xProperty.link( function( x ) {
      positiveXCreator.itemWeightProperty.value = x;
      negativeXCreator.itemWeightProperty.value = -x;
    } );

    return [
      positiveXCreator,
      negativeXCreator,
      new ItemCreator( '1', ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        weight: 1,
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ],
        constantTerm: true
      } ),
      new ItemCreator( '-1', ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        weight: -1,
        numberOfItemsOnScale: numberOfItemsOnScale[ 3 ],
        constantTerm: true
      } )
    ];
  }

  return inherit( Scene, VariablesScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xProperty.reset();
      Scene.prototype.reset.call( this );
    }
  } );
} );
