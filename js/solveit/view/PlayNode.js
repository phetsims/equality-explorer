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
  var NumberProperty = require( 'AXON/NumberProperty' );
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
  var NEXT_BUTTON_FONT = new PhetFont( 20 );

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

    var levelNode = new RichText( model.levelDescriptions[ model.levelProperty.value ], {
      font: LEVEL_FONT,
      maxWidth: 650 // determined empirically
    } );

    var scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer'
    } );
    scoreProperty.link( function( score ) {
      model.scoreProperties[ model.levelProperty.value ].value = score;
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
      content: new Text( nextString, {
        font: NEXT_BUTTON_FONT
        //TODO maxWidth
      } ),
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      xMargin: 12,
      yMargin: 8,
      left: statusBar.centerX + 30,
      top: statusBar.bottom + 30,

      listener: function() {
        scoreProperty.value++; //TODO temporary

        //TODO crashing when dialog.dispose is called in these callbacks
        // When the score reaches 10, display a dialog
        if ( scoreProperty.value === 10 ) {
          var dialog = new RewardDialog( scoreProperty.value, {
            keepGoingButtonListener: function() {
              dialog.dispose();
            },
            newLevelButtonListener: function() {
              dialog.dispose();
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

    var updateScore = function( score ) {
      scoreProperty.value = score;
    };

    // When the level changes, update the level description and listen to the correct score
    model.levelProperty.link( function( level, oldLevel ) {
      levelNode.text = model.levelDescriptions[ level ];
      if ( oldLevel !== null ) {
        model.scoreProperties[ oldLevel ].unlink( updateScore );
      }
      model.scoreProperties[ level ].link( updateScore );
    } );

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