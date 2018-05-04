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

Standard math terminology:

* inequality - a mathematical relation in which two _expressions_ are joined by a 
relational symbol (!=, >, >=, <, <=) indicating that the 2 expressions are different
* equation - a mathematical relation in which two _expressions_ are joined by an equal sign (=)
* expression - a combination of symbols that is well-formed according to rules that depend on the context
* like terms - https://en.wikipedia.org/wiki/Like_terms
* operation
* operator
* operand
* term
* constant term
* variable term

Sim-specific terminology:

* object term
* dragged term
* equivalent term
* inverse term
* balance scale (aka scale or balance)
* locked
* plate
* opposite plate
* organize button
* clear plate button
* restore snapshot button
* trash snapshot button
* sum to zero
* toolbox
* universal operation
* zero pair
* challenge
* challenge generator
* level-selection buttons

## General

This section describes how this simulation uses patterns that are common to most PhET simulations.

**Model-view transform**: Many PhET simulations have a model-view transform that maps between model and view coordinate
frames. The domain of this simulation has no need for a model coordinate frame, so the model and view coordinate frames
are treated as equivalent, and no transform is required. (If you don't understand that, don't worry about it.)

**Query parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and
testing. All such query parameters are documented in
[EqualityExplorerQueryParameters](https://github.com/phetsims/equality-explorer/blob/master/js/common/EqualityExplorerQueryParameters.js).

**Memory management**:

Dynamic:
- Term and its subtypes (MysteryTerm, ConstantTerm, VariableTerm)
- TermNode and its subtypes (MysteryTermNode, ConstantTermNode, VariableTermNode)
- TermDragListener
- EquationNode
- EquationPanel
- Snapshot
- SumToZeroNode
- UniversalOperation
- UniversalOperationNode
- UniversalOperationAnimation
- Challenge
- EqualityExplorerRewardNode

Static, exists for lifetime of sim:
- everything else

Every call to `link`, `lazyLink`, `addListener`, `new DerivedProperty`, `Property.multilink` and `new Multilink`
has an associated comment that indicates whether the listener needs to be removed.

## Model

This section provides an overview of the most important model elements, and some miscellaneous topics
related to the model.

TODO

## View

This section provides an overview of the most important view components, and some miscellaneous topics
related to the view.

TODO

## Solve It! screen

- game levels numbered from 1 in both model and view, and in type names (e.g. ChallengeGenerator1)
- challenge form: ax + b = mx + n

## Miscellaneous

- support for multiple variables, 'x & y' test screen