// Copyright 2017-2018, University of Colorado Boulder

/**
 * Displays an equation or inequality.
 * Designed to support multiple variables, but has only been tested extensively with 1 variable.
 * Origin is at the center of the relational operator, to facilitate horizontal alignment with the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Multilink = require( 'AXON/Multilink' );
  var MysteryTermCreator = require( 'EQUALITY_EXPLORER/basics/model/MysteryTermCreator' );
  var MysteryTermNode = require( 'EQUALITY_EXPLORER/basics/view/MysteryTermNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  /**
   * @param {TermCreator[]} leftTermCreators - left side of equation, terms appear in this order
   * @param {TermCreator[]} rightTermCreators - right side of equation, terms appear in this order
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( leftTermCreators, rightTermCreators, options ) {

    var self = this;

    options = _.extend( {

      // Update the view when the model changes?
      // Set this to false to create a static equation.
      updateEnabled: true,

      // fonts sizes, optimized for EquationAccordionBox
      synbolFontSize: 28,
      operatorFontSize: 28,
      integerFontSize: 28,
      fractionFontSize: 16,
      relationalOperatorFontSize: 40,

      // horizontal spacing
      coefficientSpacing: 3, // space between coefficient and icon
      plusSpacing: 8, // space around plus operator
      relationalOperatorSpacing: 20 // space around the relational operator

    }, options );

    // fonts for various parts of the equation
    var symbolFont = new MathSymbolFont( options.synbolFontSize );
    var operatorFont = new PhetFont( options.operatorFontSize );
    var relationalOperatorFont = new PhetFont( { size: options.relationalOperatorFontSize, weight: 'bold' } );
    var integerFont = new PhetFont( options.integerFontSize );
    var fractionFont = new PhetFont( options.fractionFontSize );

    Node.call( this );

    var leftSideNode = null;
    var rightSideNode = null;
    var relationalOperatorNode = new Text( '?', { font: relationalOperatorFont } );

    // updates the equation's layout, origin at the center of the relational operator
    var updateLayout = function() {
      if ( leftSideNode && rightSideNode ) {
        relationalOperatorNode.centerX = 0;
        relationalOperatorNode.centerY = 0;
        leftSideNode.right = relationalOperatorNode.left - options.relationalOperatorSpacing;
        leftSideNode.centerY = relationalOperatorNode.centerY;
        rightSideNode.left = relationalOperatorNode.right + options.relationalOperatorSpacing;
        rightSideNode.centerY = relationalOperatorNode.centerY;
      }
    };

    // updates the relational operator based on left vs right weight
    var updateRelationalOperator = function() {
      relationalOperatorNode.text = getRelationalOperator( leftTermCreators, rightTermCreators );
      updateLayout();
    };

    // updates the equation's terms
    var updateTerms = function() {

      leftSideNode = createSideNode( leftTermCreators, symbolFont, operatorFont, integerFont, fractionFont,
        options.coefficientSpacing, options.plusSpacing );

      rightSideNode = createSideNode( rightTermCreators, symbolFont, operatorFont, integerFont, fractionFont,
        options.coefficientSpacing, options.plusSpacing );

      self.children = [ leftSideNode, relationalOperatorNode, rightSideNode ];
      updateLayout();
    };

    if ( options.updateEnabled ) {

      // dynamic equation

      // {TermCreator[]} all TermCreator instances
      var termCreators = leftTermCreators.concat( rightTermCreators );

      // {Property[]} dependencies that require the relational operator to be updated
      var relationalOperatorDependencies = [];

      // {Property[]} dependencies that require the terms to be updated
      var termDependencies = [];

      termCreators.forEach( function( termCreator ) {
        relationalOperatorDependencies.push( termCreator.weightOnPlateProperty );
        termDependencies.push( termCreator.numberOfTermsOnPlateProperty );
      } );

      // dispose required
      var relationalOperatorMultilink = new Multilink( relationalOperatorDependencies, updateRelationalOperator );
      var termsMultilink = new Multilink( termDependencies, updateTerms );
    }
    else {

      // static equation
      updateRelationalOperator();
      updateTerms();
    }

    // @private
    this.disposeEquationNode = function() {
      relationalOperatorMultilink && relationalOperatorMultilink.dispose();
      termsMultilink && termsMultilink.dispose();
    };

    this.mutate( options );
  }

  equalityExplorer.register( 'EquationNode', EquationNode );

  /**
   * Gets the operator that describes the relationship between the left and right sides.
   * @param {TermCreator[]} leftTermCreators
   * @param {TermCreator[]} rightTermCreators
   * @param {Font} font
   * @returns {string}
   */
  function getRelationalOperator( leftTermCreators, rightTermCreators, font ) {

    // evaluate the left side
    var leftWeight = 0;
    for ( var i = 0; i < leftTermCreators.length; i++ ) {
      leftWeight += leftTermCreators[ i ].weightOnPlateProperty.value.toDecimal();
    }

    // evaluate the right side
    var rightWeight = 0;
    for ( i = 0; i < rightTermCreators.length; i++ ) {
      rightWeight += rightTermCreators[ i ].weightOnPlateProperty.value.toDecimal();
    }

    // determine the operator that describes the relationship between left and right sides
    var relationalOperator = null;
    if ( leftWeight < rightWeight ) {
      relationalOperator = MathSymbols.LESS_THAN;
    }
    else if ( leftWeight > rightWeight ) {
      relationalOperator = MathSymbols.GREATER_THAN;
    }
    else {
      relationalOperator = MathSymbols.EQUAL_TO;
    }

    return relationalOperator;
  }

  /**
   * Creates one side of the equation.
   * @param {TermCreator[]} termCreators
   * @param {Font} symbolFont - font for variables, like 'x'
   * @param {Font} operatorFont
   * @param {Font} integerFont
   * @param {Font} fractionFont
   * @param {number} coefficientSpacing - space between coefficients and icons
   * @param {number} plusSpacing - space around plus operators
   * @returns {Node}
   */
  function createSideNode( termCreators, symbolFont, operatorFont, integerFont, fractionFont, coefficientSpacing, plusSpacing ) {

    var constantValue = ReducedFraction.withInteger( 0 );
    var coefficients = {}; // map from {string} variable to {ReducedFraction} coefficient, e.g. { x: 3/5 }

    var children = [];
    for ( var i = 0; i < termCreators.length; i++ ) {

      var termCreator = termCreators[ i ];

      var numberOfTermsOnPlate = termCreator.numberOfTermsOnPlateProperty.value;
      if ( numberOfTermsOnPlate > 0 ) {

        if ( termCreator instanceof MysteryTermCreator ) {

          // mystery terms are displayed as a coefficient and icon
          if ( children.length > 0 ) {
            children.push( new Text( MathSymbols.PLUS, { font: operatorFont } ) );
          }

          // Each mystery term has an implicit coefficient of 1, so the use the number of terms as the coefficient.
          children.push( MysteryTermNode.createEquationTermNode( numberOfTermsOnPlate, termCreator.icon, {
            font: integerFont,
            spacing: coefficientSpacing
          } ) );
        }
        else if ( termCreator instanceof VariableTermCreator ) {

          // variable terms contribute to the coefficient for their associated variable
          if ( !coefficients.hasOwnProperty( termCreator.symbol ) ) {
            coefficients[ termCreator.symbol ] = ReducedFraction.withInteger( 0 );
          }
          coefficients[ termCreator.symbol ] = coefficients[ termCreator.symbol ].plusFraction( termCreator.sumCoefficientsOnScale() );
        }
        else if ( termCreator instanceof ConstantTermCreator ) {

          // constant terms contribute their weight to the constant term
          constantValue = constantValue.plusFraction( termCreator.weightOnPlateProperty.value );
        }
        else {
          throw new Error( 'unsupported termCreator type' );
        }
      }
    }

    // Create a term for each variable that has a non-zero coefficient.
    for ( var property in coefficients ) {
      if ( coefficients.hasOwnProperty( property ) ) {

        var coefficient = coefficients[ property ]; // {ReducedFraction}

        if ( coefficient.toDecimal() !== 0 ) {

          var variableTermOptions = {
            integerFont: integerFont,
            fractionFont: fractionFont,
            symbolFont: symbolFont,
            coefficientSpacing: coefficientSpacing
          };

          if ( children.length > 0 ) {

            // if there were previous terms, replace the coefficient's sign with an operator
            var operator = ( coefficient.toDecimal() > 0 ) ? MathSymbols.PLUS : MathSymbols.MINUS;
            children.push( new Text( operator, { font: operatorFont } ) );
            children.push( VariableTermNode.createEquationTermNode( coefficient.abs(), property, variableTermOptions ) );
          }
          else {

            // if there were no variable terms, keep the constant's sign
            children.push( VariableTermNode.createEquationTermNode( coefficient, property, variableTermOptions ) );
          }
        }
      }
    }

    // put the non-zero constant term last
    if ( constantValue.toDecimal() !== 0 ) {

      var constantTermOptions = {
        integerFont: integerFont,
        fractionFont: fractionFont
      };

      // put the constant term last
      if ( children.length > 0 ) {

        // if there were previous terms, replace the constant's sign with an operator
        operator = ( constantValue.toDecimal() > 0 ) ? MathSymbols.PLUS : MathSymbols.MINUS;
        children.push( new Text( operator, { font: operatorFont } ) );
        children.push( ConstantTermNode.createEquationTermNode( constantValue.abs(), constantTermOptions ) );
      }
      else {

        // if there were no previous terms, keep the constant's sign
        children.push( ConstantTermNode.createEquationTermNode( constantValue, constantTermOptions ) );
      }
    }

    // if there were no terms, then this side of the equation evaluated to zero
    if ( children.length === 0 ) {
      children.push( new Text( '0', { font: integerFont } ) );
    }

    return new HBox( {
      spacing: plusSpacing,
      children: children
    } );
  }

  return inherit( Node, EquationNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeEquationNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
