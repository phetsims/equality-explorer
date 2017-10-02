// Copyright 2017, University of Colorado Boulder

/**
 * An item that can be placed on the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var inherit = require( 'PHET_CORE/inherit' );

  var idIndex = 0; // unique number assigned to each Item instance

  /**
   * @param {string} name - internal name, not displayed to the user
   * @param {Property.<number>} weightProperty
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function Item( name, weightProperty, icon, iconShadow, options ) {

    options = _.extend( {
      constantTerm: false, // {boolean} does this Item evaluate to a constant?
      variableTerm: false // {boolean} does this Item represent a variable?
    }, options );

    assert && assert( !( options.contantTerm && options.variableTerm ),
      'Item cannot be both a constant and a variable' );

    //TODO this smells like subtyping is called for
    // @public (read-only)
    this.constantTerm = options.constantTerm;
    this.variableTerm = options.variableTerm;

    // @public (read-only)
    this.id = idIndex++;

    // @public (read-only)
    this.name = name;

    //TODO is weightProperty needed here? It doesn't appear to be used, and ItemCreator.weightProperty seems sufficient
    // @public (read-only)
    this.weightProperty = weightProperty;

    // @public (read-only)
    this.icon = icon;
    this.iconShadow = iconShadow;

    // @public (read-only) emit1 when Item.dispose has completed
    this.disposedEmitter = new Emitter();

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'Item', Item );

  return inherit( EqualityExplorerMovable, Item, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposedEmitter.emit1( this );
      this.disposedEmitter.removeAllListeners();
      EqualityExplorerMovable.prototype.dispose.call( this );
    },

    /**
     * @returns {string}
     * @public
     */
    toString: function() {
      return this.name + this.id;
    }
  } );
} );
