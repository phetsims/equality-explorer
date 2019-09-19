// Copyright 2018, University of Colorado Boulder

/**
 * Methods for creating screen icons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ScreenIcon = require( 'JOIST/ScreenIcon' );
  const StarNode = require( 'SCENERY_PHET/StarNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const appleBigImage = require( 'image!EQUALITY_EXPLORER/appleBig.png' );
  const orangeBigImage = require( 'image!EQUALITY_EXPLORER/orangeBig.png' );
  const phetGirlJugglingStarsImage = require( 'image!VEGAS/phet-girl-juggling-stars.png' );

  // strings
  const xString = require( 'string!EQUALITY_EXPLORER/x' );

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
      const leftPositiveXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ), xString );
      const leftNegativeXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( -1 ), xString );
      const leftGroupNode = new VBox( {
        children: [ leftPositiveXNode, leftNegativeXNode ]
      } );

      // <
      const lessThanNode = new Text( MathSymbols.LESS_THAN, {
        font: new PhetFont( 50 )
      } );

      // 1 and x on right side of the equation
      const rightPositiveOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) );
      const rightPositiveXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ), xString );
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
      const variableTermNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 3 ), xString );

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

      const numberNode = new Text( MathSymbols.UNARY_PLUS + '1', { font: new PhetFont( 25 ) } );
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

  return EqualityExplorerScreenIcons;
} );