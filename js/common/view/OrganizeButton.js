// Copyright 2017-2020, University of Colorado Boulder

/**
 * Pressing this button organizes terms on the scale, grouping like terms together.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import equalityExplorer from '../../equalityExplorer.js';

class OrganizeButton extends RectangularPushButton {

  /**
   * @param {function} organizeFunction
   * @param {Object} [options]
   */
  constructor( organizeFunction, options ) {

    options = merge( {

      // RectangularPushButton options
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5

    }, options );

    assert && assert( !options.content, 'OrganizeButton sets content' );

    // SVG path description is the "d=" field from organize-icon.svg
    // See assets/README.md for more details.
    options.content = new Path(
      'M253.5,162.5h-58v-58h58V162.5z M253.5,170.5h-58v58h58V170.5z M57.018,35.5\n' +
      '\tc-16.568,0-30,13.432-30,30s13.432,30,30,30s30-13.432,30-30S73.586,35.5,57.018,35.5z M57.018,102.5c-16.568,0-30,13.432-30,30\n' +
      '\ts13.432,30,30,30s30-13.432,30-30S73.586,102.5,57.018,102.5z M57.018,169.5c-16.568,0-30,13.432-30,30s13.432,30,30,30\n' +
      '\ts30-13.432,30-30S73.586,169.5,57.018,169.5z M360.975,95.5l-34.677-60.061L291.622,95.5H360.975z M360.975,162.5l-34.677-60.061\n' +
      '\tL291.622,162.5H360.975z M360.975,229.5l-34.677-60.061L291.622,229.5H360.975z M128.018,102.5c-16.568,0-30,13.432-30,30\n' +
      '\ts13.432,30,30,30s30-13.432,30-30S144.586,102.5,128.018,102.5z M128.018,169.5c-16.568,0-30,13.432-30,30s13.432,30,30,30\n' +
      '\ts30-13.432,30-30S144.586,169.5,128.018,169.5z', {
        fill: 'black',
        scale: 0.105
      } );

    assert && assert( !options.listener, 'OrganizeButton sets listener' );
    options.listener = () => {
      phet.log && phet.log( 'OrganizeButton pressed' );
      organizeFunction();
      this.enabled = false;
    };

    super( options );
  }
}

equalityExplorer.register( 'OrganizeButton', OrganizeButton );

export default OrganizeButton;