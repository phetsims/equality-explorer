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
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
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

      // this accordion box is designed to be a fixed width, regardless of its content
      fixedWidth: 100,

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
      contentXMargin: 5,
      contentYMargin: 8
    }, options );

    assert && assert( options.maxWidth === undefined, 'maxWidth is set by this Node' );
    options.maxWidth = options.fixedWidth;

    var contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    options.titleNode = options.titleNode || new Text( equationOrInequalityString, {
        font: new PhetFont( EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT_SIZE ),
        maxWidth: 0.85 * contentWidth
      } );

    var strut = new HStrut( contentWidth );

    var equationNode = new EquationNode( leftTermCreators, rightTermCreators );

    // wrapper to avoid exceeding stack size when bounds of equationNode changes
    var equationParent = new Node( {
      children: [ equationNode ],
      maxWidth: contentWidth
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
