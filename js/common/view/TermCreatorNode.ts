// Copyright 2017-2025, University of Colorado Boulder

/**
 * Node that creates terms. These nodes appear in the toolboxes that appear below the scale's plates.
 * See https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md
 * for a description of how the PhET 'creator pattern' is applied in this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import equalityExplorer from '../../equalityExplorer.js';
import Plate from '../model/Plate.js';
import TermCreator, { TermCreatorSign } from '../model/TermCreator.js';

type SelfOptions = {
  sign?: TermCreatorSign; // sign that will be applied to terms created by this Node
};

type TermCreatorNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class TermCreatorNode extends Node {

  private readonly termCreator: TermCreator;
  private readonly plate: Plate;
  private readonly termsLayer: Node;

  /**
   * @param termCreator - model element associated with this Node
   * @param plate - associated plate on the scale
   * @param termsLayer - parent for TermNodes that will be created
   * @param [providedOptions]
   */
  public constructor( termCreator: TermCreator, plate: Plate, termsLayer: Node, providedOptions: TermCreatorNodeOptions ) {

    const options = optionize<TermCreatorNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      sign: 1,

      // NodeOptions
      cursor: 'pointer',
      phetioVisiblePropertyInstrumented: false // because left and right toolboxes must contain the same term creators for lock feature
    }, providedOptions );

    options.children = [ termCreator.createIcon( options.sign ) ];

    super( options );

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

    this.addLinkedElement( termCreator );
  }
}

equalityExplorer.register( 'TermCreatorNode', TermCreatorNode );