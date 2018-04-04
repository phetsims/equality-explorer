// Copyright 2018, University of Colorado Boulder

/**
 * User interface for playing the game in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RewardDialog = require( 'VEGAS/RewardDialog' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var nextString = require( 'string!EQUALITY_EXPLORER/next' );

  // constants
  var LEVEL_FONT = new PhetFont( 20 );
  var NEXT_BUTTON_FONT = new PhetFont( 16 );

  /**
   * @param {SolveItModel} model
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of this node's parent ScreenView
   * @param {Object} [options]
   * @constructor
   */
  function PlayNode( model, visibleBoundsProperty, options ) {

    options = _.extend( {
      backButtonListener: function() {}
    }, options );

    var level = model.levelProperty.value;
    var scoreProperty = model.scoreProperties[ level ];

    var levelNode = new RichText( model.levelDescriptions[ level ], {
      font: LEVEL_FONT,
      maxWidth: 650 // determined empirically
    } );

    var scoreDisplay = new ScoreDisplayNumberAndStar( scoreProperty );

    var statusBar = new StatusBar( visibleBoundsProperty, levelNode, scoreDisplay, {
      spacing: 20,
      backgroundFill: 'rgb( 252, 150, 152 )',
      backButtonListener: options.backButtonListener
    } );

    var refreshButton = new RectangularPushButton( {
      content: new FontAwesomeNode( 'refresh', { scale: 0.6 } ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 14,
      yMargin: 7,
      right: statusBar.centerX - 20,
      top: statusBar.bottom + 30,
      listener: function() {
        //TODO
      }
    } );

    var nextButton = new RectangularPushButton( {
      content: new Text( nextString, { font: NEXT_BUTTON_FONT } ),
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      left: statusBar.centerX + 30,
      top: statusBar.bottom + 30,

      listener: function() {
        scoreProperty.value++; //TODO temporary

        //TODO crashing when dialog.dispose is called in these callbacks
        // When the score reaches 10, display a dialog
        if ( scoreProperty.value === 10 ) {
          var dialog = new RewardDialog( scoreProperty.value, {
            keepGoingButtonListener: function() {
              dialog.hide();
            },
            newLevelButtonListener: function() {
              dialog.hide();
              options.backButtonListener();
            }
          } );
          dialog.show();
        }
      }
    } );

    assert && assert( !options.children, 'PlayNode sets children' );
    options.children = [ statusBar, refreshButton, nextButton ];

    Node.call( this, options );

    // @private
    this.disposePlayNode = function() {
      scoreDisplay.dispose();
      statusBar.dispose();
    };
  }

  equalityExplorer.register( 'PlayNode', PlayNode );

  return inherit( Node, PlayNode, {

    // @public
    dispose: function() {
      this.disposePlayNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );