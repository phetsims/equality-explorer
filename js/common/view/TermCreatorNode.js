// Copyright 2017-2020, University of Colorado Boulder

/**
 * Node that creates terms. These nodes appear in the toolboxes that appear below the scale's plates.
 * See https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md
 * for a detailed description of how the PhET 'creator pattern' is applied in this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import SimpleDragHandler from '../../../../scenery/js/input/SimpleDragHandler.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import equalityExplorer from '../../equalityExplorer.js';

/**
 * @param {TermCreator} termCreator - model element associated with this Node
 * @param {Plate} plate - associated plate on the scale
 * @param {Node} termsLayer - parent for TermNodes that will be created
 * @param {Object} [options]
 * @constructor
 */
function TermCreatorNode( termCreator, plate, termsLayer, options ) {

  const self = this;

  options = merge( {
    sign: 1,  // sign that will be applied to terms created by this Node, 1 or -1

    // Node options
    cursor: 'pointer'
  }, options );

  assert && assert( options.sign === 1 || options.sign === -1, 'invalid sign: ' + options.sign );

  assert && assert( !options.children, 'TermCreatorNode sets children' );
  options.children = [ termCreator.createIcon( { sign: options.sign } ) ];

  // @private
  this.termCreator = termCreator;
  this.plate = plate;
  this.termsLayer = termsLayer;

  Node.call( this, options );

  // On down event, create a term and start a drag cycle by forwarding the event
  this.addInputListener( SimpleDragHandler.createForwardingListener(
    // down
    function( event ) {
      termCreator.createTerm( {
        event: event,
        sign: options.sign
      } );
    }, {
      allowTouchSnag: true
    }
  ) );

  // Things to do after the sim has loaded, when this Node has a valid position.
  const frameStartedCallback = function() {

    // This Node's position
    const position = termsLayer.globalToLocalPoint( self.parentToGlobalPoint( self.center ) );

    // assign to termCreator's position
    if ( options.sign === 1 ) {
      termCreator.positivePosition = position;
    }
    else {
      termCreator.negativePosition = position;
    }

    // Remove this function, so that it's called only once.
    phet.joist.sim.frameStartedEmitter.removeListener( frameStartedCallback );
  };
  phet.joist.sim.frameStartedEmitter.addListener( frameStartedCallback ); // removeListener after first call
}

equalityExplorer.register( 'TermCreatorNode', TermCreatorNode );

inherit( Node, TermCreatorNode );
export default TermCreatorNode;