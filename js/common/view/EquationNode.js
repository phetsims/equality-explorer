// Copyright 2017, University of Colorado Boulder

/**
 * Displays an equation or inequality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var TERM_SPACING = 2;  // space between coefficient and icon
  var PLUS_SPACING = 6; // space between terms and the plus operator
  var RELATIONAL_SPACING = 12; // space around the relational operator
  var TEXT_OPTIONS = { font: new PhetFont( 24 ) };
  var MAX_ICON_HEIGHT = new Text( '20', TEXT_OPTIONS ).height;

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( leftItemCreators, rightItemCreators, options ) {

    var self = this;

    options = _.extend( {
      spacing: RELATIONAL_SPACING // space around the relational operator
    }, options );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ new Text( '' ) ]; // need valid bounds when the supertype constructor is called

    HBox.call( this, options );

    // {ItemCreator[]} all ItemCreator instances
    var itemCreators = leftItemCreators.concat( rightItemCreators );

    // {Property.<number>[]} lengthProperty for each ObservableArray.<Item>
    var lengthProperties = [];
    itemCreators.forEach( function( itemCreator ) {
      lengthProperties.push( itemCreator.items.lengthProperty );
    } );

    // update the equation
    Property.multilink( lengthProperties, function() {
      self.children = [
        createSideNode( leftItemCreators ),
        createRelationalOperator( leftItemCreators, rightItemCreators ),
        createSideNode( rightItemCreators )
      ];
    } );
  }

  equalityExplorer.register( 'EquationNode', EquationNode );

  /**
   * Creates one side of the equation
   * @param {ItemCreator[]} itemCreators
   * @returns {Node}
   */
  function createSideNode( itemCreators ) {

    var children = [];
    for ( var i = 0; i < itemCreators.length; i++ ) {

      var itemCreator = itemCreators[ i ];

      if (  itemCreator.items.length > 0 ) {

        if ( children.length > 0  ) {
          children.push( new Text( '+', TEXT_OPTIONS ) );
        }

        if ( itemCreator.constantTerm ) {
          children.push( createConstantNode( itemCreator.items.length * itemCreator.weightProperty.value ) );
        }
        else {
          children.push( createTermNode( itemCreator.items.length, itemCreator.icon ) );
        }
      }
    }

    if ( children.length === 0 ) {
      children.push( new Text( '0', TEXT_OPTIONS ) );
    }

    return new HBox( {
      spacing: PLUS_SPACING,
      children: children
    } );
  }

  /**
   * Creates a term in the equation
   * @param {number} coefficient
   * @param {Node} icon
   * @returns {Node}
   */
  function createTermNode( coefficient, icon ) {
    return new HBox( {
      spacing: TERM_SPACING,
      children: [
        new Text( '' + coefficient, TEXT_OPTIONS ),
        new Node( {
          children: [ icon ],
          maxHeight: MAX_ICON_HEIGHT
        } )
      ]
    } );
  }

  /**
   * Creates a constant term.
   * @param {number} constant
   * @returns {Node}
   */
  function createConstantNode( constant ) {
    return new Text( '' + constant, TEXT_OPTIONS );
  }

  /**
   * Creates the operator that describes the relationship between the left and right sides.
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @returns {Node}
   */
  function createRelationalOperator( leftItemCreators, rightItemCreators ) {

    var leftWeight = 0;
    for ( var i = 0; i < leftItemCreators.length; i++ ) {
      leftWeight += leftItemCreators[ i ].items.length * leftItemCreators[ i ].weightProperty.value;
    }

    var rightWeight = 0;
    for ( i = 0; i < rightItemCreators.length; i++ ) {
      rightWeight += rightItemCreators[ i ].items.length * rightItemCreators[ i ].weightProperty.value;
    }

    var relationalSymbol = null;
    if ( leftWeight < rightWeight ) {
      relationalSymbol = '<';
    }
    else if ( leftWeight > rightWeight ) {
      relationalSymbol = '>';
    }
    else {
      relationalSymbol = '=';
    }
    return new Text( relationalSymbol, TEXT_OPTIONS );
  }

  return inherit( HBox, EquationNode );
} );
