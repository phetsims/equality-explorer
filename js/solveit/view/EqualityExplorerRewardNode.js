// Copyright 2018, University of Colorado Boulder

/**
 * This is the reward that's shown behind RewardDialog when the user gets to 10 stars.
 * The reward varies by level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ChallengeGenerator = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator' );
  const ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  const ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const FaceNode = require( 'SCENERY_PHET/FaceNode' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const RewardNode = require( 'VEGAS/RewardNode' );
  const StarNode = require( 'SCENERY_PHET/StarNode' );
  const UniversalOperation = require( 'EQUALITY_EXPLORER/common/model/UniversalOperation' );
  const UniversalOperationNode = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationNode' );
  const VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  // images
  const appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  const catImage = require( 'image!EQUALITY_EXPLORER/cat.png' );
  const dogImage = require( 'image!EQUALITY_EXPLORER/dog.png' );
  const orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );

  // strings
  const xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  const DIAMETER = 40;
  const IMAGE_OPTIONS = { maxHeight: DIAMETER };

  // Range for coefficients and constants, zero excluded
  const INTEGER_VALUES = ChallengeGenerator.rangeToArray( -9, 9 );
  INTEGER_VALUES.splice( INTEGER_VALUES.indexOf( 0 ), 1 );

  // Node instances that are reused throughout the rewards
  const APPLE_NODE = new Image( appleImage, IMAGE_OPTIONS );
  const CAT_NODE = new Image( catImage, IMAGE_OPTIONS );
  const DOG_NODE = new Image( dogImage, IMAGE_OPTIONS );
  const ORANGE_NODE = new Image( orangeImage, IMAGE_OPTIONS );
  const STAR_NODE = new StarNode( {
    innerRadius: DIAMETER / 4,
    outerRadius: DIAMETER / 2
  } );
  const FACE_NODE = new FaceNode( DIAMETER, {
    headStroke: 'black'
  } );

  /**
   * @param {number} level - the game level
   * @constructor
   */
  function EqualityExplorerRewardNode( level ) {

    const createNodesFunction = [ createNodes1, createNodes2, createNodes3, createNodes4 ];

    const nodes = createNodesFunction[ level - 1 ]();

    RewardNode.call( this, {
      nodes: RewardNode.createRandomNodes( nodes, 100 /* count */ )
    } );
  }

  equalityExplorer.register( 'EqualityExplorerRewardNode', EqualityExplorerRewardNode );

  // Creates nodes for level 1 reward.
  function createNodes1() {
    const nodes = [];
    INTEGER_VALUES.forEach( function( i ) {

      // variable terms with integer coefficients
      nodes.push( createVariableTermNode( i ) );

      // constant terms with integer values
      nodes.push( createIntegerConstantTermNode( i ) );

      // apples & oranges
      nodes.push( APPLE_NODE );
      nodes.push( ORANGE_NODE );
    } );
    return nodes;
  }

  // Creates nodes for level 2 reward.
  function createNodes2() {
    const nodes = [];
    INTEGER_VALUES.forEach( function( i ) {

      // variable terms with integer coefficients
      nodes.push( createVariableTermNode( i ) );

      // constant terms with integer values
      nodes.push( createIntegerConstantTermNode( i ) );

      // random operations on integers
      nodes.push( createOperationNode() );

      // stars
      nodes.push( STAR_NODE );
    } );
    return nodes;
  }

  // Creates nodes for level 3 reward.
  function createNodes3() {
    const nodes = [];
    INTEGER_VALUES.forEach( function( i ) {

      // variable terms with integer coefficients
      nodes.push( createVariableTermNode( i ) );

      // constant terms with fraction values
      nodes.push( createFractionConstantTermNode() );

      // random operations on integers
      nodes.push( createOperationNode() );

      // smiley faces
      nodes.push( FACE_NODE );
    } );
    return nodes;
  }

  // Creates nodes for level 4 reward.
  function createNodes4() {
    const nodes = [];
    INTEGER_VALUES.forEach( function( i ) {

      // variable terms with integer coefficients
      nodes.push( createVariableTermNode( i ) );

      // constant terms with integer values
      nodes.push( createIntegerConstantTermNode( i ) );

      // cats and dogs
      nodes.push( CAT_NODE );
      nodes.push( DOG_NODE );
    } );
    return nodes;
  }

  /**
   * Create a variable term node with a specified integer coefficient.
   * @param {number} coefficient
   * @returns {Node}
   */
  function createVariableTermNode( coefficient ) {
    return VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( coefficient ), xString, {
      diameter: DIAMETER,
      showOne: true // show coefficient for '1x'
    } );
  }

  /**
   * Creates a constant term node with a specified integer value.
   * @param {number} constantValue
   * @returns {Node}
   */
  function createIntegerConstantTermNode( constantValue ) {
    return ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( constantValue ), {
      diameter: DIAMETER
    } );
  }

  /**
   * Creates a constant term node with a random fraction value.
   * @returns {Node}
   */
  function createFractionConstantTermNode() {
    const numerator = ChallengeGenerator.randomValue( INTEGER_VALUES, [ 0 ] );
    const denominator = ChallengeGenerator.randomValueBy( INTEGER_VALUES,
      function( denominator ) {
        return ( denominator !== 0 ) && ( Math.abs( denominator ) !== 1 ) && ( numerator % denominator !== 0 );
      } );
    const constantValue = new Fraction( numerator, denominator ).reduced();
    return ConstantTermNode.createInteractiveTermNode( constantValue, {
      diameter: DIAMETER
    } );
  }

  /**
   * Creates an operation node with a random operator and a random positive integer operand.
   * @returns {Node}
   */
  function createOperationNode() {
    const operator = randomOperator();
    const constantValue = ChallengeGenerator.randomValueBy( INTEGER_VALUES,
      function( value ) {
        return ( value > 0 );
      } );
    const operand = new ConstantTerm( { constantValue: Fraction.fromInteger( constantValue ) } );
    const operation = new UniversalOperation( operator, operand );
    return new UniversalOperationNode( operation, {
      maxHeight: DIAMETER
    } );
  }

  /**
   * Chooses a random operator.
   * @returns {string} see EqualityExplorerConstants.OPERATORS
   */
  function randomOperator() {
    return phet.joist.random.sample( EqualityExplorerConstants.OPERATORS );
  }

  return inherit( RewardNode, EqualityExplorerRewardNode );
} );
