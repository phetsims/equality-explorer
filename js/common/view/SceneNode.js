// Copyright 2017-2018, University of Colorado Boulder

/**
 * Base type for displaying scenes in Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalanceScaleNode = require( 'EQUALITY_EXPLORER/common/view/BalanceScaleNode' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EquationAccordionBox = require( 'EQUALITY_EXPLORER/common/view/EquationAccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LockControl = require( 'EQUALITY_EXPLORER/common/view/LockControl' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OopsDialog = require( 'EQUALITY_EXPLORER/common/view/OopsDialog' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );
  var TermsToolbox = require( 'EQUALITY_EXPLORER/common/view/TermsToolbox' );

  /**
   * @param {Scene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function SceneNode( scene, sceneProperty, layoutBounds, options ) {

    var self = this;

    options = _.extend( {
      hasNegativeTermsInToolbox: true, // {boolean} if true, put negative terms in the toolbox, e.g. -x
      termsToolboxSpacing: 50, // spacing of terms in the toolboxes that appear below the scale
      organizeButtonVisible: true, // is the organize button visible on the scale?

      // {BooleanProperty|null} whether variable values are visible in snapshots, null if the feature is not supported
      variableValuesVisibleProperty: null
    }, options );

    // @public view-specific Properties
    this.equationAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.snapshotsAccordionBoxExpandedProperty = new BooleanProperty( true );

    // locals vars to improve readability
    var scale = scene.scale;
    var leftTermCreators = scene.leftTermCreators;
    var rightTermCreators = scene.rightTermCreators;

    // @protected terms live in this layer
    this.termsLayer = new Node();

    var scaleNode = new BalanceScaleNode( scale, {
      organizeButtonVisible: options.organizeButtonVisible
    } );

    var leftTermsToolbox = new TermsToolbox( leftTermCreators, scale.leftPlate, this.termsLayer, {
      hasNegativeTermsInToolbox: options.hasNegativeTermsInToolbox,
      spacing: options.termsToolboxSpacing,
      centerX: scale.leftPlate.locationProperty.value.x,
      bottom: layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    var rightTermsToolbox = new TermsToolbox( rightTermCreators, scale.rightPlate, this.termsLayer, {
      hasNegativeTermsInToolbox: options.hasNegativeTermsInToolbox,
      spacing: options.termsToolboxSpacing,
      centerX: scale.rightPlate.locationProperty.value.x,
      bottom: leftTermsToolbox.bottom
    } );

    var equationAccordionBox = new EquationAccordionBox( leftTermCreators, rightTermCreators, {
      fixedWidth: rightTermsToolbox.right - leftTermsToolbox.left,
      expandedProperty: this.equationAccordionBoxExpandedProperty,

      // Slightly off center, so that the equation's relational operator is horizontally centered
      // above the scale's arrow. The offset was determined empirically.
      centerX: scale.location.x - 15,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var snapshotsAccordionBox = new SnapshotsAccordionBox( scene, {
      variableValuesVisibleProperty: options.variableValuesVisibleProperty,
      fixedWidth: ( layoutBounds.right - scaleNode.right ) - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN - 15,
      expandedProperty: this.snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var children = [
      scaleNode,
      leftTermsToolbox,
      rightTermsToolbox,
      equationAccordionBox,
      snapshotsAccordionBox,
      this.termsLayer // on top, so that terms are in front of everything else
    ];

    // Some scenes support locking the left and right sides of the equation,
    // such that an action on one side results in an equivalent action on the opposite side.
    if ( scene.lockedProperty ) {
      var lockControl = new LockControl( scene.lockedProperty, {
        x: scale.location.x,
        y: leftTermsToolbox.centerY - 5 // offset determined empirically
      } );
      children.unshift( lockControl ); // add to beginning
    }

    Node.call( this, {
      children: children
    } );

    /**
     * When a term is created in the model, create the corresponding view.
     * @param {TermCreator} termCreator
     * @param {Term} term
     * @param {Event|null} event - event is non-null when the term was created via user interaction
     */
    var termCreatedListener = function( termCreator, term, event ) {

      // create a TermNode
      var termNode = termCreator.createTermNode( term );
      self.termsLayer.insertChild( 0, termNode ); // behind other Nodes

      // Clean up when the term is disposed. Term.dispose handles removal of this listener.
      term.disposedEmitter.addListener( function( term ) {
        termNode.dispose();
      } );

      // start a drag cycle by forwarding the event to termNode.
      if ( event ) {
        termNode.startDrag( event );
      }
    };

    /**
     * When the limit EqualityExplorerConstants.LARGEST_INTEGER is exceeded,
     * dispose of all terms that are not on the scale, and display a dialog.
     */
    var dialog = null; // dialog will be reused
    var numberLimitExceededListener = function() {
      phet.log && phet.log( 'number limit exceeded' );
      scene.disposeTermsNotOnScale();
      dialog = dialog || new OopsDialog();
      dialog.show();
    };

    scene.allTermCreators.forEach( function( termCreator ) {
      termCreator.termCreatedEmitter.addListener( termCreatedListener ); // removeListener not needed
      termCreator.numberLimitExceededEmitter.addListener( numberLimitExceededListener ); // removeListener not needed
    } );

    // Make this scene visible when it's selected.
    // unlink not required
    sceneProperty.link( function( newScene ) {
      self.visible = ( newScene === scene );
    } );

    // Render the drag bounds for the left and right plates
    if ( phet.chipper.queryParameters.dev ) {
      var dragBoundsOption = { stroke: 'red', lineWidth: 0.25 };
      this.addChild( new Rectangle( scene.leftDragBounds, dragBoundsOption ) );
      this.addChild( new Rectangle( scene.rightDragBounds, dragBoundsOption ) );
    }

    // @public (read-only) for layout only
    this.equationAccordionBox = equationAccordionBox;
    this.snapshotsAccordionBox = snapshotsAccordionBox;
  }

  equalityExplorer.register( 'SceneNode', SceneNode );

  return inherit( Node, SceneNode, {

    // @public
    reset: function() {
      this.equationAccordionBoxExpandedProperty.reset();
      this.snapshotsAccordionBoxExpandedProperty.reset();
    }
  } );
} );
