// Copyright 2018-2024, University of Colorado Boulder

/**
 * Describes a variable associated with a type of real-world object (sphere, apple, coin, dog, ...)
 * This is a specialization of Variable (which is a symbolic variable, e.g. 'x') that carries additional
 * information related to the real-world object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import Variable, { VariableOptions } from './Variable.js';

type SelfOptions = {
  image: HTMLImageElement; // image that represents the object
  shadow: HTMLImageElement; // shadow shown while dragging the object
};

type ObjectVariableOptions = SelfOptions & VariableOptions;

export default class ObjectVariable extends Variable {

  public readonly image: HTMLImageElement;
  public readonly shadow: HTMLImageElement;

  public constructor( providedOptions: ObjectVariableOptions ) {

    const options = optionize<ObjectVariableOptions, SelfOptions, VariableOptions>()( {
      range: EqualityExplorerConstants.OBJECT_VARIABLE_RANGE
    }, providedOptions );

    // ObjectVariable does not have a visible symbol in the UI, and is instead represented as an image.
    // So use its tandem.name for the symbol.
    super( new StringProperty( options.tandem.name ), options );

    this.image = options.image;
    this.shadow = options.shadow;
  }

  public get symbol(): string {
    return this.symbolProperty.value;
  }
}

equalityExplorer.register( 'ObjectVariable', ObjectVariable );