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

        // update the integer
        assert && assert( Math.abs( fraction.denominator ) === 1, 'expected fraction to be reduced' );
        if ( Math.abs( fraction.getValue() ) === 1 ) {

          // hide coefficient of 1 or -1
          integerNode.visible = false;

          // show -x, not -1x
          if ( fraction.getValue() === -1 ) {
            symbolNode.text = '-' + variableTerm.symbol;
          }

          integerNode.center = symbolNode.center;
        }
        else {
          integerNode.text = fraction.numerator;
          integerNode.visible = true;
          integerNode.right = symbolNode.left - options.xSpacing;
          integerNode.centerY = symbolNode.centerY;
        }

        // hide the fraction
        fractionNode.visible = false;
        fractionNode.center = integerNode.center;
      }
      else {

        // update the fraction
        fractionNode.setFraction( fraction );
        fractionNode.visible = true;
        fractionNode.right = symbolNode.left - options.xSpacing;
        fractionNode.centerY = symbolNode.centerY;

        // hide the integer
        integerNode.visible = false;
        integerNode.center = symbolNode.center;
      }

      //TODO factor out fill and lineDash, copied from ItemIcons
      // update properties based on sign
      if ( fraction.getValue() >= 0 ) {
        squareNode.fill = 'rgb( 49, 193, 238 )';
        squareNode.lineDash = []; // solid line
      }
      else {
        squareNode.fill = 'rgb( 99, 212, 238 )';
        squareNode.lineDash = [ 3, 3 ];
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