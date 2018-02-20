// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function Term( options ) {

    // @public (read-only) emit1 when dispose is called.
    // Callback signature is function( {Term} term ), where the parameter is the term that was disposed.
    this.disposedEmitter = new Emitter();

    // @public whether the term's halo is visible
    this.haloVisibleProperty = new BooleanProperty( false );

    // @public whether the term's shadow is visible
    this.shadowVisibleProperty = new BooleanProperty( false );

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'Term', Term );

  return inherit( EqualityExplorerMovable, Term, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposedEmitter.emit1( this );
      this.disposedEmitter.dispose();
      this.haloVisibleProperty.dispose();
      this.shadowVisibleProperty.dispose();
      EqualityExplorerMovable.prototype.dispose.call( this );
    },

    /**
     * Is this term the inverse of a specified term?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @abstract
     */
    isInverseOf: function( term ) {
      throw new Error( 'isInverseOf must be implemented by subtype' );
    },

    /**
     * Applies a universal operation to this term.
     * If a term does not support the operator, the operation is ignored.
     * @param {UniversalOperation} operation
     * @public
     */
    apply: function( operation ) {
      if ( operation.operator === EqualityExplorerConstants.PLUS ) {
        this.plusInteger && this.plusInteger( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.MINUS ) {
        this.minusInteger && this.minusInteger( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.TIMES ) {
        this.timesInteger( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.DIVIDE ) {
        this.divideByInteger( operation.operand );
      }
      else {
        throw new Error( 'invalid operator: ' + operation.operator );
      }
    }
  } );
} );