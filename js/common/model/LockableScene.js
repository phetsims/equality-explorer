// Copyright 2017-2018, University of Colorado Boulder

/**
 * Base type for a scene that supports the 'lock' feature.
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
   * @param {TermCreator[]} leftTermCreators - in the order that they appear in the left toolbox and left side of equations
   * @param {TermCreator[]} rightTermCreators - in the order that they appear in the right toolbox and right side of equations
   * @param {Object} [options]
   * @constructor
   */
  function LockableScene( debugName, leftTermCreators, rightTermCreators, options ) {

    Scene.call( this, debugName, leftTermCreators, rightTermCreators, options );

    // @public whether the 2 sides of the equation are locked
    this.lockedProperty = new BooleanProperty( false );

    assert && assert( leftTermCreators.length === rightTermCreators.length,
      'must have same number of term creators on left and right' );

    for ( var i = 0; i < leftTermCreators.length; i++ ) {

      // These term creators are lockable, so initialize lockedProperty
      leftTermCreators[ i ].lockedProperty = this.lockedProperty;
      rightTermCreators[ i ].lockedProperty = this.lockedProperty;

      // Associate term creator with its equivalent term creator on the opposite side of the scale.
      assert && assert( leftTermCreators[ i ].isEquivalentTo( rightTermCreators[ i ] ),
        'equivalent term creators must have the same indices on both sides' );
      leftTermCreators[ i ].equivalentTermCreator = rightTermCreators[ i ];
      rightTermCreators[ i ].equivalentTermCreator = leftTermCreators[ i ];
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

