// Copyright 2018-2020, University of Colorado Boulder

/**
 * Describes a variable associated with a type of real-world object (sphere, apple, coin, dog, ...)
 * This is a specialization of Variable (which is a symbolic variable, e.g. 'x') that carries additional
 * information related to the real-world object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Variable from '../../common/model/Variable.js';
import equalityExplorer from '../../equalityExplorer.js';

/**
 * @param {string} symbol - symbolic name for the object type, not visible to the user
 * @param {HTMLImageElement} image - image that represents the object
 * @param {HTMLImageElement} shadow - shadow shown while dragging
 * @param {Object} [options]
 * @constructor
 */
function ObjectVariable( symbol, image, shadow, options ) {

  // @public (read-only)
  this.image = image;
  this.shadow = shadow;

  Variable.call( this, symbol, options );
}

equalityExplorer.register( 'ObjectVariable', ObjectVariable );

inherit( Variable, ObjectVariable );
export default ObjectVariable;