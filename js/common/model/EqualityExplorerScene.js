// Copyright 2017, University of Colorado Boulder

/**
 * Model for a scene in Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function EqualityExplorerScene( options ) {

    options = options || {};

    // @public (read-only)
    this.variableRange = new RangeWithValue( 1, 10, 1 );

    // @public
    this.variableValueProperty = new Property( this.variableRange.defaultValue );
  }

  equalityExplorer.register( 'EqualityExplorerScene', EqualityExplorerScene );

  return inherit( Object, EqualityExplorerScene, {

    // @public
    reset: function() {
      this.variableValueProperty.reset();
    }
  } );
} );

