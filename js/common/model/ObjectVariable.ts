// Copyright 2018-2022, University of Colorado Boulder

/**
 * Describes a variable associated with a type of real-world object (sphere, apple, coin, dog, ...)
 * This is a specialization of Variable (which is a symbolic variable, e.g. 'x') that carries additional
 * information related to the real-world object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import Variable, { VariableOptions } from './Variable.js';
import equalityExplorer from '../../equalityExplorer.js';

type SelfOptions = {
  image: HTMLImageElement; // image that represents the object
  shadow: HTMLImageElement; // shadow shown while dragging the object
};

type ObjectVariableOptions = SelfOptions & VariableOptions;

export default class ObjectVariable extends Variable {

  public readonly image: HTMLImageElement;
  public readonly shadow: HTMLImageElement;

  public constructor( providedOptions: ObjectVariableOptions ) {

    // ObjectVariable does not have a visible symbol in the UI, and is instead represented as an image.
    // So use its tandem.name for the symbol.
    super( new StringProperty( providedOptions.tandem.name ), providedOptions );

    this.image = providedOptions.image;
    this.shadow = providedOptions.shadow;
  }

  public get symbol(): string {
    return this.symbolProperty.value;
  }
}

equalityExplorer.register( 'ObjectVariable', ObjectVariable );