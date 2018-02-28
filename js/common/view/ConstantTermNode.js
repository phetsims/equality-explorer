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
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEFAULT_OPTIONS = {
    positiveFill: 'rgb( 246, 228, 213 )',
    negativeFill: 'rgb( 248, 238, 229 )',
    positiveLineDash: [], // solid
    negativeLineDash: [ 3, 3 ],
    diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER,
    margin: 8, //TODO make this a function of diameter
    fractionFont: new PhetFont( 12 ),
    integerFont: new PhetFont( 24 )
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

    var isPositive = ( term.constantValue.toDecimal() >= 0 );

    var circleNode = new Circle( options.diameter / 2, {
      stroke: 'black',
      fill: isPositive ? options.positiveFill : options.negativeFill,
      lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
    } );

    var shadowNode = new Circle( options.diameter / 2, {
      fill: 'black',
      opacity: 0.4
    } );

    var constantNode = new ReducedFractionNode( term.constantValue, {
      fractionFont: options.fractionFont,
      integerFont: options.fractionFont,
      maxWidth: circleNode.width - ( 2 * options.margin ),
      maxHeight: circleNode.height - ( 2 * options.margin ),
      center: circleNode.center
    } );

    var contentNode = new Node( {
      children: [ circleNode, constantNode ]
    } );

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );
  }

  equalityExplorer.register( 'ConstantTermNode', ConstantTermNode );

  return inherit( TermNode, ConstantTermNode, {}, {

    /**
     * Creates an icon for constant terms.
     * @param {number} value - value shown on the icon, must be an integer
     * @param {Object} [options] - see ConstantTermNode
     * @returns {Node}
     * @public
     * @static
     */
    createIcon: function( value, options ) {

      options = _.extend( {}, DEFAULT_OPTIONS, options );

      assert && assert( Util.isInteger( value ), 'value must be an integer: ' + value );

      var isPositive = ( value >= 0 );

      var circleNode = new Circle( options.diameter / 2, {
        stroke: 'black',
        fill: isPositive ? options.positiveFill : options.negativeFill,
        lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
      } );

      var integerNode = new Text( value, {
        font: options.integerFont,
        center: circleNode.center,
        maxWidth: circleNode.width - ( 2 * options.margin ),
        maxHeight: circleNode.height - ( 2 * options.margin )
      } );

      return new Node( {
        children: [ circleNode, integerNode ]
      } );
    }
  } );
} );