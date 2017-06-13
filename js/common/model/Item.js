// Copyright 2017, University of Colorado Boulder

/**
 * An item that can be placed on the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  var idIndex = 0; // unique id assigned to each Item instance

  /**
   * @param {number} value - the Item's initial value
   * @param {Node} icon
   * @param {Object} [options]
   * @constructor
   */
  function Item( value, icon, options ) {

    options = _.extend( {
      constantTerm: false // {boolean} does this Item evaluate to a constant?
    }, options );

    // @public (read-only)
    this.constantTerm = options.constantTerm;

    // @public (read-only)
    this.id = idIndex++;

    // @public (read-only)
    this.valueProperty = new Property( value );

    // @public (read-only)
    this.icon = icon;

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'Item', Item );

  return inherit( EqualityExplorerMovable, Item, {

    // @public @override
    reset: function() {
      this.valueProperty.reset();
      EqualityExplorerMovable.prototype.reset.call( this );
    }
  } );
} );
