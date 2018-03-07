// Copyright 2017-2018, University of Colorado Boulder

/**
 * Node that creates terms.
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
      cursor: 'pointer'
    }, options );

    assert && assert( !options.children, 'children is set by this Node' );
    options.children = [ termCreator.icon ];

    // @private
    this.termCreator = termCreator;
    this.plate = plate;
    this.termsLayer = termsLayer;

    Node.call( this, options );

    // When a term is created in the model, create the corresponding view.
    termCreator.termCreatedEmitter.addListener( function( term, event ) {

      // create a TermNode
      var termNode = termCreator.createTermNode( term, plate );
      termsLayer.addChild( termNode );

      // Clean up when the term is disposed. Term.dispose handles removal of this listener.
      term.disposedEmitter.addListener( function( term ) {
        termNode.dispose();
      } );

      // event is non-null when the term was created via user interaction with termCreator.
      // start a drag cycle by forwarding the event to termNode.
      if ( event ) {
        termNode.startDrag( event );
      }
    } );

    // On down event, create a term and start a drag cycle by forwarding the event
    this.addInputListener( SimpleDragHandler.createForwardingListener(

      // down
      function( event ) {
        termCreator.createTerm( { event: event } );
      }, {
        allowTouchSnag: true
      }
    ) );

    // Things to do after the sim has loaded, when this Node has a valid location.
    var frameStartedCallback = function() {

      // termCreator's location
      var location = termsLayer.globalToLocalPoint( self.parentToGlobalPoint( self.center ) );

      // complete initialization
      termCreator.initialize( location );

      // Remove this function, so that it's called only once.
      phet.joist.sim.frameStartedEmitter.removeListener( frameStartedCallback );
    };
    phet.joist.sim.frameStartedEmitter.addListener( frameStartedCallback );
  }

  equalityExplorer.register( 'TermCreatorNode', TermCreatorNode );

  return inherit( Node, TermCreatorNode );
} );
