// Copyright 2018-2019, University of Colorado Boulder

/**
 * Abstract base type for displaying a term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const CombineTermsDragListener = require( 'EQUALITY_EXPLORER/common/view/CombineTermsDragListener' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SeparateTermsDragListener = require( 'EQUALITY_EXPLORER/common/view/SeparateTermsDragListener' );

  // constants
  const DEFAULT_SHADOW_OFFSET = new Dimension2( 4, 4 );

  /**
   * @param {TermCreator} termCreator
   * @param {Term} term
   * @param {Node} contentNode
   * @param {Node} shadowNode
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function TermNode( termCreator, term, contentNode, shadowNode, options ) {

    const self = this;

    options = _.extend( {
      shadowOffset: DEFAULT_SHADOW_OFFSET,

      // Node options
      cursor: 'pointer'
    }, options );

    // @public (read-only)
    this.term = term;

    // @public (read-only)
    this.contentNodeSize = new Dimension2( contentNode.width, contentNode.height );

    contentNode.centerX = 0;
    contentNode.centerY = 0;
    shadowNode.right = contentNode.right + options.shadowOffset.width;
    shadowNode.bottom = contentNode.bottom + options.shadowOffset.height;

    // halo around the content
    const haloRadius = Math.max( contentNode.width, contentNode.height );
    const haloNode = new HaloNode( haloRadius, {
      center: contentNode.center,
      visible: false
    } );

    assert && assert( !options.children, 'TermNode sets children' );
    options.children = [ haloNode, shadowNode, contentNode ];

    // Red dot at the origin
    if ( phet.chipper.queryParameters.dev ) {
      options.children.push( new Circle( 2, { fill: 'red' } ) );
    }

    Node.call( this, options );

    // Move to location
    const locationObserver = function( location ) {
      self.center = location;
    };
    term.locationProperty.link( locationObserver ); // unlink required in dispose

    // Pickable (interactivity)
    const pickableListener = function( pickable ) {
      self.pickable = pickable;
    };
    term.pickableProperty.link( pickableListener ); // unlink required in dispose

    // Whether the term is on a plate determines its rendering order
    const onPlateListener = function( onPlate ) {
      if ( onPlate ) {
        self.moveToBack();
      }
      else {
        self.moveToFront();
      }
    };
    term.onPlateProperty.link( onPlateListener ); // unlink required in dispose

    // Show/hide shadow
    const shadowVisibleListener = function( shadowVisible ) {
      shadowNode.visible = shadowVisible;
    };
    term.shadowVisibleProperty.link( shadowVisibleListener ); // unlink required in dispose

    // Show/hide halo
    const haloVisibleListener = function( haloVisible ) {
      haloNode.visible = haloVisible;
    };
    term.haloVisibleProperty.link( haloVisibleListener ); // unlink required in dispose

    const dragListenerOptions = {
      haloRadius: haloRadius
    };

    // @private dispose required
    if ( termCreator.combineLikeTermsEnabled ) {
      this.termDragListener = new CombineTermsDragListener( this, term, termCreator, dragListenerOptions );
    }
    else {
      this.termDragListener = new SeparateTermsDragListener( this, term, termCreator, dragListenerOptions );
    }
    this.addInputListener( this.termDragListener ); // removeListener required in dispose

    // @private
    this.disposeTermNode = function() {

      if ( term.locationProperty.hasListener( locationObserver ) ) {
        term.locationProperty.unlink( locationObserver );
      }

      if ( term.pickableProperty.hasListener( pickableListener ) ) {
        term.pickableProperty.unlink( pickableListener );
      }

      if ( term.onPlateProperty.hasListener( onPlateListener() ) ) {
        term.onPlateProperty.unlink( onPlateListener );
      }

      if ( term.shadowVisibleProperty.hasListener( shadowVisibleListener ) ) {
        term.haloVisibleProperty.unlink( shadowVisibleListener );
      }

      if ( term.shadowVisibleProperty.hasListener( haloVisibleListener ) ) {
        term.haloVisibleProperty.unlink( haloVisibleListener );
      }

      self.removeInputListener( self.termDragListener );
      self.termDragListener.dispose();
    };
  }

  equalityExplorer.register( 'TermNode', TermNode );

  return inherit( Node, TermNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeTermNode();
      Node.prototype.dispose.call( this );
    },

    /**
     * Starts a drag cycle.
     * The user drags a new term out of a toolbox below the scale by clicking on a TermCreatorNode.
     * That action causes TermCreatorNode to instantiate a TermNode.  This function allows
     * TermCreatorNode to forward the startDrag event to the TermNode that it created.
     * @param {Event} event
     * @public
     */
    startDrag: function( event ) {
      this.termDragListener.startDrag( event );
    }
  } );
} );