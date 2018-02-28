// Copyright 2017-2018, University of Colorado Boulder

/**
 * MysteryTermCreator creates and manages terms that are associated with mystery objects (apple, dog, turtle,...)
 * Mystery objects are objects whose (constant) weight is not revealed to the user.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTerm = require( 'EQUALITY_EXPLORER/common/model/MysteryTerm' );
  var MysteryTermNode = require( 'EQUALITY_EXPLORER/common/view/MysteryTermNode' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} typeName - internal name for the mystery object type, not visible to the user
   * @param {number} weight - integer weight of 1 mystery item
   * @param {HTMLImageElement} image
   * @param {HTMLImageElement} shadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTermCreator( typeName, weight, image, shadow, options ) {

    assert&& assert( Util.isInteger( weight ), 'weight must be an integer: ' + weight );

    // @public (read-only)
    this.typeName = typeName;
    this.weight = weight;
    this.image = image;
    this.shadow = shadow;

    var icon = MysteryTermNode.createIcon( image );

    TermCreator.call( this, icon, options );
  }

  equalityExplorer.register( 'MysteryTermCreator', MysteryTermCreator );

  return inherit( TermCreator, MysteryTermCreator, {

    /**
     * Instantiates a MysteryTerm.
     * @param {Object} [options] - passed to the Term's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {

      options = _.extend( {
        location: this.location,
        dragBounds: this.dragBounds
      }, options );

      return new MysteryTerm( this.typeName, this.weight, this.image, this.shadow, options );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Plate} plate
     * @param {Object} options - passed to the TermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, plate, options ) {
      return new MysteryTermNode( this, term, plate, options );
    }
  } );
} );
 