// Copyright 2018, University of Colorado Boulder

/**
 * Displays a mystery term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );

  /**
   * @param {MysteryTermCreator} termCreator
   * @param {MysteryTerm} term
   * @param {Plate} plate
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTermNode( termCreator, term, plate, options ) {

    options = _.extend( {
      xSpacing: 8 //TODO make this a function of icon size
    }, options );

    var iconNode = new Image( term.image, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    } );

    var shadowNode = new Image( term.shadow, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER,
      opacity: 0.4
    } );

    // coefficient
    var coefficientNode = null; // {ReducedFraction} set by coefficientListener

    var contentNode = new Node( {
      children: [ iconNode ]
    } );

    var coefficientListener = function( coefficient ) {

      assert && assert( coefficient instanceof ReducedFraction, 'invalid coefficient' );

      var coefficientDecimal = coefficient.toDecimal(); // {number}

      // update the coefficient displayed
      coefficientNode && iconNode.removeChild( contentNode );
      if ( coefficientDecimal === 1 ) {
        // do nothing, show just the icon
      }
      else {

        // coefficients other than 1
        coefficientNode = new ReducedFractionNode( coefficient, {
          fractionFont: options.fractionFont,
          integerFont: options.fractionFont,
          right: iconNode.left - options.xSpacing,
          centerY: iconNode.centerY
        } );
        iconNode.addChild( coefficientNode );
      }
    };
    term.coefficientProperty.link( coefficientListener ); // unlink required in dispose

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );

    this.disposeMysteryTermNode = function() {
      if ( term.coefficientProperty.hasListener( coefficientListener ) ) {
        term.coefficientProperty.unlink( coefficientListener );
      }
    };
  }

  equalityExplorer.register( 'MysteryTermNode', MysteryTermNode );

  return inherit( TermNode, MysteryTermNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeMysteryTermNode();
      TermNode.prototype.dispose.call( this );
    }
  }, {

    /**
     * Creates an icon for mystery terms.
     * @param {HTMLImageElement} image
     * @param {Object} [options]
     * @public
     * @static
     */
    createIcon: function( image, options ) {

      options = _.extend( {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      }, options );

      return new Image( image, options );
    }
  } );
} );