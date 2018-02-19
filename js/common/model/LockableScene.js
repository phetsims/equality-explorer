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
   * @param {TermCreator[]} leftTermCreators - in the order that they appear in the left panel and left side of equations
   * @param {TermCreator[]} rightTermCreators - in the order that they appear in the right panel and right side of equations
   * @param {Object} [options]
   * @constructor
   */
  function LockableScene( debugName, leftTermCreators, rightTermCreators, options ) {

    Scene.call( this, debugName, leftTermCreators, rightTermCreators, options );

    // @public whether the 2 sides of the equation are locked
    this.lockedProperty = new BooleanProperty( false );

    var i; // hoist loop variable explicitly

    assert && assert( leftTermCreators.length === rightTermCreators.length,
      'must have same number of term creators on left and right' );
    assert && assert( leftTermCreators.length % 2 === 0,
      'scene must have an even number of term creators per side' );

    for ( i = 0; i < leftTermCreators.length; i++ ) {

      // These term creators are lockable, so initialize lockedProperty
      leftTermCreators[ i ].lockedProperty = this.lockedProperty;
      rightTermCreators[ i ].lockedProperty = this.lockedProperty;

      // Associate term creator with its equivalent term creator on the opposite side of the scale.
      assert && assert( leftTermCreators[ i ].isEquivalentTo( rightTermCreators[ i ] ),
        'equivalent term creators must have the same indices on both sides' );
      leftTermCreators[ i ].equivalentTermCreator = rightTermCreators[ i ];
      rightTermCreators[ i ].equivalentTermCreator = leftTermCreators[ i ];

      // Associate term creators with their inverse creators on the opposite side of the scale.
      if ( i % 2 === 0 ) {

        assert && assert( leftTermCreators[ i ].isInverseOf( rightTermCreators[ i + 1 ] ),
          'equivalent term creators must have specific indices' );
        leftTermCreators[ i ].inverseTermCreator = rightTermCreators[ i + 1 ];
        rightTermCreators[ i + 1 ].inverseTermCreator = leftTermCreators[ i ];

        assert && assert( leftTermCreators[ i + 1 ].isInverseOf( rightTermCreators[ i ] ),
          'equivalent term creators must have specific indices' );
        leftTermCreators[ i + 1 ].inverseTermCreator = rightTermCreators[ i ];
        rightTermCreators[ i ].inverseTermCreator = leftTermCreators[ 1 + 1 ];
      }
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

