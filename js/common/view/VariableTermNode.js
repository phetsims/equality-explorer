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

    // coefficient
    var coefficientNode = null; // {ReducedFraction} set by coefficientListener

    var iconNode = new Node( {
      children: [ symbolNode ],
      maxWidth: squareNode.width - ( 2 * options.margin ),
      maxHeight: squareNode.height - ( 2 * options.margin ),
      center: squareNode.center
    } );

    var contentNode = new Node( {
      children: [ squareNode, iconNode ]
    } );

    // updates the displayed coefficient
    var coefficientListener = function( coefficient ) {

      assert && assert( coefficient instanceof ReducedFraction, 'invalid coefficient' );

      var coefficientDecimal = coefficient.toDecimal(); // {number}

      // restore the symbol to its default, since some conditions below may have modified it
      symbolNode.text = term.symbol;

      // update the coefficient displayed
      coefficientNode && iconNode.removeChild( contentNode );
      if ( coefficientDecimal === 1 ) {
        // do nothing, show 'x', not '1x'
      }
      else if ( coefficientDecimal === -1 ) {

        // add sign to symbol
        symbolNode.text = '-' + term.symbol;
      }
      else {

        // coefficients other than 1 and -1
        coefficientNode = new ReducedFractionNode( coefficient, {
          fractionFont: options.fractionFont,
          integerFont: options.fractionFont,
          right: symbolNode.left - options.xSpacing,
          centerY: symbolNode.centerY
        } );
        iconNode.addChild( coefficientNode );
      }

      // update properties based on sign
      if ( coefficientDecimal >= 0 ) {
        squareNode.fill = options.positiveFill;
        squareNode.lineDash = options.positiveLineDash;
      }
      else {
        squareNode.fill = options.negativeFill;
        squareNode.lineDash = options.negativeLineDash;
      }

      // re-center icon in square
      iconNode.center = squareNode.center;
    };
    term.coefficientProperty.link( coefficientListener ); // unlink required in dispose

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );

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
     * Creates an icon for variable terms.
     * @param {string} symbol
     * @param {number} coefficient - 1 for positive, -1 for negative
     * @param {Object} [options] - see VariableTermNode
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