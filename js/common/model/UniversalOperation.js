// Copyright 2018-2019, University of Colorado Boulder

/**
 * Data structure that describes a 'universal operation', a term specific to this sim,
 * an operation that will be applied to both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );

  /**
   * @param {string} operator - see EqualityExplorerConstants.OPERATORS
   * @param {Term} operand
   * @constructor
   */
  function UniversalOperation( operator, operand ) {

    assert && assert( _.includes( EqualityExplorerConstants.OPERATORS, operator ),
      'invalid operator: ' + operator );
    assert && assert( operand instanceof ConstantTerm || operand instanceof VariableTerm,
      'invalid operand: ' + operand );

    // @public (read-only)
    this.operator = operator;
    this.operand = operand;
  }

  equalityExplorer.register( 'UniversalOperation', UniversalOperation );

  return inherit( Object, UniversalOperation, {

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'operator=' + this.operator + ', operand=' + this.operand;
    },


    /**
     * Creates a concise human-readable string representation, intended to be used for phet.log calls.
     * @returns {string}
     * @public (debug)
     */
    toLogString: function() {
      if ( this.operand instanceof ConstantTerm ) {

        // e.g. '+ 2'
        return StringUtils.fillIn( '{{operator}} {{constantValue}}', {
          operator: this.operator,
          constantValue: this.operand.constantValue.getValue()
        } );
      }
      else if ( this.operand instanceof VariableTerm ) {

        // e.g. '+ 2x (x=6)'
        return StringUtils.fillIn( '{{operator}} {{coefficient}}{{symbol}} ({{symbol}}={{variableValue}})', {
          operator: this.operator,
          coefficient: this.operand.coefficient.getValue(),
          symbol: this.operand.variable.symbol,
          variableValue: this.operand.variable.valueProperty.value
        } );
      }
      else {
        throw new Error( 'unsupported operand: ' + this.operand );
      }
    }
  } );
} );
