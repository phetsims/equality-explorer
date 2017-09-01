// Copyright 2017, University of Colorado Boulder

/**
 * Displays an equation or inequality.
 * Origin is at the center of the relational operator.
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

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( leftItemCreators, rightItemCreators, options ) {

    var self = this;

    options = _.extend( {

      // icons
      iconScale: 0.75,

      // fonts
      relationalOperatorFont: new PhetFont( { size: 40, weight: 'bold' } ), // for relational operator
      plusFont: new PhetFont( 28 ), // for plus operator
      numberFont: new PhetFont( 28 ), // for coefficients and constants

      // horizontal spacing
      relationalOperatorSpacing: 20, // space around the relational operator
      plusSpacing: 8, // space around plus operator
      coefficientSpacing: 2 // space between coefficient and icon

    }, options );

    Node.call( this );

    // Correct initial operator will be set in multilink below
    var relationalOperatorNode = new Text( '=', {
      font: options.relationalOperatorFont
    } );

    // {ItemCreator[]} all ItemCreator instances
    var itemCreators = leftItemCreators.concat( rightItemCreators );

    // {Property.<number>[]} lengthProperty for each ObservableArray.<Item>
    var lengthProperties = [];
    itemCreators.forEach( function( itemCreator ) {
      lengthProperties.push( itemCreator.itemsOnScale.lengthProperty );
    } );

    // update the equation, unmultilink unnecessary
    Property.multilink( lengthProperties, function() {

      relationalOperatorNode.text = getRelationalOperator( leftItemCreators, rightItemCreators );

      var leftSideNode = createSideNode( leftItemCreators,
        options.iconScale, options.plusFont, options.numberFont, options.plusSpacing, options.coefficientSpacing );

      var rightSideNode = createSideNode( rightItemCreators,
        options.iconScale, options.plusFont, options.numberFont, options.plusSpacing, options.coefficientSpacing );

      self.children = [ leftSideNode, relationalOperatorNode, rightSideNode ];

      // Layout, with origin at center of relational operator
      relationalOperatorNode.centerX = 0;
      relationalOperatorNode.centerY = 0;
      leftSideNode.right = relationalOperatorNode.left - options.relationalOperatorSpacing;
      leftSideNode.centerY = relationalOperatorNode.centerY;
      rightSideNode.left = relationalOperatorNode.right + options.relationalOperatorSpacing;
      rightSideNode.centerY = relationalOperatorNode.centerY;
    } );

    this.mutate( options );
  }

  equalityExplorer.register( 'EquationNode', EquationNode );

  /**
   * Gets the operator that describes the relationship between the left and right sides.
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @returns {string}
   */
  function getRelationalOperator( leftItemCreators, rightItemCreators ) {

    // evaluate the left side
    var leftWeight = 0;
    for ( var i = 0; i < leftItemCreators.length; i++ ) {
      leftWeight += leftItemCreators[ i ].itemsOnScale.length * leftItemCreators[ i ].weightProperty.value;
    }

    // evaluate the right side
    var rightWeight = 0;
    for ( i = 0; i < rightItemCreators.length; i++ ) {
      rightWeight += rightItemCreators[ i ].itemsOnScale.length * rightItemCreators[ i ].weightProperty.value;
    }

    // determine the operator that describes the relationship between left and right sides
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

    return relationalSymbol;
  }

  /**
   * Creates one side of the equation
   * @param {ItemCreator[]} itemCreators
   * @param {number} iconScale - scale for Item icons
   * @param {Font} plusFont - font for plus operators
   * @param {Font} numberFont - font for coefficients and constants
   * @param {number} plusSpacing - space around plus operators
   * @param {number} coefficientSpacing - space between coefficients and icons
   * @returns {Node}
   */
  function createSideNode( itemCreators, iconScale, plusFont, numberFont, plusSpacing, coefficientSpacing ) {

    var children = [];
    for ( var i = 0; i < itemCreators.length; i++ ) {

      var itemCreator = itemCreators[ i ];

      var numberOfItemsOnScale = itemCreator.itemsOnScale.length;
      if ( numberOfItemsOnScale > 0 ) {

        if ( children.length > 0 ) {
          children.push( new Text( '+', { font: plusFont } ) );
        }

        if ( itemCreator.constantTerm ) {
          children.push( createConstantNode( numberOfItemsOnScale * itemCreator.weightProperty.value, numberFont ) );
        }
        else {
          children.push( createTermNode( numberOfItemsOnScale, itemCreator.icon, iconScale, numberFont, coefficientSpacing ) );
        }
      }
    }

    if ( children.length === 0 ) {
      children.push( new Text( '0', { font: numberFont } ) );
    }

    return new HBox( {
      spacing: plusSpacing,
      children: children
    } );
  }

  /**
   * Creates a term.
   * @param {number} coefficient
   * @param {Node} icon
   * @param {number} iconScale - scale for icon
   * @param {Font} font - font for coefficient or constant
   * @param {spacing} coefficientSpacing - horizontal space between coefficient and icon
   * @returns {Node}
   */
  function createTermNode( coefficient, icon, iconScale, font, coefficientSpacing ) {

    var constantNode = createConstantNode( coefficient, font );

    // wrap the icon, since we're using scenery DAG feature
    var wrappedIcon = new Node( {
      children: [ icon ],
      scale: iconScale
    } );

    return new HBox( {
      spacing: coefficientSpacing,
      children: [ constantNode, wrappedIcon ]
    } );
  }

  /**
   * Creates a constant.
   * @param {number} constant
   * @param {Font} font
   * @returns {Node}
   */
  function createConstantNode( constant, font ) {
    return new Text( '' + constant, { font: font } );
  }

  return inherit( Node, EquationNode );
} );
