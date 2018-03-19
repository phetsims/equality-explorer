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
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );

  // constants
  var DEFAULT_OPTIONS = {
    positiveFill: EqualityExplorerColors.POSITIVE_CONSTANT_FILL, // fill of background circle for positive coefficient
    negativeFill: EqualityExplorerColors.NEGATIVE_CONSTANT_FILL, // fill of background circle for negative coefficient
    positiveLineDash: [], // solid border for positive coefficient
    negativeLineDash: [ 3, 3 ], // dashed border for negative coefficient
    margin: 8, // margin inside the background circle
    integerFont: new PhetFont( 40 ), // font for integer constant value
    fractionFont: new PhetFont( 20 ) // font for fractional constant value
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

    var contentNode = ConstantTermNode.createInteractiveTermNode( term.constantValue,
      _.extend( { diameter: term.diameter }, _.pick( options, _.keys( DEFAULT_OPTIONS ) ) ) );

    var shadowNode = new Circle( term.diameter / 2, {
      fill: 'black',
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );
  }

  equalityExplorer.register( 'ConstantTermNode', ConstantTermNode );

  return inherit( TermNode, ConstantTermNode, {}, {

    /**
     * Creates the representation of a term that appears on interactive nodes.
     * @param {Fraction} constantValue - value shown on the icon
     * @param {Object} [options] - see DEFAULT_OPTIONS
     * @returns {Node}
     * @public
     * @static
     */
    createInteractiveTermNode: function( constantValue, options ) {

      assert && assert( constantValue instanceof Fraction, 'invalid constantValue: ' + constantValue );
      assert && assert( constantValue.isReduced(), 'constantValue must be reduced: ' + constantValue );

      options = _.extend( {
        diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      }, DEFAULT_OPTIONS, options );

      var isPositive = ( constantValue.getValue() >= 0 );

      // background circle
      var circleNode = new Circle( options.diameter / 2, {
        stroke: 'black',
        fill: isPositive ? options.positiveFill : options.negativeFill,
        lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
      } );

      // constant value
      var margin = 0.18 * options.diameter; // determined empirically
      var constantNode = ConstantTermNode.createEquationTermNode( constantValue, {
        fractionFont: options.fractionFont,
        integerFont: options.integerFont,
        maxWidth: circleNode.width - ( 2 * margin ),
        maxHeight: circleNode.height - ( 2 * margin ),
        center: circleNode.center
      } );

      return new Node( {
        children: [ circleNode, constantNode ]
      } );
    },

    /**
     * Creates the representation of a term that is shown in equations.
     * For constant terms, this same representation appears on interactive terms.
     * @param {Fraction} constantValue
     * @param {Object} [options] - see ReducedFractionNode
     * @returns {Node}
     * @public
     * @static
     */
    createEquationTermNode: function( constantValue, options ) {
      assert && assert( constantValue instanceof Fraction, 'invalid constantValue: ' + constantValue );
      assert && assert( constantValue.isReduced(), 'constantValue must be reduced: ' + constantValue );
      return new ReducedFractionNode( constantValue, options );
    }
  } );
} );