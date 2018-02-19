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
  var LockableScene = require( 'EQUALITY_EXPLORER/common/model/LockableScene' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var TermIcons = require( 'EQUALITY_EXPLORER/common/view/TermIcons' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );
  var yString = 'y'; // i18n not required, this is a test string

  // constants
  // y, -y and their shadow. These nodes are reused using scenery's DAG feature.
  // If y were ever added to a production screen, these should be moved to TermIcons.
  var POSITIVE_Y_NODE = new VariableTermNode( yString, {
    fill: 'rgb( 250, 100, 255 )',
    lineDash: EqualityExplorerConstants.POSITIVE_VARIABLE_LINE_DASH,
    maxHeight: TermIcons.ICON_HEIGHT
  } );
  var NEGATIVE_Y_NODE = new VariableTermNode( '-' + yString, {
    fill: 'rgb( 240, 140, 255 )',
    lineDash: EqualityExplorerConstants.NEGATIVE_VARIABLE_LINE_DASH,
    maxHeight: TermIcons.ICON_HEIGHT
  } );
  var Y_SHADOW_NODE = new Rectangle( 0, 0, TermIcons.ICON_HEIGHT, TermIcons.ICON_HEIGHT, {
    fill: 'black',
    maxHeight: TermIcons.ICON_HEIGHT
  } );
  
  /**
   * @constructor
   */
  function XYScene() {

    // @public (read-only) range of variables
    this.xRange = EqualityExplorerConstants.VARIABLE_RANGE;
    this.yRange = EqualityExplorerConstants.VARIABLE_RANGE;

    // @public values of the variables
    this.xProperty = new NumberProperty( this.xRange.defaultValue, {
      range: this.xRange,
      valueType: 'Integer'
    } );
    this.yProperty = new NumberProperty( this.yRange.defaultValue, {
      range: this.yRange,
      valueType: 'Integer'
    } );

    // Use the same query parameters as 'Variables' screen to pre-populate the scale
    LockableScene.call( this, 'xy',
      createTermCreators( this.xProperty, this.yProperty, EqualityExplorerQueryParameters.leftVariables ),
      createTermCreators( this.xProperty, this.yProperty, EqualityExplorerQueryParameters.rightVariables )
    );
  }

  equalityExplorer.register( 'XYScene', XYScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} xProperty
   * @param {NumberProperty} yProperty
   * @param {number} initialNumberOfTermsOnScale
   * @returns {TermCreator[]}
   */
  function createTermCreators( xProperty, yProperty, initialNumberOfTermsOnScale ) {
    assert && assert( initialNumberOfTermsOnScale.length === 4 );
    var index = 0;

    var positiveXCreator = new VariableTermCreator( xString, TermIcons.POSITIVE_X_NODE, TermIcons.X_SHADOW_NODE, {
      weight: xProperty.value,
      initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
    } );

    var negativeXCreator = new VariableTermCreator( xString, TermIcons.NEGATIVE_X_NODE, TermIcons.X_SHADOW_NODE, {
      weight: -positiveXCreator.weight,
      sign: -positiveXCreator.sign,
      initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
    } );

    var positiveYCreator = new VariableTermCreator( yString, POSITIVE_Y_NODE, Y_SHADOW_NODE, {
      weight: yProperty.value,
      initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
    } );

    var negativeYCreator = new VariableTermCreator( yString, NEGATIVE_Y_NODE, Y_SHADOW_NODE, {
      weight: -positiveXCreator.weight,
      sign: -positiveXCreator.sign,
      initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
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
