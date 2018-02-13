// Copyright 2018, University of Colorado Boulder

/**
 * Displays a variable term, with fraction or integer coefficient and variable symbol.
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
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );

  // constants
  var FRACTION_FONT = new PhetFont( 28 );
  var INTEGER_FONT = new PhetFont( 40 );
  var SYMBOL_FONT = new MathSymbolFont( 40 );

  /**
   * @param {VariableTerm} term
   * @param {Object} [options]
   * @constructor
   */
  function VariableTermNode( term, options ) {

    assert && assert( term instanceof VariableTerm, 'term has wrong type' );

    var self = this;

    options = _.extend( {
      diameter: EqualityExplorerConstants.TERM_DIAMETER,
      margin: 18,
      fractionFontSize: 12,
      integerFontSize: 22,
      xSpacing: 8
    }, options );

    var squareNode = new Rectangle( 0, 0, options.diameter, options.diameter, {
      stroke: 'black'
    } );

    var symbolNode = new Text( term.symbol, {
      font: SYMBOL_FONT,
      center: squareNode.center
    } );

    // for fractional coefficient
    var fractionNode = new ReducedFractionNode( term.coefficientProperty.value, {
      font: FRACTION_FONT,
      center: symbolNode.center
    } );

    // for integer coefficient
    var integerNode = new Text( 0, {
      font: INTEGER_FONT,
      center: symbolNode.center
    } );

    var contentNode = new Node( {
      children: [ fractionNode, integerNode, symbolNode ],
      maxWidth: squareNode.width - ( 2 * options.margin ),
      maxHeight: squareNode.height - ( 2 * options.margin )
    } );

    assert && assert( !options.children, 'subtype defines its own children' );
    options.children = [ squareNode, contentNode ];

    TermNode.call( this, term, options );

    // synchronize with the model value
    term.coefficientProperty.link( function( newCoefficient, oldCoefficient ) {
      assert && assert( newCoefficient instanceof ReducedFraction );

      // restore the symbol to its default, since some conditions below may have modified it
      symbolNode.text = term.symbol;

      // update the value displayed
      if ( newCoefficient.isInteger() ) {

        // hide fraction
        if ( contentNode.hasChild( fractionNode ) ) {
          contentNode.removeChild( fractionNode );
        }

        // update the integer
        assert && assert( Math.abs( newCoefficient.denominator ) === 1, 'expected newCoefficient to be reduced' );
        if ( Math.abs( newCoefficient.getValue() ) === 1 ) {

          // hide coefficient of 1 or -1
          if ( contentNode.hasChild( integerNode ) ) {
            contentNode.removeChild( integerNode );
          }

          // show -x, not -1x
          if ( newCoefficient.getValue() === -1 ) {
            symbolNode.text = '-' + term.symbol;
          }
        }
        else {

          integerNode.text = newCoefficient.numerator;
          integerNode.right = symbolNode.left - options.xSpacing;
          integerNode.centerY = symbolNode.centerY;
          if ( !contentNode.hasChild( integerNode ) ) {
            contentNode.addChild( integerNode );
          }
        }
      }
      else {

        // hide the integer
        if ( contentNode.hasChild( integerNode ) ) {
          contentNode.removeChild( integerNode );
        }

        // update the fraction
        fractionNode.setFraction( newCoefficient );
        fractionNode.right = symbolNode.left - options.xSpacing;
        fractionNode.centerY = symbolNode.centerY;
        if ( !contentNode.hasChild( fractionNode ) ) {
          contentNode.addChild( fractionNode );
        }
      }

      // update properties based on sign
      if ( newCoefficient.getValue() >= 0 ) {
        squareNode.fill = EqualityExplorerConstants.POSITIVE_X_FILL;
        squareNode.lineDash = EqualityExplorerConstants.POSITIVE_VARIABLE_LINE_DASH;
      }
      else {
        squareNode.fill = EqualityExplorerConstants.NEGATIVE_X_FILL;
        squareNode.lineDash = EqualityExplorerConstants.NEGATIVE_VARIABLE_LINE_DASH;
      }

      // center in the square
      contentNode.center = squareNode.center;

      // hide this node when coefficient is zero
      self.visible = ( newCoefficient.getValue() !== 0 );

      // sum-to-zero animation when the coefficient value transitions to zero
      if ( oldCoefficient && oldCoefficient.getValue() !== 0 && newCoefficient.getValue() === 0 ) {
        var sumToZeroNode = new SumToZeroNode( {
          symbol: term.symbol,
          haloBaseColor: 'transparent', // no halo
          fontSize: INTEGER_FONT.size,
          center: self.center
        } );
        self.parent.addChild( sumToZeroNode );
        sumToZeroNode.startAnimation();
      }
    } );
  }

  equalityExplorer.register( 'VariableTermNode', VariableTermNode );

  return inherit( TermNode, VariableTermNode );
} );