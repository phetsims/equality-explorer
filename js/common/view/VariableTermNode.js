// Copyright 2018, University of Colorado Boulder

/**
 * Displays a variable term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var DEFAULT_OPTIONS = {
    positiveFill: EqualityExplorerColors.POSITIVE_X_FILL, // fill of background square for positive coefficient
    negativeFill: EqualityExplorerColors.NEGATIVE_X_FILL, // fill of background square for negative coefficient
    positiveLineDash: [], // solid border for positive coefficient
    negativeLineDash: [ 4, 4 ], // dashed border for negative coefficient
    integerXSpacing: 4, // space between integer coefficient and variable symbol
    fractionXSpacing: 4, // space between fractional coefficient and variable symbol
    integerFont: new PhetFont( 40 ), // font for integer coefficient
    fractionFont: new PhetFont( 20 ), // font for fractional coefficient
    symbolFont: new MathSymbolFont( 40 ) // font for variable symbol
  };

  /**
   * @param {TermCreator} termCreator
   * @param {VariableTerm} term
   * @param {Plate} plate
   * @param {Object} [options]
   * @constructor
   */
  function VariableTermNode( termCreator, term, plate, options ) {

    options = _.extend( {}, DEFAULT_OPTIONS, options );

    var contentNode = VariableTermNode.createInteractiveTermNode( term.coefficient, term.symbol,
      _.extend( { diameter: term.diameter }, _.pick( options, _.keys( DEFAULT_OPTIONS ) ) ) );

    var shadowNode = new Rectangle( 0, 0, term.diameter, term.diameter, {
      fill: 'black',
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );
  }

  equalityExplorer.register( 'VariableTermNode', VariableTermNode );

  return inherit( TermNode, VariableTermNode, {}, {

    /**
     * Creates the representation of a term that appears on interactive nodes.
     * @param {Fraction} coefficient
     * @param {string} symbol
     * @param {Object} [options] - see DEFAULT_OPTIONS
     * @returns {Node}
     * @public
     * @static
     */
    createInteractiveTermNode: function( coefficient, symbol, options ) {

      assert && assert( coefficient instanceof Fraction, 'invalid coefficient: ' + coefficient );
      assert && assert( coefficient.isReduced(), 'coefficient must be reduced: ' + coefficient );
      assert && assert( typeof symbol === 'string', 'invalid symbol: ' + symbol );

      options = _.extend( {
        diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      }, DEFAULT_OPTIONS, options );

      var isPositive = ( coefficient.getValue() >= 0 );

      // background square
      var squareNode = new Rectangle( 0, 0, options.diameter, options.diameter, {
        stroke: 'black',
        fill: isPositive ? options.positiveFill : options.negativeFill,
        lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
      } );

      var margin = 0.12 * options.diameter; // determined empirically

      var valueNode = VariableTermNode.createEquationTermNode( coefficient, symbol, {
        align: 'center',
        maxWidth: squareNode.width - ( 2 * margin ),
        maxHeight: squareNode.height - ( 2 * margin ),
        center: squareNode.center
      } );

      assert && assert( !options.children, 'VariableTermNode sets children' );
      options.children = [ squareNode, valueNode ];

      return new Node( options );
    },

    /**
     * Creates the representation of a term that is shown in equations.
     * For constant terms, this same representation appears on interactive terms.
     * @param {Fraction} coefficient
     * @param {string} symbol - the variable symbol
     * @param {Object} [options] - see ReducedFractionNode
     * @returns {Node}
     * @public
     * @static
     */
    createEquationTermNode: function( coefficient, symbol, options ) {

      assert && assert( coefficient instanceof Fraction, 'invalid coefficient: ' + coefficient );
      assert && assert( coefficient.isReduced(), 'coefficient must be reduced: ' + coefficient );
      assert && assert( typeof symbol === 'string', 'invalid symbol: ' + symbol );

      options = _.extend( {
        align: 'center'
      }, DEFAULT_OPTIONS, options );

      assert && assert( !options.children, 'sets its own children' );
      options.children = [];

      // coefficient, if not 1 or -1. Show 'x' not '1x', '-x' not '-1x'.
      if ( coefficient.abs().getValue() !== 1 ) {
        var coefficientNode = new ReducedFractionNode( coefficient, {
          fractionFont: options.fractionFont,
          integerFont: options.integerFont
        } );
        options.children.push( coefficientNode );
      }

      // variable's symbol, with negative sign if coefficient is -1
      var symbolText = ( coefficient.getValue() === -1 ) ? ( MathSymbols.UNARY_MINUS + symbol ) : symbol;
      var symbolNode = new Text( symbolText, {
        font: options.symbolFont
      } );
      options.children.push( symbolNode );

      assert && assert( options.spacing === undefined, 'VariableTermNode sets spacing' );
      options.spacing = coefficient.isInteger() ? options.integerXSpacing : options.fractionXSpacing;

      return new HBox( options );
    }
  } );
} );