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
      inverseTermsInToolbox: true, // put positive and negative version of each term in the toolbox, e.g. x and -x
      termsToolboxSpacing: 50, // spacing of terms in the toolboxes that appear below the scale
      xVisibleProperty: null, // {BooleanProperty|null} whether 'x' value is visible in snapshots
      organizeButtonVisible: true // is the organize button visible on the scale?
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
      inverseTermsInToolbox: options.inverseTermsInToolbox,
      spacing: options.termsToolboxSpacing,
      centerX: scale.leftPlate.locationProperty.value.x,
      bottom: layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    var rightTermsToolbox = new TermsToolbox( rightTermCreators, scale.rightPlate, this.termsLayer, {
      inverseTermsInToolbox: options.inverseTermsInToolbox,
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
      xVisibleProperty: options.xVisibleProperty,
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

    // When a term is created in the model, create the corresponding view.
    var termCreatedListener = function( termCreator, term, event ) {

      // create a TermNode
      var termNode = termCreator.createTermNode( term );
      self.termsLayer.insertChild( 0, termNode ); // behind other Nodes

      // Clean up when the term is disposed. Term.dispose handles removal of this listener.
      term.disposedEmitter.addListener( function( term ) {
        termNode.dispose();
      } );

      // event is non-null when the term was created via user interaction with termCreator.
      // start a drag cycle by forwarding the event to termNode.
      if ( event ) {
        termNode.startDrag( event );
      }
    };
    scene.leftTermCreators.concat( scene.rightTermCreators ).forEach( function( termCreator ) {
      termCreator.termCreatedEmitter.addListener( termCreatedListener ); // removeListener not needed
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
