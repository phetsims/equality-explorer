// Copyright 2017-2018, University of Colorado Boulder

/**
 * Node that creates terms. These nodes appear in the toolboxes that appear below the scale's plates.
 * See https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md
 * for a detailed description of how the PhET 'creator pattern' is applied in this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {TermCreator} termCreator - model element associated with this Node
   * @param {Plate} plate - associated plate on the scale
   * @param {Node} termsLayer - parent for TermNodes that will be created
   * @param {Object} [options]
   * @constructor
   */
  function TermCreatorNode( termCreator, plate, termsLayer, options ) {

    var self = this;

    options = _.extend( {
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

    // Things to do after the sim has been constructed, when TermCreatorNode has a valid location.
    phet.joist.sim.endedSimConstructionEmitter.addListener( function() {

      // This Node's location
      var location = termsLayer.globalToLocalPoint( self.parentToGlobalPoint( self.center ) );

      // assign to termCreator's location
      if ( options.sign === 1 ) {
        termCreator.positiveLocation = location;
      }
      else {
        termCreator.negativeLocation = location;
      }
    } );
  }

  equalityExplorer.register( 'TermCreatorNode', TermCreatorNode );

  return inherit( Node, TermCreatorNode );
} );
