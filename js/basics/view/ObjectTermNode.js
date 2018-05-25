// Copyright 2018, University of Colorado Boulder

/**
 * Displays an ObjectTerm.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEFAULT_COEFFICIENT_FONT = new PhetFont( 28 );
  var ICON_SCALE_MULTIPLIER = 0.75; // use this to adjust size of icon relative to coefficient

  /**
   * @param {ObjectTermCreator} termCreator
   * @param {ObjectTerm} term
   * @param {Object} [options]
   * @constructor
   */
  function ObjectTermNode( termCreator, term, options ) {

    var contentNode = ObjectTermNode.createInteractiveTermNode( term.variable.image, {
      maxHeight: term.diameter
    } );

    var shadowNode = new Image( term.variable.shadow, {
      maxHeight: term.diameter,
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    TermNode.call( this, termCreator, term, contentNode, shadowNode, options );
  }

  equalityExplorer.register( 'ObjectTermNode', ObjectTermNode );

  return inherit( TermNode, ObjectTermNode, {}, {

    /**
     * Creates the representation of a term that the user interacts with, in this case the object type's icon.
     * No coefficient is shown because every ObjectTerm has an implicit coefficient of 1.
     * @param {HTMLImageElement} image
     * @param {Object} [options] - see ObjectTermNode
     * @public
     * @static
     */
    createInteractiveTermNode: function( image, options ) {

      options = _.extend( {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      }, options );

      return new Image( image, options );
    },

    /**
     * Creates the representation of a term that is shown in equations.
     * Since every ObjectTerm has an implicit coefficient of 1, the coefficient is an integer.
     * @param {number} coefficient
     * @param {Node} icon
     * @param {Object} [options]
     * @public
     * @static
     */
    createEquationTermNode: function( coefficient, icon, options ) {

      assert && assert( Util.isInteger( coefficient ), 'coefficient must be an integer: ' + coefficient );

      options = _.extend( {
        font: DEFAULT_COEFFICIENT_FONT
      }, options );

      var coefficientNode = new Text( coefficient, { font: options.font } );

      var iconWrapper = new Node( {
        children: [ icon ],
        scale: ICON_SCALE_MULTIPLIER * coefficientNode.height / icon.height
      } );

      return new HBox( {
        spacing: 2,
        children: [ coefficientNode, iconWrapper ]
      } );
    }
  } );
} );