# Equality Explorer - implementation notes

This document contains miscellaneous notes related to the implementation of Equality Explorer. 
It supplements the internal (source code) documentation, and (hopefully) provides insight into
"big picture" implementation issues.  The audience for this document is software developers who
are familiar with JavaScript and PhET simulation development (as described in 
[PhET Development Overview](http://bit.ly/phet-html5-development-overview)).

First, read [model.md](https://github.com/phetsims/equality-explorer/blob/master/doc/model.md),
which provides a high-level description of the simulation model.

## Terminology

This section enumerates terms that you'll see used throughout the internal and external documentation.
In alphabetical order:

* inequality - a mathematical relation in which two _expressions_ are joined by a 
relational symbol (!=, >, >=, <, <=) indicating that the 2 expressions are different
* dragged term
* equation - a mathematical relation in which two _expressions_ are joined by an equal sign (=)
* equivalent term
* expression - a combination of symbols that is well-formed according to rules that depend on the context
* ghost term
* inverse term
* like terms
* locked
* plate
* organize button
* restore snapshot button
* sum to zero
* term
* toolbox
* trash snapshot button
* universal operation
* zero pair

## General

This section describes how this simulation uses patterns that are common to most PhET simulations.

**Model-view transform**: Many PhET simulations have a model-view transform that maps between model and view coordinate
frames. The domain of this simulation has no need for a model coordinate frame, so the model and view coordinate frames
are treated as equivalent, and no transform is required. (If you don't understand that, don't worry about it.)

**Query parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and
testing. All such query parameters are documented in
[EqualityExplorerQueryParameters](https://github.com/phetsims/equality-explorer/blob/master/js/common/EqualityExplorerQueryParameters.js).

**Memory management**: TODO

## Model

This section provides an overview of the most important model elements, and some miscellaneous topics
related to the model.

TODO

## View

This section provides an overview of the most important view components, and some miscellaneous topics
related to the view.

TODO

support for multiple variables, 'x & y' test screen