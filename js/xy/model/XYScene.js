// Copyright 2017-2018, University of Colorado Boulder

/**
 * The sole scene in the 'x & y' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );
  var yString = 'y'; // i18n not required, this is a test string

  // constants
  var POSITIVE_Y_FILL = 'rgb( 250, 100, 255 )';
  var NEGATIVE_Y_FILL = 'rgb( 240, 140, 255 )';

  /**
   * @constructor
   */
  function XYScene() {

    // @public (read-only) range of variables
    this.xRange = EqualityExplorerConstants.VARIABLE_RANGE;
    this.yRange = EqualityExplorerConstants.VARIABLE_RANGE;

    // @public values of the variables
    this.xProperty = new NumberProperty( this.xRange.defaultValue, {
      numberType: 'Integer',
      range: this.xRange
    } );
    this.yProperty = new NumberProperty( this.yRange.defaultValue, {
      numberType: 'Integer',
      range: this.yRange
    } );

    // Use the same query parameters as 'Variables' screen to pre-populate the scale
    Scene.call( this, 'xy',
      createTermCreators( this.xProperty, this.yProperty ),
      createTermCreators( this.xProperty, this.yProperty )
    );
  }

  equalityExplorer.register( 'XYScene', XYScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} xProperty
   * @param {NumberProperty} yProperty
   * @returns {TermCreator[]}
   */
  function createTermCreators( xProperty, yProperty ) {

    return [

      // x & -x
      new VariableTermCreator( xString, xProperty ),

      // y & -y
      new VariableTermCreator( yString, yProperty, {
        positiveFill: POSITIVE_Y_FILL,
        negativeFill: NEGATIVE_Y_FILL
      } )
    ];
  }

  return inherit( Scene, XYScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xProperty.reset();
      this.yProperty.reset();
      Scene.prototype.reset.call( this );
    },

    /**
     * Creates a snapshot of the scene.
     * @returns {SnapshotWithVariable}
     * @public
     * @override
     */
    createSnapshot: function() {
      return new SnapshotWithVariable( this );
    }
  } );
} );
