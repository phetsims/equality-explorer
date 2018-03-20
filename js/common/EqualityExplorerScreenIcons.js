// Copyright 2018, University of Colorado Boulder

/**
 * Methods for creating screen icons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ScreenIcon = require( 'JOIST/ScreenIcon' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // images
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );
  var phetGirlImage = require( 'image!EQUALITY_EXPLORER/phetGirl.png' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  var EqualityExplorerScreenIcons = {

    /**
     * Creates the icon for the 'Basics' screen.
     * @returns {ScreenIcon}
     */
    createBasicsScreenIcon: function() {

      // left side of the equation
      var appleNode1 = new Image( appleImage );
      var appleNode2 = new Image( appleImage, {
        left: appleNode1.left - 10,
        top: appleNode1.bottom + 5
      } );
      var appleNode3 = new Image( appleImage, {
        left: appleNode2.right + 5,
        top: appleNode1.bottom - 5
      } );
      var appleGroupNode = new Node( {
        children: [ appleNode1, appleNode2, appleNode3 ]
      } );

      // relational operator
      var greaterThanNode = new Text( MathSymbols.GREATER_THAN, {
        font: new PhetFont( 80 )
      } );

      // right side of the equation
      var orangeNode1 = new Image( orangeImage );
      var orangeNode2 = new Image( orangeImage );
      var orangeGroupNode = new VBox( {
        spacing: 10,
        children: [ orangeNode1, orangeNode2 ]
      } );

      var iconNode = new HBox( {
        spacing: 10,
        children: [ appleGroupNode, greaterThanNode, orangeGroupNode ]
      } );

      return new ScreenIcon( iconNode, {
        fill: EqualityExplorerColors.BASICS_SCREEN_BACKGROUND
      } );
    },

    /**
     * Creates the icon for the 'Numbers' screen.
     * @returns {ScreenIcon}
     */
    createNumbersScreenIcon: function() {

      // 1
      var positiveOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) );

      // -1
      var negativeOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( -1 ) );
      negativeOneNode.left = positiveOneNode.right - 10;
      negativeOneNode.bottom = positiveOneNode.centerY + 10;

      // halos
      var haloRadius = 0.85 * positiveOneNode.width;
      var positiveOneHaloNode = new HaloNode( haloRadius, {
        center: positiveOneNode.center
      } );
      var negativeOneHaloNode = new HaloNode( haloRadius, {
        center: negativeOneNode.center
      } );

      var iconNode = new Node( {
        children: [ positiveOneHaloNode, negativeOneHaloNode, positiveOneNode, negativeOneNode ]
      } );

      return new ScreenIcon( iconNode, {
        fill: EqualityExplorerColors.NUMBERS_SCREEN_BACKGROUND
      } );
    },

    /**
     * Creates the icon for the 'Variables' screen.
     * @returns {ScreenIcon}
     */
    createVariablesScreenIcon: function() {

      // left side of the equation
      var leftPositiveXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ), xString );
      var leftNegativeXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( -1 ), xString );
      var leftGroupNode = new VBox( {
        spacing: 10,
        children: [ leftPositiveXNode, leftNegativeXNode ]
      } );

      // relational operator
      var lessThanNode = new Text( MathSymbols.LESS_THAN, {
        font: new PhetFont( 50 )
      } );

      // right side of the equation
      var rightPositiveOneNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) );
      var rightPositiveXNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ), xString );
      var rightGroupNode = new VBox( {
        spacing: 10,
        children: [ rightPositiveOneNode, rightPositiveXNode ]
      } );

      var iconNode = new HBox( {
        spacing: 10,
        children: [ leftGroupNode, lessThanNode, rightGroupNode ]
      } );

      return new ScreenIcon( iconNode, {
        maxIconWidthProportion: 0.75,
        fill: EqualityExplorerColors.VARIABLES_SCREEN_BACKGROUND
      } );
    },

    /**
     * Creates the icon for the 'Solving' screen.
     * @returns {ScreenIcon}
     */
    createSolvingScreenIcon: function() {

      var operatorOptions = { font: new PhetFont( 30 ) };

      // left side of the equation
      var leftVariableTermNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 3 ), xString );
      var plusNode = new Text( MathSymbols.PLUS, operatorOptions );
      var leftConstantTermNode = ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 2 ) );

      // relational operator
      var greaterThanNode = new Text( MathSymbols.EQUAL_TO, operatorOptions );

      // ride side of the equation
      var rightVariableTermNode = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ), xString );

      var iconNode = new HBox( {
        spacing: 5,
        children: [ leftVariableTermNode, plusNode, leftConstantTermNode, greaterThanNode, rightVariableTermNode ]
      });

      return new ScreenIcon( iconNode, {
        fill: EqualityExplorerColors.SOLVING_SCREEN_BACKGROUND
      } );
    },

    /**
     * Creates the home screen icon for the 'Solve It!' screen.
     * @returns {ScreenIcon}
     */
    createSolveItHomeScreenIcon: function() {
      var iconNode = new Image( phetGirlImage );
      return new ScreenIcon( iconNode, {
        fill: EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND
      } );
    },

    /**
     * Creates the navigation bar icon for the 'Solve It!' screen.
     * @returns {ScreenIcon}
     */
    createSolveItNavigationBarIcon: function() {

      var numberNode = new Text( '7', { font: new PhetFont( 25 ) } );

      var starNode = new StarNode();

      var iconNode = new HBox( {
        spacing: 3,
        children: [ numberNode, starNode ]
      });

      return new ScreenIcon( iconNode, {
        fill: EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND
      } );
    }
  };

  equalityExplorer.register( 'EqualityExplorerScreenIcons', EqualityExplorerScreenIcons );

  return EqualityExplorerScreenIcons;
} );