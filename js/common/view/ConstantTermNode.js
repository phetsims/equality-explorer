// Copyright 2018, University of Colorado Boulder

/**
 * Displays a constant term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  const TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );

  // constants
  const DEFAULT_OPTIONS = {
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
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermNode( termCreator, term, options ) {

    options = _.extend( {}, DEFAULT_OPTIONS, options );

    const contentNode = ConstantTermNode.createInteractiveTermNode( term.constantValue,
      _.extend( { diameter: term.diameter }, _.pick( options, _.keys( DEFAULT_OPTIONS ) ) ) );

    const shadowNode = new Circle( term.diameter / 2, {
      fill: 'black',
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    TermNode.call( this, termCreator, term, contentNode, shadowNode, options );
  }

  equalityExplorer.register( 'ConstantTermNode', ConstantTermNode );

  return inherit( TermNode, ConstantTermNode, {}, {

    /**
     * Creates the representation of a term that the user interacts with, in this case a number inside a circle.
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

      const isPositive = ( constantValue.getValue() >= 0 );

      // background circle
      const circleNode = new Circle( options.diameter / 2, {
        stroke: 'black',
        fill: isPositive ? options.positiveFill : options.negativeFill,
        lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
      } );

      // constant value
      const margin = 0.18 * options.diameter; // determined empirically
      const constantNode = ConstantTermNode.createEquationTermNode( constantValue, {
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