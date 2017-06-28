// Copyright 2017, University of Colorado Boulder

/***
 * Accordion box that displays the equation or inequality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EquationNode = require( 'EQUALITY_EXPLORER/common/view/EquationNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var equationOrInequalityString = require( 'string!EQUALITY_EXPLORER/equationOrInequality' );

  // constants
  var CONTENT_SIZE = new Dimension2( 425, 60 );

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function EquationAccordionBox( leftItemCreators, rightItemCreators, options ) {

    options = _.extend( {
      fill: 'white',
      showTitleWhenExpanded: false,
      titleNode: new Text( equationOrInequalityString, {
        font: new PhetFont( 18 ),
        maxWidth: 0.75 * CONTENT_SIZE.width
      } ),
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      contentXMargin: 0,
      contentYMargin: 0
    }, options );

    var backgroundNode = new Rectangle( 0, 0, CONTENT_SIZE.width, CONTENT_SIZE.height );

    var equationNode = new EquationNode( leftItemCreators, rightItemCreators, {
      maxWidth: backgroundNode.width,
      maxHeight: backgroundNode.height
    } );

    // wrapper to avoid exceeding stack size when bounds of equationNode changes
    var equationParent = new Node( {
      children: [ equationNode ]
    } );

    // Center the equation when it changes
    equationNode.on( 'bounds', function() {
      equationParent.center = backgroundNode.center;
    } );

    var contentNode = new Node( {
      children: [ backgroundNode, equationParent ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'EquationAccordionBox', EquationAccordionBox );

  return inherit( AccordionBox, EquationAccordionBox );
} );
