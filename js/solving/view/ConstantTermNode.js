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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
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
      font: FRACTION_FONT,
      maxWidth: circleNode.width - ( 2 * options.margin ),
      maxHeight: circleNode.height - ( 2 * options.margin ),
      center: circleNode.center
    } );

    var integerNode = new Text( 0, {
      font: INTEGER_FONT,
      maxWidth: circleNode.width - ( 2 * options.margin ),
      maxHeight: circleNode.height - ( 2 * options.margin ),
      center: circleNode.center
    } );

    assert && assert( !options.children, 'subtype defines its own children' );
    options.children = [ circleNode, fractionNode, integerNode ];

    // synchronize with the model value
    constantTerm.constantProperty.link( function( fraction ) {
      assert && assert( fraction instanceof ReducedFraction );

      // update the value displayed
      if ( fraction.isInteger() ) {

        // update the integer
        assert && assert( fraction.denominator === 1, 'expected fraction to be reduced' );
        integerNode.text = fraction.numerator;
        integerNode.visible = true;
        fractionNode.visible = false;
      }
      else {
        
        // update the fraction
        fractionNode.setFraction( fraction );
        fractionNode.visibile = true;
        integerNode.visible = false;
      }

      //TODO factor out fill and lineDash, copied from ItemIcons
      // update properties based on sign
      if ( fraction.getValue() >= 0 ) {
        circleNode.fill = 'rgb( 246, 228, 213 )';
        circleNode.lineDash = []; // solid line
      }
      else {
        circleNode.fill = 'rgb( 248, 238, 229 )';
        circleNode.lineDash = [ 3, 3 ];
      }

      // center both so that the invisible one can't mess up layout
      integerNode.center = circleNode.center;
      fractionNode.center = circleNode.center;

      // we don't want to see zero
      // self.visible = ( fraction.getValue() !== 0 ); //TODO hide term when value is zero
    } );

    Node.call( this, options );
  }

  equalityExplorer.register( 'ConstantTermNode', ConstantTermNode );

  return inherit( Node, ConstantTermNode );
} );