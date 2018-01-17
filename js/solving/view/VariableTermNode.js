// Copyright 2018, University of Colorado Boulder

/**
 * Displays a variable term (with fraction or integer coefficient) on the scale in the 'Solving' screen.
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
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var FRACTION_FONT = new PhetFont( 28 );
  var INTEGER_FONT = new PhetFont( 40 );
  var SYMBOL_FONT = new MathSymbolFont( 40 );

  /**
   * @param {VariableTerm} variableTerm
   * @param {Object} [options]
   * @constructor
   */
  function VariableTermNode( variableTerm, options ) {

    options = _.extend( {
      radius: 50,
      margin: 18,
      fractionFontSize: 12,
      integerFontSize: 22,
      xSpacing: 8
    }, options );

    var squareNode = new Rectangle( 0, 0, 2 * options.radius, 2 * options.radius, {
      stroke: 'black'
    } );

    var symbolNode = new Text( variableTerm.symbol, {
      font: SYMBOL_FONT,
      center: squareNode.center
    } );

    var fractionNode = new ReducedFractionNode( variableTerm.coefficientProperty.value, {
      font: FRACTION_FONT,
      center: symbolNode.center
    } );

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

    Node.call( this );

    // synchronize with the model value
    variableTerm.coefficientProperty.link( function( fraction ) {
      assert && assert( fraction instanceof ReducedFraction );

      symbolNode.text = variableTerm.symbol;

      // update the value displayed
      if ( fraction.isInteger() ) {

        // hide fraction
        if ( contentNode.hasChild( fractionNode ) ) {
          contentNode.removeChild( fractionNode );
        }

        // update the integer
        assert && assert( Math.abs( fraction.denominator ) === 1, 'expected fraction to be reduced' );
        if ( Math.abs( fraction.getValue() ) === 1 ) {

          // hide coefficient of 1 or -1
          if ( contentNode.hasChild( integerNode ) ) {
            contentNode.removeChild( integerNode );
          }

          // show -x, not -1x
          if ( fraction.getValue() === -1 ) {
            symbolNode.text = '-' + variableTerm.symbol;
          }
        }
        else {

          integerNode.text = fraction.numerator;
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
        fractionNode.setFraction( fraction );
        fractionNode.right = symbolNode.left - options.xSpacing;
        fractionNode.centerY = symbolNode.centerY;
        if ( !contentNode.hasChild( fractionNode ) ) {
          contentNode.addChild( fractionNode );
        }
      }

      // update properties based on sign
      if ( fraction.getValue() >= 0 ) {
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
      // self.visible = ( fraction.getValue() !== 0 );
    } );

    this.mutate( options );
  }

  equalityExplorer.register( 'VariableTermNode', VariableTermNode );

  return inherit( Node, VariableTermNode );
} );