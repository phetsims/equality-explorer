// Copyright 2017, University of Colorado Boulder

/**
 * Control for taking, displaying and selecting a snapshot.
 * The Snapshots accordion box has a vertical column of these.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var XValueNode = require( 'EQUALITY_EXPLORER/common/view/XValueNode' );

  // constants
  var SELECTED_STROKE = 'red';
  var UNSELECTED_STROKE = 'rgba( 0, 0, 0, 0 )'; // non-null so that size of control doesn't vary

  /**
   * @param {Scene} scene
   * @param {Property.<Snapshot|null>} snapshotProperty - null if there is no snapshot
   * @param {Property.<Snapshot|null>} selectedSnapshotProperty
   * @param {Object} [options]
   * @constructor
   */
  function SnapshotControl( scene, snapshotProperty, selectedSnapshotProperty, options ) {

    var self = this;

    options = _.extend( {
      xVisibleProperty: null, // whether value of 'x' is displayed with the equation
      controlWidth: 100,
      controlHeight: 65
    }, options );

    var backgroundNode = new Rectangle( 0, 0, options.controlWidth, options.controlHeight, {
      cornerRadius: 10,
      lineWidth: 2,
      stroke: UNSELECTED_STROKE
    } );

    // placeholder when we don't have an equation, so that equationParent has valid bounds
    var noEquationNode = new Text( '' );

    var equationParent = new HBox( {
      children: [ noEquationNode ],
      spacing: 8,
      center: backgroundNode.center
    } );

    var snapshotIcon = new FontAwesomeNode( 'camera', { scale: 0.4 } );
    var snapshotButton = new RectangularPushButton( {
      content: snapshotIcon,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      center: backgroundNode.center,
      maxWidth: options.controlWidth,
      maxHeight: options.controlHeight,
      listener: function() {
        assert && assert( snapshotProperty.value === null, 'snapshot should be null' );
        snapshotProperty.value = scene.save();
        selectedSnapshotProperty.value = null;
      }
    } );

    assert && assert( !options.children, 'this type sets its own children' );
    options.children = [ backgroundNode, equationParent, snapshotButton ];

    var upListener = new DownUpListener( {
      upInside: function( event, trail ) {
        selectedSnapshotProperty.value = snapshotProperty.value;
      }
    } );

    Node.call( this, options );

    var updateEquation = function() {
      if ( snapshotProperty.value === null ) {
        equationParent.children = [ noEquationNode ];
      }
      else {
        var equationNode = new Text( '{{equation}', { font: new PhetFont( 20 ) } );
        if ( options.xVisibleProperty && options.xVisibleProperty.value ) {
          assert && assert( snapshotProperty.value.x !== null, 'expected x value in snapshot' );
          equationParent.children = [ equationNode, new XValueNode( snapshotProperty.value.x ) ];
        }
        else {
          equationParent.children = [ equationNode ];
        }
      }
      equationParent.center = backgroundNode.center;
    };

    snapshotProperty.link( function( snapshot ) {

      snapshotButton.visible = ( snapshot === null );
      equationParent.visible = ( snapshot !== null );

      updateEquation();

      if ( snapshot ) {
        self.addInputListener( upListener );
      }
      else if ( self.hasInputListener( upListener ) ) {
        self.removeInputListener( upListener );
      }
    } );

    selectedSnapshotProperty.link( function( selectedSnapshot ) {
      if ( selectedSnapshot !== null && selectedSnapshot === snapshotProperty.value ) {
        backgroundNode.stroke = SELECTED_STROKE;
      }
      else {
        backgroundNode.stroke = UNSELECTED_STROKE;
      }
    } );

    if ( options.xVisibleProperty ) {
      options.xVisibleProperty.link( function( xVisible ) {
        updateEquation();
      } );
    }
  }

  equalityExplorer.register( 'SnapshotControl', SnapshotControl );

  return inherit( Node, SnapshotControl );
} );
 