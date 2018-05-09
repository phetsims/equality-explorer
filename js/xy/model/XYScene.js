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
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
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
    Scene.call( this,
      createTermCreators( this.xVariable, this.yVariable ),
      createTermCreators( this.xVariable, this.yVariable ), {
        debugName: 'xy',
        variables: [ this.xVariable, this.yVariable ]
      } );
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
        positiveFill: EqualityExplorerColors.POSITIVE_Y_FILL,
        negativeFill: EqualityExplorerColors.NEGATIVE_Y_FILL
      } ),

      new ConstantTermCreator()
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
     * @returns {Snapshot}
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
