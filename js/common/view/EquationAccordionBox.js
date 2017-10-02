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
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EquationNode = require( 'EQUALITY_EXPLORER/common/view/EquationNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var equationOrInequalityString = require( 'string!EQUALITY_EXPLORER/equationOrInequality' );

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function EquationAccordionBox( leftItemCreators, rightItemCreators, options ) {

    options = _.extend( {

      fixedWidth: 600,

      // supertype options
      fill: 'white',
      showTitleWhenExpanded: false,
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      contentXMargin: 0,
      contentYMargin: 8
    }, options );

    assert && assert( options.maxWidth === undefined, 'subtype defines its maxWidth' );
    options.maxWidth = options.fixedWidth;

    options.titleNode = options.titleNode || new Text( equationOrInequalityString, {
        font: new PhetFont( 18 ),
        maxWidth: 0.85 * options.fixedWidth
      } );

    var contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );
    var strut = new HStrut( contentWidth );

    var equationNode = new EquationNode( leftItemCreators, rightItemCreators );

    // wrapper to avoid exceeding stack size when bounds of equationNode changes
    var equationParent = new Node( {
      children: [ equationNode ]
    } );

    // Center the equation when it changes
    equationNode.on( 'bounds', function() {
      equationParent.x = strut.centerX;
      equationParent.centerY = strut.centerY;
    } );

    var contentNode = new Node( {
      children: [ strut, equationParent ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'EquationAccordionBox', EquationAccordionBox );

  return inherit( AccordionBox, EquationAccordionBox );
} );
