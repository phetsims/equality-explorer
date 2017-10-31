// Copyright 2017, University of Colorado Boulder

/**
 * VariableItem is associated with a specific variable (e.g. 'x') and can sum with other Items that
 * are associated with the same variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Item = require( 'EQUALITY_EXPLORER/common/model/Item' );

  /**
   * @param {string} variableName - e.g. 'x'
   * @param {NumberProperty} weightProperty
   * @param {string} debugName - internal name, not displayed to the user
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function VariableItem( variableName, weightProperty, debugName, icon, iconShadow, options ) {

    // @public (read-only)
    this.variableName = variableName;

    // @private
    this.weightProperty = weightProperty;

    Item.call( this, debugName, icon, iconShadow, options );
  }

  equalityExplorer.register( 'VariableItem', VariableItem );

  return inherit( Item, VariableItem, {

    /**
     * Gets the Item's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this.weightProperty.value;
    }
  } );
} );
 