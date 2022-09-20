// Copyright 2018-2022, University of Colorado Boulder

/**
 * Describes a variable associated with a type of real-world object (sphere, apple, coin, dog, ...)
 * This is a specialization of Variable (which is a symbolic variable, e.g. 'x') that carries additional
 * information related to the real-world object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Variable, { VariableOptions } from '../../common/model/Variable.js';
import equalityExplorer from '../../equalityExplorer.js';

type SelfOptions = EmptySelfOptions;

type ObjectVariableOptions = SelfOptions & VariableOptions;

export default class ObjectVariable extends Variable {

  // image that represents the object
  public readonly image: HTMLImageElement;

  // shadow shown while dragging the object
  public readonly shadow: HTMLImageElement;

  public constructor( symbol: string, image: HTMLImageElement, shadow: HTMLImageElement, providedOptions?: ObjectVariableOptions ) {

    super( new StringProperty( symbol ), providedOptions );

    this.image = image;
    this.shadow = shadow;
  }
}

equalityExplorer.register( 'ObjectVariable', ObjectVariable );