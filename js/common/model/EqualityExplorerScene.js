// Copyright 2017, University of Colorado Boulder

/**
 * Model for a scene in Equality Explorer.
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
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var StringProperty = require( 'AXON/StringProperty' );

  /**
   * @param {Node} icon
   * @param {Object} [options]
   * @constructor
   */
  function EqualityExplorerScene( icon, options ) {

    options = options || {};

    // @public (read-only) Node used to represent the scene
    this.icon = icon;

    // @public (read-only)
    this.variableRange = new RangeWithValue( -40, 40, 1 );

    // @public
    this.variableValueProperty = new Property( this.variableRange.defaultValue );

    // @public (read-only)
    this.scaleAngleProperty = new Property( 0 );

    // @private
    this.rotationMultiplier = 1;

    // @public
    this.equationAccordionBoxExpandedProperty = new Property( true );
    this.snapshotsAccordionBoxExpandedProperty = new Property( true );
    this.variableAccordionBoxExpandedProperty = new Property( true );

    // @public whether the couplers that connects the 2 sides of the scale are coupled
    this.coupledProperty = new Property( false );

    // @public
    this.operatorProperty = new StringProperty( EqualityExplorerConstants.OPERATORS[ 0 ], {
      isValidValue: function( value ) {
        return _.includes( EqualityExplorerConstants.OPERATORS, value );
      }
    } );
    this.operandProperty = new Property( 1 );
  }

  equalityExplorer.register( 'EqualityExplorerScene', EqualityExplorerScene );

  return inherit( Object, EqualityExplorerScene, {

    // @public
    reset: function() {
      this.variableValueProperty.reset();
      this.scaleAngleProperty.reset();
      this.equationAccordionBoxExpandedProperty.reset();
      this.snapshotsAccordionBoxExpandedProperty.reset();
      this.variableAccordionBoxExpandedProperty.reset();
      this.operatorProperty.reset();
      this.operandProperty.reset();
    },

    // @public
    step: function( dt ) {
      this.rotateScale();
    },

    // @private for demo purposes only
    rotateScale: function() {

      var maxAngle = Math.PI / 15; // maximum rotation
      var deltaAngle = maxAngle / 80; // rotation per step

      var newAngle = this.scaleAngleProperty.value + ( this.rotationMultiplier * deltaAngle );

      if ( newAngle >= maxAngle ) {
        newAngle = maxAngle;
        this.rotationMultiplier = -1;
      }
      else if ( newAngle <= -maxAngle ) {
        newAngle = -maxAngle;
        this.rotationMultiplier = 1;
      }

      assert && assert( Math.abs( newAngle ) <= maxAngle );
      this.scaleAngleProperty.value = newAngle;
    }
  } );
} );

