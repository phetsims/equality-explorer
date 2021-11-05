// Copyright 2018-2021, University of Colorado Boulder

/**
 * This is the reward that's shown behind RewardDialog when the user gets to 10 stars.
 * The reward varies by level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RewardNode from '../../../../vegas/js/RewardNode.js';
import apple_png from '../../../images/apple_png.js';
import cat_png from '../../../images/cat_png.js';
import dog_png from '../../../images/dog_png.js';
import orange_png from '../../../images/orange_png.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import ConstantTerm from '../../common/model/ConstantTerm.js';
import UniversalOperation from '../../common/model/UniversalOperation.js';
import ConstantTermNode from '../../common/view/ConstantTermNode.js';
import UniversalOperationNode from '../../common/view/UniversalOperationNode.js';
import VariableTermNode from '../../common/view/VariableTermNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import equalityExplorerStrings from '../../equalityExplorerStrings.js';
import ChallengeGenerator from '../model/ChallengeGenerator.js';

// constants
const DIAMETER = 40;
const IMAGE_OPTIONS = { maxHeight: DIAMETER };

// Range for coefficients and constants, zero excluded
const INTEGER_VALUES = ChallengeGenerator.rangeToArray( -9, 9 );
INTEGER_VALUES.splice( INTEGER_VALUES.indexOf( 0 ), 1 );

// Node instances that are reused throughout the rewards
const APPLE_NODE = new Image( apple_png, IMAGE_OPTIONS );
const CAT_NODE = new Image( cat_png, IMAGE_OPTIONS );
const DOG_NODE = new Image( dog_png, IMAGE_OPTIONS );
const ORANGE_NODE = new Image( orange_png, IMAGE_OPTIONS );
const STAR_NODE = new StarNode( {
  innerRadius: DIAMETER / 4,
  outerRadius: DIAMETER / 2
} );
const FACE_NODE = new FaceNode( DIAMETER, {
  headStroke: 'black'
} );

class EqualityExplorerRewardNode extends RewardNode {

  /**
   * @param {number} level - the game level
   */
  constructor( level ) {

    const createNodesFunction = [ createNodes1, createNodes2, createNodes3, createNodes4, createNodes5 ];

    const nodes = createNodesFunction[ level - 1 ]();

    super( {
      nodes: RewardNode.createRandomNodes( nodes, 100 /* count */ )
    } );
  }
}

// Creates nodes for level 1 reward.
function createNodes1() {
  return createNodes2(); //TODO https://github.com/phetsims/equality-explorer/issues/164 what reward for level 1?
}

// Creates nodes for level 2 reward.
function createNodes2() {
  const nodes = [];
  INTEGER_VALUES.forEach( i => {

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

// Creates nodes for level 3 reward.
function createNodes3() {
  const nodes = [];
  INTEGER_VALUES.forEach( i => {

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

// Creates nodes for level 4 reward.
function createNodes4() {
  const nodes = [];
  INTEGER_VALUES.forEach( i => {

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

// Creates nodes for level 5 reward.
function createNodes5() {
  const nodes = [];
  INTEGER_VALUES.forEach( i => {

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
  return VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( coefficient ), equalityExplorerStrings.x, {
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
    denominator => ( denominator !== 0 ) && ( Math.abs( denominator ) !== 1 ) && ( numerator % denominator !== 0 )
  );
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
  const constantValue = ChallengeGenerator.randomValueBy( INTEGER_VALUES, value => ( value > 0 ) );
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
  return dotRandom.sample( EqualityExplorerConstants.OPERATORS );
}

equalityExplorer.register( 'EqualityExplorerRewardNode', EqualityExplorerRewardNode );

export default EqualityExplorerRewardNode;