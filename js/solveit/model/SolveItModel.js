// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Range = require( 'DOT/Range' );

  // strings
  var level1String = require( 'string!EQUALITY_EXPLORER/level1' );
  var level2String = require( 'string!EQUALITY_EXPLORER/level2' );
  var level3String = require( 'string!EQUALITY_EXPLORER/level3' );
  var level4String = require( 'string!EQUALITY_EXPLORER/level4' );

  /**
   * @constructor
   */
  function SolveItModel() {

    // @public (read-only)
    this.numberOfLevels = 4;

    // @public (read-only)
    this.levelDescriptions = [
      level1String,
      level2String,
      level3String,
      level4String
    ];

    // @public
    this.levelProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, this.numberOfLevels - 1 )
    } );

    // @public {NumberProperty[]} a score for each level
    this.scoreProperties = [];
    for ( var i = 0; i < this.numberOfLevels; i++ ) {
      this.scoreProperties.push( new NumberProperty( 0, {
        numberType: 'Integer',
        isValidValue: function( value ) {
          return value >= 0;
        }
      } ) );
    }

    // @public Getting to this score results in a reward.
    this.rewardScore = 10;

    // @public
    this.soundEnabledProperty = new BooleanProperty( true );
  }

  equalityExplorer.register( 'SolveItModel', SolveItModel );

  return inherit( Object, SolveItModel, {

    // @public
    reset: function() {
      this.levelProperty.reset();
      this.scoreProperties.forEach( function( scoreProperty ) {
        scoreProperty.reset();
      } );
      this.soundEnabledProperty.reset();
    }
  } );
} );