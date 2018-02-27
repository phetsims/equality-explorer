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

    options = _.extend( {}, DEFAULT_OPTIONS, options );

    var circleNode = new Circle( options.diameter / 2, {
      stroke: 'black'
    } );

    var shadowNode = new Circle( options.diameter / 2, {
      fill: 'black',
      opacity: 0.4
    } );

    var constantNode = null; // {ReducedFractionNode} set by valueListener

    var contentNode = new Node( {
      children: [ circleNode ]
    } );

    // updates the displayed constant value
    var valueListener = function( value ) {

      assert && assert( value instanceof ReducedFraction, 'invalid value' );

      // update the constant value displayed
      constantNode && contentNode.removeChild( constantNode );
      constantNode = new ReducedFractionNode( value, {
        fractionFont: options.fractionFont,
        integerFont: options.fractionFont,
        maxWidth: circleNode.width - ( 2 * options.margin ),
        maxHeight: circleNode.height - ( 2 * options.margin ),
        center: circleNode.center
      } );
      contentNode.addChild( constantNode );

      // update properties based on sign of the constant
      if ( value.toDecimal() >= 0 ) {
        circleNode.fill = options.positiveFill;
        circleNode.lineDash = options.positiveLineDash;
      }
      else {
        circleNode.fill = options.negativeFill;
        circleNode.lineDash = options.negativeLineDash;
      }
    };
    term.valueProperty.link( valueListener ); // unlink required in dispose

    TermNode.call( this, termCreator, term, plate, contentNode, shadowNode, options );

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
     * @param {Object} [options] - see ContantTermNode
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