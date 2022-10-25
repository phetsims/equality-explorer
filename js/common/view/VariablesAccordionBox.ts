// Copyright 2017-2022, University of Colorado Boulder

/**
 * Accordion box that allows the student to modify the value of one or more variables.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, NodeTranslationOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import Variable from '../model/Variable.js';
import VariableNode from './VariableNode.js';

type SelfOptions = {
  titleStringProperty?: TReadOnlyProperty<string>;
  fontSize?: number;

  // this accordion box is designed to have a fixed size, regardless of its content
  fixedWidth?: number;
  fixedHeight?: number;
};

type VariablesAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>;

export default class VariablesAccordionBox extends AccordionBox {

  /**
   * @param variables - in the order that they appear in the accordion box, from left to right
   * @param providedOptions
   */
  public constructor( variables: Variable[], providedOptions: VariablesAccordionBoxOptions ) {

    assert && assert( variables.length > 0 );

    const options = optionize4<VariablesAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {},
      EqualityExplorerConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        titleStringProperty: ( variables.length > 1 ) ?
                             EqualityExplorerStrings.variablesStringProperty :
                             EqualityExplorerStrings.variableStringProperty,
        fontSize: 24,
        fixedWidth: 100,
        fixedHeight: 75,

        // AccordionBoxOptions
        showTitleWhenExpanded: false,
        contentXMargin: 20,
        contentYMargin: 4
      }, providedOptions );

    options.maxWidth = options.fixedWidth;
    options.maxHeight = options.fixedHeight;

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );
    const contentHeight = options.fixedHeight - ( 2 * options.contentYMargin );

    options.titleNode = new Text( options.titleStringProperty, {
      font: EqualityExplorerConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 0.85 * contentWidth,
      tandem: options.tandem.createTandem( 'titleText' )
    } );

    const backgroundNode = new Rectangle( 0, 0, contentWidth, contentHeight );

    // Create a picker for each variable
    const children: Node[] = [];
    variables.forEach( variable => {

      const variableNode = new VariableNode( variable, {
        iconScale: 0.55,
        fontSize: options.fontSize
      } );

      const equalsText = new Text( MathSymbols.EQUAL_TO, {
        font: new PhetFont( options.fontSize )
      } );

      const labeledPickerNodeTandem = options.tandem.createTandem( `${variable.tandem.name}LabeledPickerNode` );

      const variableRange = variable.range!;
      assert && assert( variableRange, 'Variable must have range' );
      const valuePicker = new NumberPicker( variable.valueProperty, new Property( variableRange ), {
        color: 'black',
        font: new PhetFont( options.fontSize ),
        xMargin: 6,
        touchAreaYDilation: 15,
        tandem: labeledPickerNodeTandem.createTandem( 'numberPicker' ),
        phetioVisiblePropertyInstrumented: false
      } );

      const labeledPickerNode = new HBox( {
        children: [ variableNode, equalsText, valuePicker ],
        spacing: 5,
        maxWidth: contentWidth,
        maxHeight: contentHeight,
        tandem: labeledPickerNodeTandem,
        phetioEnabledPropertyInstrumented: true
      } );

      children.push( labeledPickerNode );
    } );

    const hBox = new HBox( {
      children: children,
      spacing: 25,
      maxWidth: contentWidth
    } );
    hBox.boundsProperty.link( bounds => {
      hBox.center = backgroundNode.center;
    } );

    const contentNode = new Node( {
      children: [ backgroundNode, hBox ]
    } );

    super( contentNode, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'VariablesAccordionBox', VariablesAccordionBox );