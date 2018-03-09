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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var DEFAULT_OPTIONS = {
    positiveFill: 'rgb( 49, 193, 238 )', // fill of background square for positive coefficient
    negativeFill: 'rgb( 99, 212, 238 )', // fill of background square for negative coefficient
    positiveLineDash: [], // solid border for positive coefficient
    negativeLineDash: [ 4, 4 ], // dashed border for negative coefficient
    margin: 6, // margin inside the background square
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

    var contentNode = VariableTermNode.createIcon( term.symbol, term.coefficient,
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
     * Creates an icon for variable terms.
     * @param {string} symbol
     * @param {ReducedFraction} coefficient
     * @param {Object} [options] - see DEFAULT_OPTIONS
     * @returns {Node}
     * @public
     * @static
     */
    createIcon: function( symbol, coefficient, options ) {

      assert && assert( typeof symbol === 'string', 'invalid coefficient' );
      assert && assert( coefficient instanceof ReducedFraction, 'invalid coefficient' );

      options = _.extend( {
        diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      }, DEFAULT_OPTIONS, options );

      var isPositive = ( coefficient.toDecimal() >= 0 );

      var squareNode = new Rectangle( 0, 0, options.diameter, options.diameter, {
        stroke: 'black',
        fill: isPositive ? options.positiveFill : options.negativeFill,
        lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
      } );

      var iconChildren = [];

      // coefficient, if not 1 or -1. Show 'x' not '1x', '-x' not '-1x'.
      if ( coefficient.abs().toDecimal() !== 1 ) {
        var coefficientNode = new ReducedFractionNode( coefficient, {
          fractionFont: options.fractionFont,
          integerFont: options.integerFont
        } );
        iconChildren.push( coefficientNode );
      }

      // variable's symbol, with negative sign if coefficient is -1
      var symbolText = ( coefficient.toDecimal() === -1 ) ? ( MathSymbols.UNARY_MINUS + symbol ) : symbol;
      var symbolNode = new Text( symbolText, {
        font: options.symbolFont
      } );
      iconChildren.push( symbolNode );

      // layout
      if ( coefficientNode ) {
        if ( coefficient.isInteger() ) {
          symbolNode.left = coefficientNode.right + options.integerXSpacing;
        }
        else {

          // vertically center variable on fractional coefficient
          symbolNode.left = coefficientNode.right + options.fractionXSpacing;
          symbolNode.centerY = coefficientNode.centerY;
        }
      }

      // icon on the square consists of coefficient and variable
      var iconNode = new Node( {
        children: iconChildren,
        maxWidth: squareNode.width - ( 2 * options.margin ),
        maxHeight: squareNode.height - ( 2 * options.margin ),
        center: squareNode.center
      } );

      assert && assert( !options.children, 'icon sets children' );
      options.children = [ squareNode, iconNode ];

      return new Node( options );
    }
  } );
} );