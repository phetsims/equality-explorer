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
  var EquationNode = require( 'EQUALITY_EXPLORER/common/view/EquationNode' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var XValueNode = require( 'EQUALITY_EXPLORER/common/view/XValueNode' );

  // constants
  var SELECTED_STROKE = 'rgb( 85, 169, 223 )'; // stroke for selection rectangle
  var UNSELECTED_STROKE = 'rgba( 0, 0, 0, 0 )'; // non-null so that size of control doesn't vary
  var NO_EQUATION_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder when we don't have an equation, so bounds are valid
  var NO_X_VALUE_NODE = new Rectangle( 0, 0, 1, 1 ); // placeholder when we don't have an x value, so bounds are valid
  var FONT_SIZE = 20; // uniform font size for all parts of the equation
  var VARIABLE_FONT = new MathSymbolFont( FONT_SIZE ); // for variable 'x'
  var EQUATION_FONT = new PhetFont( FONT_SIZE ); // for all parts of equation except variable 'x'
  var SELECTION_RECTANGLE_X_MARGIN = 20;
  var SELECTION_RECTANGLE_Y_MARGIN = 5;

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
      controlHeight: 50
    }, options );

    // rectangle that appears around the snapshot when it's selected
    var selectionRectangle = new Rectangle( 0, 0, options.controlWidth, options.controlHeight, {
      cornerRadius: 3,
      lineWidth: 3,
      stroke: UNSELECTED_STROKE
    } );

    // placeholders, so that snapshotNode has valid bounds
    var equationNode = NO_EQUATION_NODE;
    var xValueNode = NO_X_VALUE_NODE;

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
        assert && assert( snapshotProperty.value === null, 'snapshot should be null' );
        snapshotProperty.value = scene.save();
        selectedSnapshotProperty.value = null;
      }
    } );

    assert && assert( !options.children, 'this type sets its own children' );
    options.children = [ selectionRectangle, snapshotNode, snapshotButton ];

    // clicking on this control selects the associated snapshot
    var upListener = new DownUpListener( {
      upInside: function( event, trail ) {
        assert && assert( snapshotProperty.value !== null, 'expected a snapshot' );
        selectedSnapshotProperty.value = snapshotProperty.value;
      }
    } );

    Node.call( this, options );

    // updates the layout of the snapshot, and centers it in the control
    var updateSnapshotLayout = function() {
      if ( options.xVisibleProperty && options.xVisibleProperty.value ) {
        snapshotNode.children = [ equationNode, xValueNode ];
      }
      else {
        snapshotNode.children = [ equationNode ];
      }
      snapshotNode.center = selectionRectangle.center;
    };

    // updates the view when the model changes
    snapshotProperty.link( function( snapshot ) {

      snapshotButton.visible = ( snapshot === null );
      snapshotNode.visible = ( snapshot !== null );

      if ( snapshot ) {
        
        equationNode = new EquationNode( scene.leftItemCreators, scene.rightItemCreators, {
          updateEnabled: false, // equation is static
          variableFont: VARIABLE_FONT,
          relationalOperatorFont: EQUATION_FONT,
          plusFont: EQUATION_FONT,
          numberFont: EQUATION_FONT
        } );

        if ( options.xVisibleProperty ) {
          assert && assert( snapshot instanceof SnapshotWithVariable, 'expected a snapshot with variable support' );
          xValueNode = new XValueNode( snapshot.x, {
            variableFont: VARIABLE_FONT,
            font: EQUATION_FONT
          } );
        }

        self.addInputListener( upListener );
      }
      else if ( self.hasInputListener( upListener ) ) {
        equationNode = NO_EQUATION_NODE;
        xValueNode = NO_X_VALUE_NODE;
        self.removeInputListener( upListener );
      }
      updateSnapshotLayout();
    } );

    // shows that the associated snapshot has been selected
    selectedSnapshotProperty.link( function( selectedSnapshot ) {
      if ( selectedSnapshot !== null && selectedSnapshot === snapshotProperty.value ) {
        selectionRectangle.stroke = SELECTED_STROKE;
      }
      else {
        selectionRectangle.stroke = UNSELECTED_STROKE;
      }
    } );

    // shows/hides the value of 'x'
    if ( options.xVisibleProperty ) {
      options.xVisibleProperty.link( function( xVisible ) {
        updateSnapshotLayout();
      } );
    }
  }

  equalityExplorer.register( 'SnapshotControl', SnapshotControl );

  return inherit( Node, SnapshotControl );
} );
 