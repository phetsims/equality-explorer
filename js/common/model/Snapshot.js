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
      variables: null, // {Variable[]|null} optional variables for the snapshot
      objectTypes: null // {ObjectType[]|null} optional object types for the snapshot
    }, options );

    // @private
    this.scene = scene;
    this.leftPlateSnapshot = new PlateSnapshot( scene.scale.leftPlate );
    this.rightPlateSnapshot = new PlateSnapshot( scene.scale.rightPlate );

    // If variables are specified, save them and their current values
    if ( options.variables ) {

      // @private store the variables
      this.variables = options.variables;

      // @private save the current value of each variable
      this.variableValues = _.map( this.variables, function( variable ) {
         return variable.valueProperty.value;
      } );
    }

    // If object types are specified, save them and their current weights
    if ( options.objectTypes ) {

      // @private store the object types
      this.objectTypes = options.objectTypes;

      // @private save the current weight of each object type
      this.weightValues = _.map( this.objectTypes, function( objectType ) {
        return objectType.weightProperty.value;
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

      // dispose of all terms, including those that may be dragging or animating, see #73
      this.scene.disposeAllTerms();

      this.leftPlateSnapshot.restore();
      this.rightPlateSnapshot.restore();

      // If variables were specified, restore their values
      if ( this.variables ) {
        for ( var i = 0; i < this.variables.length; i++ ) {
          this.variables[ i ].valueProperty.value = this.variableValues[ i ];
        }
      }

      // If object types were specified, restore their weights
      if ( this.objectTypes ) {
        for ( i = 0; i < this.objectTypes.length; i++ ) {
          this.objectTypes[ i ].weightProperty.value = this.weightValues[ i ];
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
 