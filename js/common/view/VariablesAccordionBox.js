// Copyright 2017-2018, University of Colorado Boulder

/**
 * Accordion box that allows the student to modify the value of one or more variables.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var ObjectVariable = require( 'EQUALITY_EXPLORER/basics/model/ObjectVariable' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var variableString = require( 'string!EQUALITY_EXPLORER/variable' );
  var variablesString = require( 'string!EQUALITY_EXPLORER/variables' );

  /**
   * @param {Variable[]} variables - the variables that appear in this accordion box
   * @param {Object} [options]
   * @constructor
   */
  function VariablesAccordionBox( variables, options ) {

    options = _.extend( {}, EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {

      // this accordion box is designed to be a fixed width, regardless of its content
      titleString: ( variables.length > 1 ) ? variablesString : variableString,
      fixedWidth: 100,
      fontSize: 24,

      // supertype options
      showTitleWhenExpanded: false,
      contentXMargin: 20,
      contentYMargin: 10

    }, options );

    assert && assert( options.maxWidth === undefined, 'VariablesAccordionBox sets maxWidth' );
    options.maxWidth = options.fixedWidth;

    var contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    assert && assert( !options.titleNode, 'VariablesAccordionBox sets titleNode' );
    options.titleNode = new Text( options.titleString, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentWidth
    } );

    var strut = new HStrut( contentWidth );

    // Create a picker for each variable
    var children = [];
    variables.forEach( function( variable ) {

      var symbolNode;
      if ( variable instanceof ObjectVariable ) {

        // use an image for a variable associated with a real-world object
        symbolNode = new Image( variable.image, {
          scale: 0.75 // determined empirically
        } );
      }
      else {

        // use text for a symbolic variable, e.g 'x'
        symbolNode = new Text( variable.symbol, {
          font: new MathSymbolFont( options.fontSize ),
          maxWidth: 0.5 * contentWidth
        } );
      }

      var equalsText = new Text( MathSymbols.EQUAL_TO, {
        font: new PhetFont( options.fontSize )
      } );

      // NumberPicker.dispose not needed, VariablesAccordionBox exists for lifetime of the sim
      var valuePicker = new NumberPicker( variable.valueProperty, new Property( variable.range ), {
        color: 'black',
        font: new PhetFont( options.fontSize ),
        xMargin: 6,
        touchAreaYDilation: 15
      } );

      children.push( new HBox( {
        children: [ symbolNode, equalsText, valuePicker ],
        spacing: 5,
        maxWidth: contentWidth
      } ) );
    } );

    var hBox = new HBox( {
      children: children,
      spacing: 25,
      maxWidth: contentWidth,
      center: strut.center
    } );

    var contentNode = new Node( {
      children: [ strut, hBox ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'VariablesAccordionBox', VariablesAccordionBox );

  return inherit( AccordionBox, VariablesAccordionBox );
} );
