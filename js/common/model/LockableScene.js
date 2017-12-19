// Copyright 2017, University of Colorado Boulder

/**
 * Base type for a "lockable" scene.
 * A lockable scene is one in which the left and right sides can be locked together,
 * so that an action on one side is balanced by an equivalent action on the opposite side.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @param {string} debugName - internal name, not displayed to the user
   * @param {AbstractItemCreator[]} leftItemCreators - in the order that they appear in the left panel and left side of equations
   * @param {AbstractItemCreator[]} rightItemCreators - in the order that they appear in the right panel and right side of equations
   * @param {Object} [options]
   * @constructor
   */
  function LockableScene( debugName, leftItemCreators, rightItemCreators, options ) {

    Scene.call( this, debugName, leftItemCreators, rightItemCreators, options );

    // @public whether the 2 sides of the equation are locked
    this.lockedProperty = new BooleanProperty( false );

    var i; // hoist loop variable explicitly

    assert && assert( leftItemCreators.length === rightItemCreators.length,
      'must have same number of item creators on left and right' );

    // Associate each item creator with its equivalent item creator on the opposite side of the scale.
    for ( i = 0; i < leftItemCreators.length; i++ ) {
      assert && assert( leftItemCreators[ i ].isEquivalentTo( rightItemCreators[ i ] ),
        'equivalent item creators must have the same indices on both sides' );
      leftItemCreators[ i ].equivalentItemCreator = rightItemCreators[ i ];
      rightItemCreators[ i ].equivalentItemCreator = leftItemCreators[ i ];
    }

    // Associate each item creator with its inverse creator on the opposite side of the scale.
    assert && assert( leftItemCreators.length % 2 === 0,
      'scene must have an even number of item creators per side' );
    for ( i = 0; i < leftItemCreators.length; i = i + 2 ) {

      assert && assert( leftItemCreators[ i ].isInverseOf( rightItemCreators[ i + 1 ] ),
        'equivalent item creators must have specific indices' );
      leftItemCreators[ i ].inverseItemCreator = rightItemCreators[ i + 1 ];
      rightItemCreators[ i + 1 ].inverseItemCreator = leftItemCreators[ i ];

      assert && assert( leftItemCreators[ i + 1 ].isInverseOf( rightItemCreators[ i ] ),
        'equivalent item creators must have specific indices' );
      leftItemCreators[ i + 1 ].inverseItemCreator = rightItemCreators[ i ];
      rightItemCreators[ i ].inverseItemCreator = leftItemCreators[ 1 + 1 ];

    }
  }

  equalityExplorer.register( 'LockableScene', LockableScene );

  return inherit( Scene, LockableScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.lockedProperty.reset();
      Scene.prototype.reset.call( this );
    }
  } );
} );

