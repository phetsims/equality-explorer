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
  var DEFAULT_FONT = new PhetFont( 24 );
  var DEFAULT_COEFFICIENT_SPACING = 2;  // space between coefficient and icon
  var DEFAULT_PLUS_SPACING = 6;  // space around plus operators
  var DEFAULT_RELATIONAL_SPACING = 12; // space around the relational operator

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( leftItemCreators, rightItemCreators, options ) {

    var self = this;

    options = _.extend( {
      termSpacing: DEFAULT_COEFFICIENT_SPACING, // space between coefficient and icon
      plusSpacing: DEFAULT_PLUS_SPACING, // space around plus operator
      relationalSpacing: DEFAULT_RELATIONAL_SPACING, // space around the relational operator
      font: DEFAULT_FONT
    }, options );

    assert && assert( options.spacing === undefined, 'use relationalSpacing' );
    options.spacing = options.relationalSpacing;
    
    options.maxIconHeight = new Text( '0', { font: options.font } ).height;

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ new Text( '' ) ]; // need valid bounds when the supertype constructor is called

    HBox.call( this, options );

    // {ItemCreator[]} all ItemCreator instances
    var itemCreators = leftItemCreators.concat( rightItemCreators );

    // {Property.<number>[]} lengthProperty for each ObservableArray.<Item>
    var lengthProperties = [];
    itemCreators.forEach( function( itemCreator ) {
      lengthProperties.push( itemCreator.itemsOnScale.lengthProperty );
    } );

    // update the equation, unmultilink unnecessary
    Property.multilink( lengthProperties, function() {
      self.children = [
        
        // left side
        createSideNode( leftItemCreators, options ),
        
        // relational operator
        createRelationalOperator( leftItemCreators, rightItemCreators, options ),
        
        // right side
        createSideNode( rightItemCreators, options )
      ];
    } );
  }

  equalityExplorer.register( 'EquationNode', EquationNode );

  /**
   * Creates one side of the equation
   * @param {ItemCreator[]} itemCreators
   * @param {Object} [options]
   * @returns {Node}
   */
  function createSideNode( itemCreators, options ) {

    options = _.extend( {
      font: DEFAULT_FONT,
      plusSpacing: DEFAULT_PLUS_SPACING
    }, options );

    var children = [];
    for ( var i = 0; i < itemCreators.length; i++ ) {

      var itemCreator = itemCreators[ i ];

      var numberOfItemsOnScale = itemCreator.itemsOnScale.length;
      if ( numberOfItemsOnScale > 0 ) {

        if ( children.length > 0 ) {
          children.push( new Text( '+', { font: options.font } ) );
        }

        if ( itemCreator.constantTerm ) {
          children.push( createConstantNode( numberOfItemsOnScale * itemCreator.weightProperty.value, options ) );
        }
        else {
          children.push( createTermNode( numberOfItemsOnScale, itemCreator.icon, options ) );
        }
      }
    }

    if ( children.length === 0 ) {
      children.push( new Text( '0', { font: options.font } ) );
    }

    return new HBox( {
      spacing: options.plusSpacing,
      children: children
    } );
  }

  /**
   * Creates a term in the equation
   * @param {number} coefficient
   * @param {Node} icon
   * @param {Object} [options]
   * @returns {Node}
   */
  function createTermNode( coefficient, icon, options ) {
    
    options = _.extend( {
      font: DEFAULT_FONT,
      termSpacing: DEFAULT_COEFFICIENT_SPACING,
      maxIconHeight: 20
    }, options );
    
    return new HBox( {
      spacing: options.termSpacing,
      children: [
        new Text( '' + coefficient, { font: options.font } ),
        new Node( {
          children: [ icon ], // wrap the icon since we're using scenery DAG feature
          maxHeight: options.maxIconHeight
        } )
      ]
    } );
  }

  /**
   * Creates a constant term.
   * @param {number} constant
   * @param {Object} [options]
   * @returns {Node}
   */
  function createConstantNode( constant, options ) {
    
    options = _.extend( {
      font: DEFAULT_FONT
    }, options );
    
    return new Text( '' + constant, { font: options.font } );
  }

  /**
   * Creates the operator that describes the relationship between the left and right sides.
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @returns {Node}
   */
  function createRelationalOperator( leftItemCreators, rightItemCreators, options ) {

    options = _.extend( {
      font: DEFAULT_FONT
    }, options );

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
    assert && assert( relationalSymbol );

    return new Text( relationalSymbol, { font: options.font } );
  }

  return inherit( HBox, EquationNode );
} );
