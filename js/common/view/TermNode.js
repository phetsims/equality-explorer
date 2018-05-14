// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for displaying a term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CombineTermsDragListener = require( 'EQUALITY_EXPLORER/common/view/CombineTermsDragListener' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SeparateTermsDragListener = require( 'EQUALITY_EXPLORER/common/view/SeparateTermsDragListener' );

  // constants
  var DEFAULT_SHADOW_OFFSET = new Dimension2( 4, 4 );

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

    var self = this;

    options = _.extend( {
      shadowOffset: DEFAULT_SHADOW_OFFSET,

      // supertype options
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
    var haloRadius = Math.max( contentNode.width, contentNode.height );
    var haloNode = new HaloNode( haloRadius, {
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
    var locationObserver = function( location ) {
      self.center = location;
    };
    term.locationProperty.link( locationObserver ); // unlink required in dispose

    // Pickable (interactivity)
    var pickableListener = function( pickable ) {
      self.pickable = pickable;
    };
    term.pickableProperty.link( pickableListener ); // unlink required in dispose

    // Whether the term is on a plate determines its rendering order
    var onPlateListener = function( onPlate ) {
      if ( onPlate ) {
        self.moveToBack();
      }
      else {
        self.moveToFront();
      }
    };
    term.onPlateProperty.link( onPlateListener ); // unlink required in dispose

    // Show/hide shadow
    var shadowVisibleListener = function( shadowVisible ) {
      shadowNode.visible = shadowVisible;
    };
    term.shadowVisibleProperty.link( shadowVisibleListener ); // unlink required in dispose

    // Show/hide halo
    var haloVisibleListener = function( haloVisible ) {
      haloNode.visible = haloVisible;
    };
    term.haloVisibleProperty.link( haloVisibleListener ); // unlink required in dispose

    var dragListenerOptions = {
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