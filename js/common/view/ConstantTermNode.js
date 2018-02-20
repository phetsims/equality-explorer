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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var TermNode = require( 'EQUALITY_EXPLORER/common/view/TermNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEFAULT_OPTIONS = {
    positiveFill: 'rgb( 246, 228, 213 )',
    negativeFill: 'rgb( 248, 238, 229 )',
    positiveLineDash: [], // solid
    negativeLineDash: [ 3, 3 ],
    diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER,
    margin: 8, //TODO make this a function of diameter
    fractionFont: new PhetFont( 12 ),
    integerFont: new PhetFont( 24 )
  };

  /**
   * @param {ConstantTermCreator} termCreator
   * @param {ConstantTerm} term
   * @param {Plate} plate
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermNode( termCreator, term, plate, options ) {

    var self = this;

    options = _.extend( {}, DEFAULT_OPTIONS, options );

    var circleNode = new Circle( options.diameter / 2, {
      stroke: 'black'
    } );

    var shadowNode = new Circle( options.diameter / 2, {
      fill: 'black',
      opacity: 0.4
    } );

    // for fractional value
    var fractionNode = new ReducedFractionNode( term.valueProperty.value, {
      font: options.fractionFont
    } );

    // for integer value
    var integerNode = new Text( 0, {
      font: options.integerFont,
      center: fractionNode.center
    } );

    var iconNode = new Node( {
      children: [ fractionNode, integerNode ],
      maxWidth: circleNode.width - ( 2 * options.margin ),
      maxHeight: circleNode.height - ( 2 * options.margin ),
      center: circleNode.center
    } );

    var contentNode = new Node( {
      children: [ circleNode, iconNode ]
    } );

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );

    // synchronize with the model value, unlink handled by model
    var valueListener = function( newValue, oldValue ) {
      assert && assert( newValue instanceof ReducedFraction, 'invalid newValue' );

      // update the value displayed
      if ( newValue.isInteger() ) {

        // hide the fraction
        if ( iconNode.hasChild( fractionNode ) ) {
          iconNode.removeChild( fractionNode );
        }

        // update the integer
        assert && assert( Math.abs( newValue.denominator ) === 1, 'expected newValue to be reduced' );
        integerNode.text = newValue.numerator;
        if ( !iconNode.hasChild( integerNode ) ) {
          iconNode.addChild( integerNode );
        }
      }
      else {

        // hide the integer
        if ( iconNode.hasChild( integerNode ) ) {
          iconNode.removeChild( integerNode );
        }

        // update the fraction
        fractionNode.setFraction( newValue );
        if ( !iconNode.hasChild( fractionNode ) ) {
          iconNode.addChild( fractionNode );
        }
      }

      // update properties based on sign
      if ( newValue.toDecimal() >= 0 ) {
        circleNode.fill = options.positiveFill;
        circleNode.lineDash = options.positiveLineDash;
      }
      else {
        circleNode.fill = options.negativeFill;
        circleNode.lineDash = options.negativeLineDash;
      }

      // center in the circle
      iconNode.center = circleNode.center;

      // hide this node when value is zero
      self.visible = ( newValue.toDecimal() !== 0 );

      // sum-to-zero animation when the value transitions to zero
      if ( oldValue && oldValue.toDecimal() !== 0 && newValue.toDecimal() === 0 ) {
        var sumToZeroNode = new SumToZeroNode( {
          haloBaseColor: 'transparent', // no halo
          fontSize: options.integerFont.size,
          center: self.center
        } );
        self.parent.addChild( sumToZeroNode );
        sumToZeroNode.startAnimation();
      }
    };
    term.valueProperty.link( valueListener ); // unlink required

    // @private
    this.disposeConstantTermNode = function() {
      if ( term.valueProperty.hasListener( valueListener ) ) {
        term.valueProperty.unlink( valueListener );
      }
    };
  }

  equalityExplorer.register( 'ConstantTermNode', ConstantTermNode );

  return inherit( TermNode, ConstantTermNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeConstantTermNode();
      TermNode.prototype.dispose.call( this );
    }
  }, {

    /**
     * Creates an icon for constant terms.
     * @param {number} value - value shown on the icon, must be an integer
     * @param {Object} [options]
     * @returns {Node}
     * @public
     * @static
     */
    createIcon: function( value, options ) {

      options = _.extend( {}, DEFAULT_OPTIONS, options );

      assert && assert( Util.isInteger( value ), 'value must be an integer: ' + value );

      var circleNode = new Circle( options.diameter / 2, {
        stroke: 'black',
        fill: ( value >= 0 ) ? options.positiveFill : options.negativeFill,
        lineDash: ( value >= 0 ) ? options.positiveLineDash : options.negativeLineDash
      } );

      // 1
      var integerNode = new Text( value, {
        font: options.integerFont,
        center: circleNode.center,
        maxWidth: circleNode.width - ( 2 * options.margin ),
        maxHeight: circleNode.height - ( 2 * options.margin )
      } );

      return new Node( {
        children: [ circleNode, integerNode ]
      } );
    }
  } );
} );