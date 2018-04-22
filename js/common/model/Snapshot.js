// Copyright 2017-2018, University of Colorado Boulder

/**
 * Base type for snapshot of a scene, saves state needed to restore the scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Scene} scene
   * @param {Object} [options]
   * @constructor
   */
  function Snapshot( scene, options ) {

    options = _.extend( {
      variables: null // {Variable[]} optional variables for the snapshot
    }, options );

    // @private
    this.scale = scene.scale;
    this.leftPlateSnapshot = new PlateSnapshot( scene.scale.leftPlate );
    this.rightPlateSnapshot = new PlateSnapshot( scene.scale.rightPlate );

    // If variables are specified, save the variables and their current values
    if ( options.variables ) {

      // @private store the variables
      this.variables = options.variables;

      // @private save the current value of each variable
      this.variableValues = _.map( this.variables, function( variable ) {
         return variable.valueProperty.value;
      } );
    }
  }

  equalityExplorer.register( 'Snapshot', Snapshot );

  inherit( Object, Snapshot, {

    /**
     * Restores this snapshot.
     * @public
     */
    restore: function() {

      this.scale.clear();
      this.leftPlateSnapshot.restore();
      this.rightPlateSnapshot.restore();

      // If variables were specified, restore their values
      if ( this.variables ) {
        for ( var i = 0; i < this.variables.length; i++ ) {
          this.variables[ i ].valueProperty.value = this.variableValues[ i ];
        }
      }
    }
  } );

  /**
   * Snapshot of a plate's state.
   *
   * @param {Plate} plate
   * @constructor
   * @private
   */
  function PlateSnapshot( plate ) {

    // @private
    this.termCreators = plate.termCreators;

    // @private {*[]} data structure that describes the terms for each termCreator.
    // Format is specific to Term subtypes. See createSnapshot for each Term subtype.
    this.snapshotDataStructures = [];

    // Create a snapshot data structure for each termCreator.
    for ( var i = 0; i < this.termCreators.length; i++ ) {
      this.snapshotDataStructures[ i ] = this.termCreators[ i ].createSnapshot();
    }
  }

  equalityExplorer.register( 'Snapshot.PlateSnapshot', PlateSnapshot );

  inherit( Object, PlateSnapshot, {

    /**
     * Restores the snapshot for this plate.
     * @public
     */
    restore: function() {
      assert && assert( this.termCreators.length === this.snapshotDataStructures.length,
        'arrays should have same length' );
      for ( var i = 0; i < this.termCreators.length; i++ ) {
        this.termCreators[ i ].restoreSnapshot( this.snapshotDataStructures[ i ] );
      }
    }
  } );

  return Snapshot;
} );
 