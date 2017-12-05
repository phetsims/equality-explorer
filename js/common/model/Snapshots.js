// Copyright 2017, University of Colorado Boulder

/**
 * Creates and manages a collection of Snapshots.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Scene} scene
   * @param {Object} [options]
   * @constructor
   */
  function Snapshots( scene, options ) {

    var self = this;

    options = _.extend( {
      maxSnapshots: 5
    }, options );

    // @private
    this.scene = scene;

    // @public
    this.maxSnapshots = options.maxSnapshots;

    // @public {Snapshot[]}
    this.snapshots = [];

    // @public {Property.<Snapshot|null>} null means no selection
    this.selectedSnapshotProperty = new Property( null );

    // verify that the selected snapshot is in the collection, unlink not needed
    this.selectedSnapshotProperty.link( function( snapshot ) {
      assert && assert( snapshot === null || self.containsSnapshot( snapshot ), 'snapshot is not in this collection' );
    } );
  }

  equalityExplorer.register( 'Snapshots', Snapshots );

  return inherit( Object, Snapshots, {

    // @public
    reset: function() {

      // delete all snapshots
      for ( var i = 0; i < this.snapshots.length; i++ ) {
        this.snapshots[ i ].dispose();
      }
      this.snapshots = [];

      // reset the selected snapshot
      this.selectedSnapshotProperty.reset();
    },

    /**
     * Saves a snapshot of the current configuration.
     * @returns {Snapshot}
     * @public
     */
    saveSnapshot: function() {
      assert && assert( this.snapshots.length < this.maxSnapshots, 'collection is full' );
      var snapshot = this.scene.save();
      assert && assert( !this.containsSnapshot( snapshot ), 'snapshot is already in this collection' );
      this.snapshots.push( snapshot );
      return snapshot;
    },

    /**
     * Restores the selected snapshot.
     * @public
     */
    restoreSelectedSnapshot: function() {
      var snapshot = this.selectedSnapshotProperty.value;
      assert && assert( snapshot, 'no selected snapshot' );
      this.scene.restore( snapshot );
    },

    /**
     * Deletes the selected snapshot.
     * @public
     */
    deleteSelectedSnapshot: function() {
      var snapshot = this.selectedSnapshotProperty.value;
      assert && assert( snapshot, 'no selected snapshot' );
      snapshot.dispose();
      this.snapshots.splice( this.snapshots.indexOf( snapshot ), 1 );
      if ( this.selectedSnapshotProperty.value === snapshot ) {
        this.selectedSnapshotProperty.value = null;
      }
    },

    /**
     * Is the specified Snapshot part of this collection?
     * @param {Snapshot} snapshot
     * @returns {boolean}
     * @private
     */
    containsSnapshot: function( snapshot ) {
      return ( this.snapshots.indexOf( snapshot ) !== -1 );
    }
  } );
} );