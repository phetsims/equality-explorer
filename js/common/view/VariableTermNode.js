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
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
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

    var self = this;

    options = _.extend( {}, DEFAULT_OPTIONS, options );

    var squareNode = new Rectangle( 0, 0, options.diameter, options.diameter, {
      stroke: 'black'
    } );

    var shadowNode = new Rectangle( 0, 0, options.diameter, options.diameter, {
      fill: 'black',
      opacity: 0.4
    } );

    // variable's symbol, e.g. 'x'
    var symbolNode = new Text( term.symbol, {
      font: options.symbolFont,
      center: squareNode.center
    } );

    // for fractional coefficient
    var fractionNode = new ReducedFractionNode( term.coefficientProperty.value, {
      font: options.fractionFont,
      center: symbolNode.center
    } );

    // for integer coefficient
    var integerNode = new Text( 0, {
      font: options.integerFont,
      center: symbolNode.center
    } );

    // coefficient & variable
    var iconNode = new Node( {
      children: [ fractionNode, integerNode, symbolNode ],
      maxWidth: squareNode.width - ( 2 * options.margin ),
      maxHeight: squareNode.height - ( 2 * options.margin )
    } );

    var contentNode = new Node( {
      children: [ squareNode, iconNode ]
    } );

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );

    // synchronize with the model value
    var coefficientListener = function( newCoefficient, oldCoefficient ) {
      assert && assert( newCoefficient instanceof ReducedFraction, 'invalid newCoefficient' );

      // restore the symbol to its default, since some conditions below may have modified it
      symbolNode.text = term.symbol;

      // update the value displayed
      if ( newCoefficient.isInteger() ) {

        // hide fraction
        if ( iconNode.hasChild( fractionNode ) ) {
          iconNode.removeChild( fractionNode );
        }

        // update the integer
        assert && assert( Math.abs( newCoefficient.denominator ) === 1, 'expected newCoefficient to be reduced' );
        if ( Math.abs( newCoefficient.toDecimal() ) === 1 ) {

          // hide coefficient of 1 or -1
          if ( iconNode.hasChild( integerNode ) ) {
            iconNode.removeChild( integerNode );
          }

          // show -x, not -1x
          if ( newCoefficient.toDecimal() === -1 ) {
            symbolNode.text = '-' + term.symbol;
          }
        }
        else {

          integerNode.text = newCoefficient.numerator;
          integerNode.right = symbolNode.left - options.xSpacing;
          integerNode.centerY = symbolNode.centerY;
          if ( !iconNode.hasChild( integerNode ) ) {
            iconNode.addChild( integerNode );
          }
        }
      }
      else {

        // hide the integer
        if ( iconNode.hasChild( integerNode ) ) {
          iconNode.removeChild( integerNode );
        }

        // update the fraction
        fractionNode.setFraction( newCoefficient );
        fractionNode.right = symbolNode.left - options.xSpacing;
        fractionNode.centerY = symbolNode.centerY;
        if ( !iconNode.hasChild( fractionNode ) ) {
          iconNode.addChild( fractionNode );
        }
      }

      // update properties based on sign
      if ( newCoefficient.toDecimal() >= 0 ) {
        squareNode.fill = options.positiveFill;
        squareNode.lineDash = options.positiveLineDash;
      }
      else {
        squareNode.fill = options.negativeFill;
        squareNode.lineDash = options.negativeLineDash;
      }

      // center in the square
      iconNode.center = squareNode.center;

      // hide this node when coefficient is zero
      self.visible = ( newCoefficient.toDecimal() !== 0 );

      // sum-to-zero animation when the coefficient value transitions to zero
      if ( oldCoefficient && oldCoefficient.toDecimal() !== 0 && newCoefficient.toDecimal() === 0 ) {
        var sumToZeroNode = new SumToZeroNode( {
          symbol: term.symbol,
          haloBaseColor: 'transparent', // no halo
          fontSize: options.integerFont.size,
          center: self.center
        } );
        self.parent.addChild( sumToZeroNode );
        sumToZeroNode.startAnimation();
      }
    };
    term.coefficientProperty.link( coefficientListener ); // unlink required

    // @private
    this.disposeVariableTermNode = function() {
      if ( term.coefficientProperty.hasListener( coefficientListener ) ) {
        term.coefficientProperty.unlink( coefficientListener );
      }
    };
  }

  equalityExplorer.register( 'VariableTermNode', VariableTermNode );

  return inherit( TermNode, VariableTermNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeVariableTermNode();
      TermNode.prototype.dispose.call( this );
    }
  }, {

    /**
     * Creates an icon for constant terms.
     * @param {string} symbol
     * @param {number} coefficient - 1 for positive, -1 for negative
     * @param {Object} [options]
     * @returns {Node}
     * @public
     * @static
     */
    createIcon: function( symbol, coefficient, options ) {

      assert && assert( coefficient === 1 || coefficient === -1, 'invalid coefficient: ' + coefficient );
      var positive = ( coefficient === 1 );

      options = _.extend( {}, DEFAULT_OPTIONS, options );

      var squareNode = new Rectangle( 0, 0, options.diameter, options.diameter, {
        stroke: 'black',
        fill: positive ? options.positiveFill : options.negativeFill,
        lineDash: positive ? options.positiveLineDash : options.negativeLineDash
      } );

      var symbolText = positive ? symbol : ( '-' + symbol );
      var symbolNode = new Text( symbolText, {
        font: options.symbolFont,
        center: squareNode.center,
        maxWidth: squareNode.width - ( 2 * options.margin ),
        maxHeight: squareNode.height - ( 2 * options.margin )
      } );

      return new Node( {
        children: [ squareNode, symbolNode ]
      } );
    }
  } );
} );