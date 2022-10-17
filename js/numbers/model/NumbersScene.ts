// Copyright 2017-2022, University of Colorado Boulder

/**
 * The sole scene in the 'Numbers' screen.
 * This scene has constant terms only on both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import equalityExplorer from '../../equalityExplorer.js';

export default class NumbersScene extends EqualityExplorerScene {

  public constructor( tandem: Tandem ) {

    const leftTermCreators = [
      new ConstantTermCreator( {
        tandem: tandem.createTandem( 'leftTermCreators' ).createTandem( 'constantTermCreator' )
      } )
    ];

    const rightTermCreators = [
      new ConstantTermCreator( {
        tandem: tandem.createTandem( 'rightTermCreators' ).createTandem( 'constantTermCreator' )
      } )
    ];

    super( leftTermCreators, rightTermCreators, {
      tandem: tandem
    } );
  }
}

equalityExplorer.register( 'NumbersScene', NumbersScene );