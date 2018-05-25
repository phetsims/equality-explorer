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
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Multilink = require( 'AXON/Multilink' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ObjectTermCreator = require( 'EQUALITY_EXPLORER/basics/model/ObjectTermCreator' );
  var ObjectTermNode = require( 'EQUALITY_EXPLORER/basics/view/ObjectTermNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  // constants
  var DEFAULT_FONT_SIZE = 30;

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
      symbolFontSize: DEFAULT_FONT_SIZE,
      operatorFontSize: DEFAULT_FONT_SIZE,
      integerFontSize: DEFAULT_FONT_SIZE,
      fractionFontSize: 0.6 * DEFAULT_FONT_SIZE,
      relationalOperatorFontSize: 1.5 * DEFAULT_FONT_SIZE,

      relationalOperatorFontWeight: 'bold',

      // horizontal spacing
      coefficientSpacing: 3, // space between coefficient and icon
      plusSpacing: 8, // space around plus operator
      relationalOperatorSpacing: 20 // space around the relational operator

    }, options );

    Node.call( this );

    var leftSideNode = null;
    var rightSideNode = null;
    var relationalOperatorNode = new Text( '?', {
      font: new PhetFont( {
        size: options.relationalOperatorFontSize,
        weight: options.relationalOperatorFontWeight
      } )
    } );

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

    // configuration information one side of the equation, passed to createSideNode
    var sideConfig = {
      symbolFont: new MathSymbolFont( options.symbolFontSize ),
      operatorFont: new PhetFont( options.operatorFontSize ),
      integerFont: new PhetFont( options.integerFontSize ),
      fractionFont: new PhetFont( options.fractionFontSize ),
      coefficientSpacing: options.coefficientSpacing,
      plusSpacing: options.plusSpacing
    };

    // updates the equation's terms
    var updateTerms = function() {
      leftSideNode = createSideNode( leftTermCreators, sideConfig );
      rightSideNode = createSideNode( rightTermCreators, sideConfig );
      self.children = [ leftSideNode, relationalOperatorNode, rightSideNode ];
      updateLayout();
    };

    // if the equation needs to be dynamically updated ...
    if ( options.updateEnabled ) {

      // {Property[]} dependencies that require the relational operator to be updated
      var relationalOperatorDependencies = [];

      // {Property[]} dependencies that require the terms to be updated
      var termDependencies = [];

      // Gather dependencies for all term creators...
      leftTermCreators.concat( rightTermCreators ).forEach( function( termCreator ) {
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
   * @returns {string}
   */
  function getRelationalOperator( leftTermCreators, rightTermCreators ) {

    // evaluate the left side
    var leftWeight = Fraction.fromInteger( 0 );
    for ( var i = 0; i < leftTermCreators.length; i++ ) {
      leftWeight = leftWeight.plus( leftTermCreators[ i ].weightOnPlateProperty.value );
    }

    // evaluate the right side
    var rightWeight = Fraction.fromInteger( 0 );
    for ( i = 0; i < rightTermCreators.length; i++ ) {
      rightWeight = rightWeight.plus( rightTermCreators[ i ].weightOnPlateProperty.value );
    }

    // determine the operator that describes the relationship between left and right sides
    var relationalOperator = null;
    if ( leftWeight.isLessThan( rightWeight ) ) {
      relationalOperator = MathSymbols.LESS_THAN;
    }
    else if ( rightWeight.isLessThan( leftWeight ) ) {
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
   * @param {Object} config - see createSideNodeConfig in constructor
   * @returns {Node}
   */
  function createSideNode( termCreators, config ) {

    var children = [];
    for ( var i = 0; i < termCreators.length; i++ ) {

      var termCreator = termCreators[ i ];

      var numberOfTermsOnPlate = termCreator.numberOfTermsOnPlateProperty.value;
      if ( numberOfTermsOnPlate > 0 ) {

        if ( termCreator instanceof ObjectTermCreator ) {

          // if there were previous terms, add an operator
          if ( children.length > 0 ) {
            children.push( valueToOperatorNode( numberOfTermsOnPlate, config.operatorFont ) );
          }

          // Each ObjectTerm has an implicit coefficient of 1, so use the number of terms as the coefficient.
          children.push( ObjectTermNode.createEquationTermNode( numberOfTermsOnPlate, termCreator.createIcon(), {
            font: config.integerFont,
            spacing: config.coefficientSpacing
          } ) );
        }
        else if ( termCreator instanceof VariableTermCreator ) {

          var coefficient = termCreator.sumCoefficientsOnPlate();

          if ( coefficient.getValue() !== 0 ) {

            // if there were previous terms, replace the coefficient's sign with an operator
            if ( children.length > 0 ) {
              children.push( valueToOperatorNode( coefficient.getValue(), config.operatorFont ) );
              coefficient = coefficient.abs();
            }

            children.push( VariableTermNode.createEquationTermNode( coefficient, termCreator.variable.symbol, {
              integerFont: config.integerFont,
              fractionFont: config.fractionFont,
              symbolFont: config.symbolFont,
              coefficientSpacing: config.coefficientSpacing
            } ) );
          }
        }
        else if ( termCreator instanceof ConstantTermCreator ) {

          var constantValue = termCreator.sumConstantsOnPlate();

          if ( constantValue.getValue() !== 0 ) {

            // if there were previous terms, replace the constant's sign with an operator
            if ( children.length > 0 ) {
              children.push( valueToOperatorNode( constantValue.getValue(), config.operatorFont ) );
              constantValue = constantValue.abs();
            }

            children.push( ConstantTermNode.createEquationTermNode( constantValue, {
              integerFont: config.integerFont,
              fractionFont: config.fractionFont
            } ) );
          }
        }
        else {
          throw new Error( 'unsupported termCreator: ' + termCreator );
        }
      }
    }

    // if there were no terms, then this side of the equation evaluated to zero
    if ( children.length === 0 ) {
      children.push( new Text( '0', { font: config.integerFont } ) );
    }

    return new HBox( {
      spacing: config.plusSpacing,
      children: children
    } );
  }

  /**
   * Given the value that determines a term's sign, create the corresponding operator node.
   * @param {number} value
   * @param {Font} operatorFont
   * @returns {Node}
   */
  function valueToOperatorNode( value, operatorFont ) {
    assert && assert( typeof value === 'number', 'invalid value: ' + value );
    var operator = ( value > 0 ) ? MathSymbols.PLUS : MathSymbols.MINUS;
    return new Text( operator, { font: operatorFont } );
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
} )
;
