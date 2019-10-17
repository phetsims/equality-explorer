// Copyright 2018-2019, University of Colorado Boulder

/**
 * Displays an ObjectTerm.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // constants
  const DEFAULT_COEFFICIENT_FONT = new PhetFont( 28 );
  const ICON_SCALE_MULTIPLIER = 0.7; // use this to adjust size of icon relative to coefficient

  /**
   * @param {ObjectTermCreator} termCreator
   * @param {ObjectTerm} term
   * @param {Object} [options]
   * @constructor
   */
  function ObjectTermNode( termCreator, term, options ) {

    const contentNode = ObjectTermNode.createInteractiveTermNode( term.variable.image, {
      maxHeight: term.diameter
    } );

    const shadowNode = new Image( term.variable.shadow, {
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

      options = merge( {
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

      options = merge( {
        font: DEFAULT_COEFFICIENT_FONT
      }, options );

      const coefficientNode = new Text( coefficient, { font: options.font } );

      const iconWrapper = new Node( {
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