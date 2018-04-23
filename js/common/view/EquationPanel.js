// Copyright 2017-2018, University of Colorado Boulder

/**
 * Fixed-size panel that displays an equation or inequality.
 * The equation is scaled to fix the panel.
 * The equation's relational operator remains horizontally centered in the panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EquationNode = require( 'EQUALITY_EXPLORER/common/view/EquationNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {TermCreator[]} leftTermCreators - left side of equation
   * @param {TermCreator[]} rightTermCreators - right side of equation
   * @param {Object} [options]
   * @constructor
   */
  function EquationPanel( leftTermCreators, rightTermCreators, options ) {

    options = _.extend( {

      // this panel is designed to be a fixed size, regardless of its content
      contentWidth: 100,
      contentHeight: 60,

      // options passed to EquationNode constructor
      equationNodeOptions: null,

      // supertype options
      fill: null,
      stroke: null,
      resize: false,
      cornerRadius: EqualityExplorerConstants.CORNER_RADIUS

    }, options );

    // use an invisible rectangle to enforce fixed content size, stroke 'red' with ?dev
    var invisibleRectangle = new Rectangle( 0, 0, options.contentWidth, options.contentHeight, {
      stroke: phet.chipper.queryParameters.dev ? 'red' : null
    } );

    var equationNode = new EquationNode( leftTermCreators, rightTermCreators, options.equationNodeOptions );

    // wrapper to avoid exceeding stack size when bounds of equationNode changes
    var equationParent = new Node( { children: [ equationNode ] } );

    equationNode.on( 'bounds', function() {

      // Compute the scale required to keep the equation inside the accordion box, and centered on
      // the relational operator. This is more complicated than setting maxWidth because the equation's
      // relation operator is centered in the accordion box, and only one side of the equation may get
      // too wide. equation.x is the center of the equation's relational operator.
      var maxSideWidth = options.contentWidth / 2;
      var leftSideOverflow = Math.max( 0, equationNode.x - equationNode.left - maxSideWidth );
      var rightSideOverflow = Math.max( 0, equationNode.right - equationNode.x - maxSideWidth );
      var maxOverflow = Math.max( leftSideOverflow, rightSideOverflow );
      var xScale = maxSideWidth / ( maxSideWidth + maxOverflow );

      // vertical scale
      var yScale = options.contentHeight / equationNode.height;

      // Scale and center the parent
      equationParent.setScaleMagnitude( Math.min( xScale, yScale ) );
      equationParent.x = invisibleRectangle.centerX;
      equationParent.centerY = invisibleRectangle.centerY;
    } );

    var contentNode = new Node( {
      children: [ invisibleRectangle, equationParent ]
    } );

    Panel.call( this, contentNode, options );
  }

  equalityExplorer.register( 'EquationPanel', EquationPanel );

  return inherit( Panel, EquationPanel );
} );