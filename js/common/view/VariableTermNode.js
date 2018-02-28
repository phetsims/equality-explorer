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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var DEFAULT_OPTIONS = {
    positiveFill: 'rgb( 49, 193, 238 )',
    negativeFill: 'rgb( 99, 212, 238 )',
    positiveLineDash: [], // solid
    negativeLineDash: [ 4, 4 ],
    diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER,
    margin: 6, //TODO make this a function of diameter
    xSpacing: 8, //TODO make this a function of diameter
    fractionFont: new PhetFont( 12 ),
    integerFont: new PhetFont( 24 ),
    symbolFont: new MathSymbolFont( 24 )
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

    var contentNode = VariableTermNode.createIcon( term.symbol, term.coefficient, options );

    var shadowNode = new Rectangle( 0, 0, options.diameter, options.diameter, {
      fill: 'black',
      opacity: 0.4
    } );

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );
  }

  equalityExplorer.register( 'VariableTermNode', VariableTermNode );

  return inherit( TermNode, VariableTermNode, {}, {

    /**
     * Creates an icon for variable terms.
     * @param {string} symbol
     * @param {ReducedFraction} coefficient
     * @param {Object} [options] - see VariableTermNode
     * @returns {Node}
     * @public
     * @static
     */
    createIcon: function( symbol, coefficient, options ) {

      assert && assert( typeof symbol === 'string', 'invalid coefficient' );
      assert && assert( coefficient instanceof ReducedFraction, 'invalid coefficient' );

      options = _.extend( {}, DEFAULT_OPTIONS, options );

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
          integerFont: options.fractionFont
        } );
        iconChildren.push( coefficientNode );
      }

      // variable's symbol, with negative sign if coefficient is -1
      var symbolText = ( coefficient.toDecimal() === -1 ) ? ( '-' + symbol ) : symbol;
      var symbolNode = new Text( symbolText, {
        font: options.symbolFont
      } );
      iconChildren.push( symbolNode );

      // icon on the square consists of coefficient and variable
      var iconNode = new HBox( {
        spacing: options.xSpacing,
        children: iconChildren,
        maxWidth: squareNode.width - ( 2 * options.margin ),
        maxHeight: squareNode.height - ( 2 * options.margin ),
        center: squareNode.center
      } );

      return new Node( {
        children: [ squareNode, iconNode ]
      } );
    }
  } );
} );