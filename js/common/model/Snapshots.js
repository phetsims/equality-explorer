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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Snapshots( options ) {

    var self = this;

    // @public {Property.<Snapshot|null>[]} null means no snapshot
    this.snapshotProperties = [];
    for ( var i = 0; i < EqualityExplorerConstants.NUMBER_OF_SNAPSHOTS; i++ ) {
      this.snapshotProperties.push( new Property( null ) );
    }

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

      // reset the selected snapshot
      this.selectedSnapshotProperty.reset();

      // delete all snapshots
      for ( var i = 0; i < this.snapshotProperties.length; i++ ) {
        if ( this.snapshotProperties[ i ].value !== null ) {
          this.snapshotProperties[ i ].value = null;
        }
      }
    },

    /**
     * Deletes the selected snapshot.
     * @public
     */
    deleteSelectedSnapshot: function() {
      var selectedSnapshot = this.selectedSnapshotProperty.value;
      assert && assert( selectedSnapshot, 'no selected snapshot' );
      this.selectedSnapshotProperty.value = null;
      for ( var i = 0; i < this.snapshotProperties.length; i++ ) {
        if ( this.snapshotProperties[ i ].value === selectedSnapshot ) {
          this.snapshotProperties[ i ].value = null;
          break;
        }
      }
    },

    /**
     * Is the specified Snapshot part of this collection?
     * @param {Snapshot} snapshot
     * @returns {boolean}
     * @private
     */
    containsSnapshot: function( snapshot ) {
      var found = false;
      for ( var i = 0; i < this.snapshotProperties.length && !found; i++ ) {
        found = ( this.snapshotProperties[ i ].value === snapshot );
      }
      return found;
    }
  } );
} );