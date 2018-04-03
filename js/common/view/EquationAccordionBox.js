// Copyright 2017-2018, University of Colorado Boulder

/**
 * Accordion box that displays the equation or inequality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EquationNode = require( 'EQUALITY_EXPLORER/common/view/EquationNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var equationOrInequalityString = require( 'string!EQUALITY_EXPLORER/equationOrInequality' );

  /**
   * @param {TermCreator[]} leftTermCreators - left side of equation
   * @param {TermCreator[]} rightTermCreators - right side of equation
   * @param {Object} [options]
   * @constructor
   */
  function EquationAccordionBox( leftTermCreators, rightTermCreators, options ) {

    options = _.extend( {

      // this accordion box is designed to be a fixed size, regardless of its content
      fixedWidth: 100,
      fixedHeight: 60,

      // supertype options
      resize: false,
      fill: 'white',
      showTitleWhenExpanded: false,
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      contentXMargin: 20,
      contentYMargin: 8
    }, options );

    assert && assert( options.maxWidth === undefined, 'EquationAccordionBox sets maxWidth' );
    options.maxWidth = options.fixedWidth;

    var contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );
    var contentHeight = options.fixedHeight - ( 2 * options.contentYMargin );

    options.titleNode = options.titleNode || new Text( equationOrInequalityString, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentWidth
    } );

    // use an invisible rectangle to enforce fixed content size
    var invisibleRectangle = new Rectangle( 0, 0, contentWidth, contentHeight );

    var equationNode = new EquationNode( leftTermCreators, rightTermCreators );

    // wrapper to avoid exceeding stack size when bounds of equationNode changes
    var equationParent = new Node( { children: [ equationNode ] } );

    equationNode.on( 'bounds', function() {

      // Compute the scale required to keep the equation inside the accordion box, and centered on
      // the relational operator. This is more complicated than setting maxWidth because the equation's
      // relation operator is centered in the accordion box, and only one side of the equation may get
      // too wide. equation.x is the center of the equation's relational operator.
      var maxSideWidth = contentWidth / 2;
      var leftSideOverflow = Math.max( 0, equationNode.x - equationNode.left - maxSideWidth );
      var rightSideOverflow = Math.max( 0, equationNode.right - equationNode.x - maxSideWidth );
      var maxOverflow = Math.max( leftSideOverflow, rightSideOverflow );

      // Scale and center the parent
      equationParent.setScaleMagnitude( maxSideWidth / ( maxSideWidth + maxOverflow ) );
      equationParent.x = invisibleRectangle.centerX;
      equationParent.centerY = invisibleRectangle.centerY;
    } );

    var contentNode = new Node( {
      children: [ invisibleRectangle, equationParent ],
      maxWidth: contentWidth,
      maxHeight: contentHeight
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'EquationAccordionBox', EquationAccordionBox );

  return inherit( AccordionBox, EquationAccordionBox );
} );
