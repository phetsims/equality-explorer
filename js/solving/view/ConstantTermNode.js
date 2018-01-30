// Copyright 2018, University of Colorado Boulder

/**
 * Displays a constant term (fraction or integer value) on the scale in the 'Solving' screen.
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
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var FRACTION_FONT = new PhetFont( 28 );
  var INTEGER_FONT = new PhetFont( 40 );

  /**
   * @param {ConstantTerm} constantTerm
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermNode( constantTerm, options ) {

    var self = this;

    options = _.extend( {
      radius: 50,
      margin: 18,
      fractionFontSize: 12,
      integerFontSize: 22
    }, options );

    var circleNode = new Circle( options.radius, {
      stroke: 'black'
    } );

    var fractionNode = new ReducedFractionNode( constantTerm.constantProperty.value, {
      font: FRACTION_FONT
    } );

    var integerNode = new Text( 0, {
      font: INTEGER_FONT,
      center: fractionNode.center
    } );

    var contentNode = new Node( {
      children: [ fractionNode, integerNode ],
      maxWidth: circleNode.width - ( 2 * options.margin ),
      maxHeight: circleNode.height - ( 2 * options.margin ),
      center: circleNode.center
    } );

    assert && assert( !options.children, 'subtype defines its own children' );
    options.children = [ circleNode, contentNode ];

    Node.call( this );

    // synchronize with the model value
    constantTerm.constantProperty.link( function( fraction, oldFraction ) {
      assert && assert( fraction instanceof ReducedFraction );

      // update the value displayed
      if ( fraction.isInteger() ) {

        // hide the fraction
        if ( contentNode.hasChild( fractionNode ) ) {
          contentNode.removeChild( fractionNode );
        }

        // update the integer
        assert && assert( Math.abs( fraction.denominator ) === 1, 'expected fraction to be reduced' );
        integerNode.text = fraction.numerator;
        if ( !contentNode.hasChild( integerNode ) ) {
          contentNode.addChild( integerNode );
        }
      }
      else {

        // hide the integer
        if ( contentNode.hasChild( integerNode ) ) {
          contentNode.removeChild( integerNode );
        }

        // update the fraction
        fractionNode.setFraction( fraction );
        if ( !contentNode.hasChild( fractionNode ) ) {
          contentNode.addChild( fractionNode );
        }
      }

      // update properties based on sign
      if ( fraction.getValue() >= 0 ) {
        circleNode.fill = EqualityExplorerConstants.POSITIVE_CONSTANT_FILL;
        circleNode.lineDash = EqualityExplorerConstants.POSITIVE_CONSTANT_LINE_DASH;
      }
      else {
        circleNode.fill = EqualityExplorerConstants.NEGATIVE_CONSTANT_FILL;
        circleNode.lineDash = EqualityExplorerConstants.NEGATIVE_CONSTANT_LINE_DASH;
      }

      // center in the circle
      contentNode.center = circleNode.center;

      // hide this node when value is zero
      self.visible = ( fraction.getValue() !== 0 );

      // sum-to-zero animation when the value transitions to zero
      if ( oldFraction && oldFraction.getValue() !== 0 && fraction.getValue() === 0 ) {
        var sumToZeroNode = new SumToZeroNode( {
          haloBaseColor: 'transparent', // no halo
          fontSize: 40,
          center: self.center
        } );
        self.parent.addChild( sumToZeroNode );
        sumToZeroNode.startAnimation();
      }
    } );

    this.mutate( options );
  }

  equalityExplorer.register( 'ConstantTermNode', ConstantTermNode );

  return inherit( Node, ConstantTermNode );
} );