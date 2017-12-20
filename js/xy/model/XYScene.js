// Copyright 2017, University of Colorado Boulder

/**
 * The sole scene in the 'x & y' screen.
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
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var LockableScene = require( 'EQUALITY_EXPLORER/common/model/LockableScene' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var VariableItemCreator = require( 'EQUALITY_EXPLORER/common/model/VariableItemCreator' );
  var VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );
  var yString = 'y'; // i18n not required, this is a test string

  // constants
  // y, -y and their shadow. These nodes are reused using scenery's DAG feature.
  var POSITIVE_Y_NODE = new VariableNode( yString, {
    fill: 'rgb( 250, 100, 255 )',
    maxHeight: ItemIcons.ICON_HEIGHT
  } );
  var NEGATIVE_Y_NODE = new VariableNode( '-' + yString, {
    fill: 'rgb( 240, 140, 255 )',
    lineDash: [ 4, 4 ],
    maxHeight: ItemIcons.ICON_HEIGHT
  } );
  var Y_SHADOW_NODE = new Rectangle( 0, 0, ItemIcons.ICON_HEIGHT, ItemIcons.ICON_HEIGHT, {
    fill: 'black',
    maxHeight: ItemIcons.ICON_HEIGHT
  } );
  
  /**
   * @constructor
   */
  function XYScene() {

    // @public (read-only) range of variable 'x'
    this.xRange = EqualityExplorerConstants.X_RANGE;

    // @public (read-only) the value of the variable 'x'
    this.xProperty = new NumberProperty( this.xRange.defaultValue, {
      range: this.xRange,
      valueType: 'Integer'
    } );

    // @public (read-only) range of variable 'x'
    this.yRange = EqualityExplorerConstants.X_RANGE; // same as 'x'

    // @public (read-only) the value of the variable 'x'
    this.yProperty = new NumberProperty( this.yRange.defaultValue, {
      range: this.yRange,
      valueType: 'Integer'
    } );

    // Use the same query parameters as 'Variables' screen to pre-populate the scale
    LockableScene.call( this, 'xy',
      createItemCreators( this.xProperty, this.yProperty, EqualityExplorerQueryParameters.leftVariables ),
      createItemCreators( this.xProperty, this.yProperty, EqualityExplorerQueryParameters.rightVariables )
    );
  }

  equalityExplorer.register( 'XYScene', XYScene );

  /**
   * Creates the item creators for this scene.
   * @param {NumberProperty} xProperty
   * @param {NumberProperty} yProperty
   * @param {number} initialNumberOfItemsOnScale
   * @returns {AbstractItemCreator[]}
   */
  function createItemCreators( xProperty, yProperty, initialNumberOfItemsOnScale ) {
    assert && assert( initialNumberOfItemsOnScale.length === 4 );
    var index = 0;

    var positiveXCreator = new VariableItemCreator( xString, ItemIcons.POSITIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: xProperty.value,
      initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
    } );

    var negativeXCreator = new VariableItemCreator( xString, ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: -positiveXCreator.weight,
      sign: -positiveXCreator.sign,
      initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
    } );

    var positiveYCreator = new VariableItemCreator( yString, POSITIVE_Y_NODE, Y_SHADOW_NODE, {
      weight: yProperty.value,
      initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
    } );

    var negativeYCreator = new VariableItemCreator( yString, NEGATIVE_Y_NODE, Y_SHADOW_NODE, {
      weight: -positiveXCreator.weight,
      sign: -positiveXCreator.sign,
      initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
    } );

    // unlink unnecessary
    xProperty.lazyLink( function( x ) {
      positiveXCreator.weightProperty.value = x;
      negativeXCreator.weightProperty.value = -x;
    } );

    // unlink unnecessary
    yProperty.lazyLink( function( y ) {
      positiveYCreator.weightProperty.value = y;
      negativeYCreator.weightProperty.value = -y;
    } );

    return [
      positiveXCreator,
      negativeXCreator,
      positiveYCreator,
      negativeYCreator
    ];
  }

  return inherit( LockableScene, XYScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xProperty.reset();
      this.yProperty.reset();
      LockableScene.prototype.reset.call( this );
    },

    /**
     * Saves a snapshot of the scene. Restore is handled by the snapshot.
     * @returns {SnapshotWithVariable}
     * @public
     * @override
     */
    save: function() {
      return new SnapshotWithVariable( this );
    }
  } );
} );
