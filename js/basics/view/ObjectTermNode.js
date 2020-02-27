// Copyright 2018-2019, University of Colorado Boulder

/**
 * Displays an ObjectTerm.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import TermNode from '../../common/view/TermNode.js';
import equalityExplorer from '../../equalityExplorer.js';

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

export default inherit( TermNode, ObjectTermNode, {}, {

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

    assert && assert( Utils.isInteger( coefficient ), 'coefficient must be an integer: ' + coefficient );

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