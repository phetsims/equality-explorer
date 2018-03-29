// Copyright 2017-2018, University of Colorado Boulder

/**
 * The sole scene in the 'x & y' screen.
 * This code is not part of the production sim - see XYScreen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );
  var Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );
  var Variable = require( 'EQUALITY_EXPLORER/common/model/Variable' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );
  var yString = 'y'; // i18n not required, this is a test string

  /**
   * @constructor
   */
  function XYScene() {

    // @public (read-only)
    this.xVariable = new Variable( xString );
    this.yVariable = new Variable( yString );

    // Use the same query parameters as 'Variables' screen to pre-populate the scale
    Scene.call( this, 'xy',
      createTermCreators( this.xVariable, this.yVariable ),
      createTermCreators( this.xVariable, this.yVariable )
    );
  }

  equalityExplorer.register( 'XYScene', XYScene );

  /**
   * Creates the term creators for this scene.
   * @param {Variable} xVariable
   * @param {Variable} yVariable
   * @returns {TermCreator[]}
   */
  function createTermCreators( xVariable, yVariable ) {

    return [

      // x & -x
      new VariableTermCreator( xVariable ),

      // y & -y
      new VariableTermCreator( yVariable, {
        positiveFill: 'rgb( 250, 100, 255 )',
        negativeFill: 'rgb( 240, 140, 255 )'
      } )
    ];
  }

  return inherit( Scene, XYScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xVariable.reset();
      this.yVariable.reset();
      Scene.prototype.reset.call( this );
    },

    /**
     * Creates a snapshot of the scene.
     * @returns {SnapshotWithVariable}
     * @public
     * @override
     */
    createSnapshot: function() {
      return new Snapshot( this, {
        variables: [ this.xVariable, this.yVariable ]
      } );
    }
  } );
} );
