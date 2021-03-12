// Copyright 2018-2020, University of Colorado Boulder

/**
 * Methods for creating screen icons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Fraction from '../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import StarNode from '../../../scenery-phet/js/StarNode.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import phetGirlJugglingStarsImage from '../../../vegas/images/phet-girl-juggling-stars_png.js';
import appleBigImage from '../../images/appleBig_png.js';
import orangeBigImage from '../../images/orangeBig_png.js';
import equalityExplorer from '../equalityExplorer.js';
import equalityExplorerStrings from '../equalityExplorerStrings.js';
import EqualityExplorerColors from './EqualityExplorerColors.js';
import ConstantTermNode from './view/ConstantTermNode.js';
import HaloNode from './view/HaloNode.js';
import VariableTermNode from './view/VariableTermNode.js';

const EqualityExplorerScreenIcons = {

  /**
   * Creates the icon for the 'Basics' screen: apples > oranges
   * @returns {ScreenIcon}
   */
  createBasicsScreenIcon: function() {

    // apples on left side of the equation
    const appleNode1 = new Image( appleBigImage );
    const appleNode2 = new Image( appleBigImage, {
      left: appleNode1.left - 10,
      top: appleNode1.bottom + 5
    } );
    const appleGroupNode = new VBox( {
      spacing: 2,
      children: [ appleNode1, appleNode2 ]
    } );

    // >
    const greaterThanNode = new Text( MathSymbols.GREATER_THAN, {
      font: new PhetFont( 140 )
    } );

    // an orange on right side of the equation
    const orangeNode = new Image( orangeBigImage );

    const iconNode = new HBox( {
      spacing: 15,
      children: [ appleGroupNode, greaterThanNode, orangeNode ]
    } );

    return new ScreenIcon( iconNode, {
      maxIconHeightProportion: 0.8,
      fill: EqualityExplorerColors.BASICS_SCREEN_BACKGROUND
    } );
  },

  /**
   * Creates the icon for the 'Numbers' screen: 1 and -1 overlapping
   * @returns {ScreenIcon}
   */
  createNumbersScreenIcon: function() {

    // 1
    const positiveOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) );

    // -1
    const negativeOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( -1 ) );

    // -1 overlaps 1
    negativeOneNode.left = positiveOneNode.right - 10;
    negativeOneNode.bottom = positiveOneNode.centerY + 10;

    // halos
    const haloRadius = 0.85 * positiveOneNode.width;
    const positiveOneHaloNode = new HaloNode( haloRadius, {
      center: positiveOneNode.center
    } );
    const negativeOneHaloNode = new HaloNode( haloRadius, {
      center: negativeOneNode.center
    } );

    const iconNode = new Node( {
      children: [ positiveOneHaloNode, negativeOneHaloNode, positiveOneNode, negativeOneNode ]
    } );

    return new ScreenIcon( iconNode, {
      fill: EqualityExplorerColors.NUMBERS_SCREEN_BACKGROUND
    } );
  },

  /**
   * Creates the icon for the 'Variables' screen: x, -x < 1, x
   * @returns {ScreenIcon}
   */
  createVariablesScreenIcon: function() {

    // x and -x on left side of the equation
    const leftPositiveXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ), equalityExplorerStrings.x );
    const leftNegativeXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( -1 ), equalityExplorerStrings.x );
    const leftGroupNode = new VBox( {
      children: [ leftPositiveXNode, leftNegativeXNode ]
    } );

    // <
    const lessThanNode = new Text( MathSymbols.LESS_THAN, {
      font: new PhetFont( 50 )
    } );

    // 1 and x on right side of the equation
    const rightPositiveOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) );
    const rightPositiveXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ), equalityExplorerStrings.x );
    const rightGroupNode = new VBox( {
      children: [ rightPositiveOneNode, rightPositiveXNode ]
    } );

    const iconNode = new HBox( {
      spacing: 10,
      children: [ leftGroupNode, lessThanNode, rightGroupNode ]
    } );

    return new ScreenIcon( iconNode, {
      maxIconWidthProportion: 0.75,
      fill: EqualityExplorerColors.VARIABLES_SCREEN_BACKGROUND
    } );
  },

  /**
   * Creates the icon for the 'Operations' screen: 3x = 6
   * @returns {ScreenIcon}
   */
  createOperationsScreenIcon: function() {

    const operatorOptions = { font: new PhetFont( 30 ) };

    // 3x on left side of equation
    const variableTermNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 3 ), equalityExplorerStrings.x );

    // =
    const greaterThanNode = new Text( MathSymbols.EQUAL_TO, operatorOptions );

    // 6 on right side of equation
    const constantTermNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 6 ) );

    const iconNode = new HBox( {
      spacing: 5,
      children: [ variableTermNode, greaterThanNode, constantTermNode ]
    } );

    return new ScreenIcon( iconNode, {
      maxIconWidthProportion: 0.75,
      fill: EqualityExplorerColors.SOLVING_SCREEN_BACKGROUND
    } );
  },

  /**
   * Creates the home screen icon for the 'Solve It!' screen: PhET girl juggling stars
   * @returns {ScreenIcon}
   */
  createSolveItHomeScreenIcon: function() {
    const iconNode = new Image( phetGirlJugglingStarsImage );
    return new ScreenIcon( iconNode, {
      fill: EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND
    } );
  },

  /**
   * Creates the navigation bar icon for the 'Solve It!' screen: +1 star
   * @returns {ScreenIcon}
   */
  createSolveItNavigationBarIcon: function() {

    const numberNode = new Text( `${MathSymbols.UNARY_PLUS}1`, { font: new PhetFont( 25 ) } );
    const starNode = new StarNode();

    const iconNode = new HBox( {
      spacing: 3,
      children: [ numberNode, starNode ]
    } );

    return new ScreenIcon( iconNode, {
      maxIconWidthProportion: 0.75,
      fill: EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND
    } );
  }
};

equalityExplorer.register( 'EqualityExplorerScreenIcons', EqualityExplorerScreenIcons );

export default EqualityExplorerScreenIcons;