// Copyright 2018, University of Colorado Boulder

/**
 * Displays a reduced fraction.
 * Origin is at the top center of the numerator, to support positioning that is independent of sign.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {ReducedFraction} fraction
   * @param {Object} [options]
   * @constructor
   */
  function ReducedFractionNode( fraction, options ) {

    assert && assert( fraction instanceof ReducedFraction );

    options = _.extend( {
      minLineLength: 1, // length of the fraction line
      font: new PhetFont( 22 ), // font for numerator and denominator
      color: 'black', // color of everything
      lineWidth: 1, // for the fraction line
      xSpacing: 5, // horizontal space between negative sign and fraction line
      ySpacing: 3 // vertical spacing above/below the fraction line
    }, options );

    assert && assert( !options.align, 'subtype defines its own align' );
    options.align = 'center';

    // @private
    this.xSpacing = options.xSpacing;
    this.ySpacing = options.ySpacing;

    // @private
    this.minLineLength = options.minLineLength;

    var textOptions = {
      font: options.font,
      fill: options.color
    };

    // @private
    this.numeratorNode = new Text( 0, textOptions );
    this.denominatorNode = new Text( 0, textOptions );
    this.lineNode = new Line( 0, 0, 1, 0, {
      stroke: options.color,
      lineWidth: options.lineWidth
    } );
    this.negativeSignNode = new Text( EqualityExplorerConstants.MINUS, textOptions );

    assert && assert( !options.children, 'subtype defines its own children' );
    options.children = [ this.negativeSignNode, this.numeratorNode, this.lineNode, this.denominatorNode ];

    Node.call( this, options );

    this.setFraction( fraction );
  }

  equalityExplorer.register( 'ReducedFractionNode', ReducedFractionNode );

  return inherit( Node, ReducedFractionNode, {

    /**
     * Sets the fraction displayed.
     * @param {ReducedFraction} fraction
     * @public
     */
    setFraction: function( fraction ) {

      assert && assert( fraction instanceof ReducedFraction );
      phet.log && phet.log( 'ReducedFractionNode.setFraction ' + fraction.toString() );

      // add or remove sign, so it doesn't contribute to bounds and thus affect layout
      if ( fraction.getValue() >= 0 ) {
        if ( this.hasChild( this.negativeSignNode ) ) {
          this.removeChild( this.negativeSignNode );
        }
      }
      else {
        if ( !this.hasChild( this.negativeSignNode ) ) {
          this.addChild( this.negativeSignNode );
        }
      }

      this.numeratorNode.text = Math.abs( fraction.numerator );
      this.denominatorNode.text = Math.abs( fraction.denominator );
      var lineLength = _.max( [ this.numeratorNode.width, this.denominatorNode.width, this.minLineLength ] );
      this.lineNode.setLine( 0, 0, lineLength, 0 );

      // layout
      this.numeratorNode.centerX = 0;
      this.numeratorNode.top = 0;
      this.lineNode.centerX = this.numeratorNode.centerX;
      this.lineNode.top = this.numeratorNode.bottom + this.ySpacing;
      this.denominatorNode.centerX = this.numeratorNode.centerX;
      this.denominatorNode.top = this.lineNode.bottom + this.ySpacing;
      this.negativeSignNode.right = this.lineNode.left - this.xSpacing;
      this.negativeSignNode.centerY = this.lineNode.centerY;
    }
  } );
} );
 