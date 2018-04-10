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
  var EquationPanel = require( 'EQUALITY_EXPLORER/common/view/EquationPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
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

    var contentNode = new EquationPanel( leftTermCreators, rightTermCreators, {
      contentWidth: options.fixedWidth - ( 2 * options.contentXMargin ),
      contentHeight: options.fixedHeight - ( 2 * options.contentYMargin )
    } );

    assert && assert( !options.titleNode, 'EquationAccordionBox sets titleNode' );
    options.titleNode = options.titleNode || new Text( equationOrInequalityString, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentNode.width
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'EquationAccordionBox', EquationAccordionBox );

  return inherit( AccordionBox, EquationAccordionBox );
} );
