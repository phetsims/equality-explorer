// Copyright 2017-2018, University of Colorado Boulder

/**
 * Manages a collection of SnapshotsCollection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );

  /**
   * @constructor
   */
  function SnapshotsCollection( options ) {

    options = _.extend( {
      numberOfSnapshots: 5
    }, options );

    var self = this;

    // @public {Property.<Snapshot|null>[]} a Property for each possible snapshot, null means no snapshot
    this.snapshotProperties = [];
    for ( var i = 0; i < options.numberOfSnapshots; i++ ) {
      this.snapshotProperties.push( new Property( null, {
        isValidValue: function( snapshot ) {
          return ( snapshot === null ) || ( snapshot instanceof Snapshot );
        }
      } ) );
    }

    // @public {Property.<Snapshot|null>} the selected snapshot, null means no selection
    this.selectedSnapshotProperty = new Property( null, {

      // a valid snapshot is null or the value of one of the snapshotProperties
      isValidValue: function( snapshot ) {
        return ( snapshot === null ) ||
               _.some( self.snapshotProperties, function( snapshotProperty ) {
                 return snapshotProperty.value === snapshot;
               } );
      }
    } );
  }

  equalityExplorer.register( 'SnapshotsCollection', SnapshotsCollection );

  return inherit( Object, SnapshotsCollection, {

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
    }
  } );
} );