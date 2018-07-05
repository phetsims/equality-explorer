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
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );
  var VariableValuesNode = require( 'EQUALITY_EXPLORER/common/view/VariableValuesNode' );

  // constants
  var NO_EQUATION_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder for equation, so bounds are valid
  var NO_VARIABLE_VALUES_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder for variable values, so bounds are valid
  var EQUATION_FONT_SIZE = 22;
  var FRACTION_FONT_SIZE = 14;
  var SELECTION_RECTANGLE_X_MARGIN = 10;
  var SELECTION_RECTANGLE_Y_MARGIN = 8;
  var VALID_ORIENTATION_VALUES = [ 'horizontal', 'vertical' ];

  /**
   * @param {EqualityExplorerScene} scene - the scene that we'll be taking a snapshot of
   * @param {Property.<Snapshot|null>} snapshotProperty - snapshot associated with this control, null if no snapshot
   * @param {Property.<Snapshot|null>} selectedSnapshotProperty - the selected snapshot, null if no selection
   * @param {Object} [options]
   * @constructor
   */
  function SnapshotControl( scene, snapshotProperty, selectedSnapshotProperty, options ) {

    var self = this;

    options = _.extend( {

      // {BooleanProperty|null} whether variable values are visible in snapshots, null if the feature is not supported
      variableValuesVisibleProperty: null,
      controlWidth: 100,
      controlHeight: 50,
      orientation: 'horizontal', // layout of the equation and variable values, see VALID_ORIENTATION_VALUES
      commaSeparated: true, // are variable values separated by commas?
      variableValuesOpacity: 1 // [0,1], see https://github.com/phetsims/equality-explorer/issues/113
    }, options );

    assert && assert( _.includes( VALID_ORIENTATION_VALUES, options.orientation ),
      'invalid orientation: ' + options.orientation );
    assert && assert( options.variableValuesOpacity >= 0 && options.variableValuesOpacity <= 1,
      'invalid variableValuesOpacity: ' + options.variableValuesOpacity );

    // rectangle that appears around the snapshot when it's selected
    var selectionRectangle = new Rectangle( 0, 0, options.controlWidth, options.controlHeight, {
      cornerRadius: 3,
      lineWidth: 3,
      stroke: 'transparent'
    } );

    // placeholders, so that snapshotNode has valid bounds
    var equationNode = NO_EQUATION_NODE;
    var variableValuesNode = NO_VARIABLE_VALUES_NODE;

    // parent for the equation and optional display of variable values
    var snapshotNode = new LayoutBox( {
      orientation: options.orientation,
      children: [ equationNode ],
      spacing: ( options.orientation === 'horizontal' ) ? 20 : 8,
      center: selectionRectangle.center,
      maxWidth: options.controlWidth - 2 * SELECTION_RECTANGLE_X_MARGIN,
      maxHeight: options.controlHeight - 2 * SELECTION_RECTANGLE_Y_MARGIN
    } );

    // snapshot (camera) button
    var snapshotIcon = new FontAwesomeNode( 'camera', { scale: 0.4 } );
    var snapshotButton = new RectangularPushButton( {
      content: snapshotIcon,
      baseColor: 'white',
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      center: selectionRectangle.center,
      maxWidth: options.controlWidth,
      maxHeight: options.controlHeight,
      listener: function() {
        assert && assert( !snapshotProperty.value, 'snapshot is already occupied' );
        var snapshot = new Snapshot( scene );
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
      if ( options.variableValuesVisibleProperty && options.variableValuesVisibleProperty.value ) {
        snapshotNode.children = [ equationNode, variableValuesNode ];
      }
      else {
        snapshotNode.children = [ equationNode ];
      }
      snapshotNode.center = selectionRectangle.center;
    };

    // Updates the view when the model changes. unlink not required.
    snapshotProperty.link( function( snapshot ) {

      // either the button or the snapshot is visible
      snapshotButton.visible = !snapshot;
      snapshotNode.visible = !!snapshot;
      selectionRectangle.visible = !!snapshot;

      if ( snapshot ) {

        selectionRectangle.cursor = 'pointer';

        // create the equation for the snapshot
        equationNode = new EquationNode( scene.leftTermCreators, scene.rightTermCreators, {
          updateEnabled: false, // equation is static
          symbolFontSize: EQUATION_FONT_SIZE,
          operatorFontSize: EQUATION_FONT_SIZE,
          integerFontSize: EQUATION_FONT_SIZE,
          fractionFontSize: FRACTION_FONT_SIZE,
          relationalOperatorFontSize: EQUATION_FONT_SIZE,
          relationalOperatorSpacing: 15,
          pickable: false
        } );

        // optionally show variable values, e.g. '(x = 2)' or '(x = 1, y = 3)'
        if ( scene.variables ) {
          variableValuesNode = new VariableValuesNode( scene.variables, {
            opacity: options.variableValuesOpacity,
            fontSize: EQUATION_FONT_SIZE,
            commaSeparated: options.commaSeparated,

            // de-emphasize variable values by scaling them down,
            // see https://github.com/phetsims/equality-explorer/issues/110
            scale: 0.75
          } );
        }

        // add listener that selects the snapshot
        self.addInputListener( upListener );
      }
      else if ( self.hasInputListener( upListener ) ) {

        selectionRectangle.cursor = null;

        // no associated snapshot
        equationNode = NO_EQUATION_NODE;
        variableValuesNode = NO_VARIABLE_VALUES_NODE;
        self.removeInputListener( upListener );
      }

      updateSnapshotLayout();
    } );

    // Shows that the associated snapshot has been selected. unlink not required.
    selectedSnapshotProperty.link( function( selectedSnapshot ) {
      var isSelected = ( selectedSnapshot && selectedSnapshot === snapshotProperty.value );
      selectionRectangle.stroke = isSelected ?
                                  EqualityExplorerColors.SNAPSHOT_SELECTED_STROKE :
                                  EqualityExplorerColors.SNAPSHOT_DESELECTED_STROKE;
    } );

    if ( options.variableValuesVisibleProperty ) {

      // Shows/hides variable values. unlink not required.
      options.variableValuesVisibleProperty.link( function( visible ) {
        updateSnapshotLayout();
      } );
    }
  }

  equalityExplorer.register( 'SnapshotControl', SnapshotControl );

  return inherit( Node, SnapshotControl );
} );
 