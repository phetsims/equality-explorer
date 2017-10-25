// Copyright 2017, University of Colorado Boulder

//TODO delete this
/**
 * Worst-case equation, for demonstration purposes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EquationNode = require( 'EQUALITY_EXPLORER/common/view/EquationNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NUMBER_OF_ITEMS = 36;

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function WorstCaseEquationNode( leftItemCreators, rightItemCreators, options ) {
    EquationNode.call( this, createWorstCaseItemCreators( leftItemCreators ), createWorstCaseItemCreators( rightItemCreators ), options );
  }

  equalityExplorer.register( 'WorstCaseEquationNode', WorstCaseEquationNode );

  /**
   * @param {ItemCreator[]} itemCreators
   * @returns {ItemCreator[]}
   */
  function createWorstCaseItemCreators( itemCreators ) {
    var worstCaseItemCreators = [];
    itemCreators.forEach( function( itemCreator ) {

      var worstCaseItemCreator = new ItemCreator( itemCreator.name, itemCreator.itemWeightProperty.value, itemCreator.icon, itemCreator.iconShadow, {
        constantTerm: itemCreator.constantTerm,
        variableTerm: itemCreator.variableTerm
      } );

      for ( var i = 0; i < NUMBER_OF_ITEMS; i++ ) {
        var item = worstCaseItemCreator.createItem( new Vector2( 0, 0 ) );
        worstCaseItemCreator.addItemToScale( item );
      }

      worstCaseItemCreators.push( worstCaseItemCreator );
    } );
    return worstCaseItemCreators;
  }

  return inherit( EquationNode, WorstCaseEquationNode );
} );