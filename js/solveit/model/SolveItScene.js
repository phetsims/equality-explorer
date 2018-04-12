// Copyright 2018, University of Colorado Boulder

/**
 * A scene in the 'Solve It!' screen.  A scene is created for each level in the game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalanceScale = require( 'EQUALITY_EXPLORER/common/model/BalanceScale' );
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} levelNumber - game level, numbered from 0 in the model, from 1 in the view
   * @param {string} description
   * @constructor
   */
  function SolveItScene( levelNumber, description ) {

    OperationsScene.call( this, {
      debugName: 'level ' + levelNumber,
      scaleLocation: new Vector2( 355, 500 ) // determined empirically
    } );

    // @public (read-only)
    this.levelNumber = levelNumber;
    this.description = description;

    // @public
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: function( value ) {
        return value >= 0;
      }
    } );

    //TODO default to Vector2.ZERO so that this is unnecessary?
    // Initialize locations of term creators.
    // This can be any value, since terms in this screen never return to a toolbox.
    this.allTermCreators.forEach( function( termCreator ) {
      termCreator.positiveLocation = Vector2.ZERO;
      termCreator.negativeLocation = Vector2.ZERO;
    } );

    var leftVariableTermCreator = new VariableTermCreator( this.xVariable );
    var leftConstantTermCreator = new ConstantTermCreator();
    var rightVariableTermCreator = new VariableTermCreator( this.xVariable );
    var rightConstantTermCreator = new ConstantTermCreator();

    // @public (read-only) term creators that hold terms for the challenge
    this.challengeLeftTermCreators = [ leftVariableTermCreator, leftConstantTermCreator ];
    this.challengeRightTermCreators = [ rightVariableTermCreator, rightConstantTermCreator ];

    // We need a scale for challenge term creators to put terms on.  It is otherwise not used.
    new BalanceScale( this.challengeLeftTermCreators, this.challengeRightTermCreators ); // eslint-disable-line

    //TODO default to Vector2.ZERO so that this is unnecessary?
    // Initialize locations of term creators.
    // This can be any value, since terms in this screen never return to a toolbox.
    this.challengeLeftTermCreators.concat( this.challengeRightTermCreators ).forEach( function( termCreator ) {
      termCreator.positiveLocation = Vector2.ZERO;
      termCreator.negativeLocation = Vector2.ZERO;
    } );
  }

  equalityExplorer.register( 'SolveItScene', SolveItScene );

  return inherit( OperationsScene, SolveItScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.scoreProperty.reset();
      OperationsScene.prototype.reset.call( this );
    }
  } );
} );