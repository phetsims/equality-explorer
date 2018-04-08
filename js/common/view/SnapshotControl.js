// Copyright 2017-2018, University of Colorado Boulder

/**
 * Control for taking, displaying and selecting a snapshot.
 * The Snapshots accordion box contains a vertical column of these.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EquationNode = require( 'EQUALITY_EXPLORER/common/view/EquationNode' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var VariableValuesNode = require( 'EQUALITY_EXPLORER/common/view/VariableValuesNode' );

  // constants
  var NO_EQUATION_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder when we don't have an equation, so bounds are valid
  var NO_VARIABLE_VALUES_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder when we don't have an x value, so bounds are valid
  var EQUATION_FONT_SIZE = 20;
  var FRACTION_FONT_SIZE = 14;
  var SELECTION_RECTANGLE_X_MARGIN = 20;
  var SELECTION_RECTANGLE_Y_MARGIN = 5;

  /**
   * @param {Scene} scene - the scene that we'll be taking a snapshot of
   * @param {Property.<Snapshot|null>} snapshotProperty - snapshot associated with this control, null if no snapshot
   * @param {Property.<Snapshot|null>} selectedSnapshotProperty - the selected snapshot, null if no selection
   * @param {Object} [options]
   * @constructor
   */
  function SnapshotControl( scene, snapshotProperty, selectedSnapshotProperty, options ) {

    var self = this;

    options = _.extend( {
      xVisibleProperty: null, // whether value of 'x' is displayed with the equation
      controlWidth: 100,
      controlHeight: 50
    }, options );

    // rectangle that appears around the snapshot when it's selected
    var selectionRectangle = new Rectangle( 0, 0, options.controlWidth, options.controlHeight, {
      cornerRadius: 3,
      lineWidth: 3,
      stroke: 'transparent'
    } );

    // placeholders, so that snapshotNode has valid bounds
    var equationNode = NO_EQUATION_NODE;
    var variableValuesNode = NO_VARIABLE_VALUES_NODE;

    // parent for the equation and option x value display
    var snapshotNode = new HBox( {
      children: [ equationNode ],
      spacing: 10,
      center: selectionRectangle.center,
      maxWidth: options.controlWidth - SELECTION_RECTANGLE_X_MARGIN,
      maxHeight: options.controlHeight - SELECTION_RECTANGLE_Y_MARGIN
    } );

    // snapshot (camera) button
    var snapshotIcon = new FontAwesomeNode( 'camera', { scale: 0.4 } );
    var snapshotButton = new RectangularPushButton( {
      content: snapshotIcon,
      baseColor: 'white',
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      center: selectionRectangle.center,
      maxWidth: options.controlWidth,
      maxHeight: options.controlHeight,
      listener: function() {
        assert && assert( !snapshotProperty.value, 'snapshot is already occupied' );
        var snapshot = scene.createSnapshot();
        snapshotProperty.value = snapshot; // associate the snapshot with this control
        selectedSnapshotProperty.value = snapshot; // select the created snapshot
      }
    } );

    assert && assert( !options.children, 'SnapshotControl sets children' );
    options.children = [ selectionRectangle, snapshotNode, snapshotButton ];

    Node.call( this, options );

    // selects the snapshot associated with this control
    var upListener = new DownUpListener( {
      upInside: function( event, trail ) {
        assert && assert( snapshotProperty.value, 'expected a snapshot' );
        selectedSnapshotProperty.value = snapshotProperty.value;
      }
    } );

    // updates the layout of the snapshot, and centers it in the control
    var updateSnapshotLayout = function() {
      if ( options.xVisibleProperty && options.xVisibleProperty.value ) {
        snapshotNode.children = [ equationNode, variableValuesNode ];
      }
      else {
        snapshotNode.children = [ equationNode ];
      }
      snapshotNode.center = selectionRectangle.center;
    };

    // updates the view when the model changes.
    // unlink not required.
    snapshotProperty.link( function( snapshot ) {

      // either the button or the snapshot is visible
      snapshotButton.visible = !snapshot;
      snapshotNode.visible = !!snapshot;

      if ( snapshot ) {

        // create the equation for the snapshot
        equationNode = new EquationNode( scene.leftTermCreators, scene.rightTermCreators, {
          updateEnabled: false, // equation is static
          symbolFontSize: EQUATION_FONT_SIZE,
          operatorFontSize: EQUATION_FONT_SIZE,
          integerFontSize: EQUATION_FONT_SIZE,
          fractionFontSize: FRACTION_FONT_SIZE,
          relationalOperatorFontSize: EQUATION_FONT_SIZE
        } );

        // optionally show variable values, e.g. '(x = 2)' or '(x = 1, y = 3)'
        if ( snapshot.variables ) {
          variableValuesNode = new VariableValuesNode( snapshot.variables, { fontSize: EQUATION_FONT_SIZE } );
        }

        // add listener that selects the snapshot
        self.addInputListener( upListener );
      }
      else if ( self.hasInputListener( upListener ) ) {

        // no associated snapshot
        equationNode = NO_EQUATION_NODE;
        variableValuesNode = NO_VARIABLE_VALUES_NODE;
        self.removeInputListener( upListener );
      }

      updateSnapshotLayout();
    } );

    // Shows that the associated snapshot has been selected.
    // unlink not required.
    selectedSnapshotProperty.link( function( selectedSnapshot ) {
      var isSelected = ( selectedSnapshot && selectedSnapshot === snapshotProperty.value );
      selectionRectangle.stroke = isSelected ? EqualityExplorerColors.SNAPSHOT_SELECTED_STROKE : 'transparent';
    } );

    if ( options.xVisibleProperty ) {

      // Shows/hides the value of 'x'.
      // unlink not required
      options.xVisibleProperty.link( function( xVisible ) {
        updateSnapshotLayout();
      } );
    }
  }

  equalityExplorer.register( 'SnapshotControl', SnapshotControl );

  return inherit( Node, SnapshotControl );
} );
 