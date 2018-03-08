// Copyright 2018, University of Colorado Boulder

/**
 * Displays a constant term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );

  // constants
  var DEFAULT_OPTIONS = {
    positiveFill: 'rgb( 246, 228, 213 )',
    negativeFill: 'rgb( 248, 238, 229 )',
    positiveLineDash: [], // solid
    negativeLineDash: [ 3, 3 ],
    margin: 8,
    fractionFont: new PhetFont( 20 ),
    integerFont: new PhetFont( 40 )
  };

  /**
   * @param {ConstantTermCreator} termCreator
   * @param {ConstantTerm} term
   * @param {Plate} plate
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermNode( termCreator, term, plate, options ) {

    options = _.extend( {}, DEFAULT_OPTIONS, options );

    var contentNode = ConstantTermNode.createIcon( term.constantValue,
      _.extend( {}, options, { diameter: term.diameter } ) );

    var shadowNode = new Circle( term.diameter / 2, {
      fill: 'black',
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );
  }

  equalityExplorer.register( 'ConstantTermNode', ConstantTermNode );

  return inherit( TermNode, ConstantTermNode, {}, {

    /**
     * Creates an icon for constant terms.
     * @param {ReducedFraction} constantValue - value shown on the icon
     * @param {Object} [options] - see ConstantTermNode
     * @returns {Node}
     * @public
     * @static
     */
    createIcon: function( constantValue, options ) {

      assert && assert( constantValue instanceof ReducedFraction, 'invalid constantValue' );

      options = _.extend( {
        diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      }, DEFAULT_OPTIONS, options );

      var isPositive = ( constantValue.toDecimal() >= 0 );

      var circleNode = new Circle( options.diameter / 2, {
        stroke: 'black',
        fill: isPositive ? options.positiveFill : options.negativeFill,
        lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
      } );

      var constantNode = new ReducedFractionNode( constantValue, {
        fractionFont: options.fractionFont,
        integerFont: options.integerFont,
        maxWidth: circleNode.width - ( 2 * options.margin ),
        maxHeight: circleNode.height - ( 2 * options.margin ),
        center: circleNode.center
      } );

      return new Node( {
        children: [ circleNode, constantNode ]
      } );
    }
  } );
} );