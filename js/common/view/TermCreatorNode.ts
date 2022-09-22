// Copyright 2017-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Node that creates terms. These nodes appear in the toolboxes that appear below the scale's plates.
 * See https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md
 * for a detailed description of how the PhET 'creator pattern' is applied in this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { DragListener, Node } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';

export default class TermCreatorNode extends Node {

  /**
   * @param {TermCreator} termCreator - model element associated with this Node
   * @param {Plate} plate - associated plate on the scale
   * @param {Node} termsLayer - parent for TermNodes that will be created
   * @param {Object} [options]
   */
  constructor( termCreator, plate, termsLayer, options ) {

    options = merge( {
      sign: 1,  // sign that will be applied to terms created by this Node, 1 or -1

      // Node options
      cursor: 'pointer'
    }, options );

    assert && assert( options.sign === 1 || options.sign === -1, `invalid sign: ${options.sign}` );

    assert && assert( !options.children, 'TermCreatorNode sets children' );
    options.children = [ termCreator.createIcon( { sign: options.sign } ) ];

    super( options );

    // @private
    this.termCreator = termCreator;
    this.plate = plate;
    this.termsLayer = termsLayer;

    // On down event, create a term and start a drag cycle by forwarding the event
    this.addInputListener( DragListener.createForwardingListener(
      // down
      event => {
        termCreator.createTerm( {
          event: event,
          sign: options.sign
        } );
      } ) );

    // Things to do after the sim has loaded, when this Node has a valid position.
    const frameStartedCallback = () => {

      // This Node's position
      const position = termsLayer.globalToLocalPoint( this.parentToGlobalPoint( this.center ) );

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
}

equalityExplorer.register( 'TermCreatorNode', TermCreatorNode );