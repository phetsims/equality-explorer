# Equality Explorer - implementation notes

This document contains miscellaneous notes related to the implementation of Equality Explorer. 
It supplements the internal (source code) documentation, and (hopefully) provides insight into
"big picture" implementation issues.  The audience for this document is software developers who
are familiar with JavaScript and PhET simulation development (as described in 
[PhET Development Overview](http://bit.ly/phet-html5-development-overview)).

First, read [model.md](https://github.com/phetsims/equality-explorer/blob/master/doc/model.md),
which provides a high-level description of the simulation model.

## Terminology

This section defines terminology that you'll see used throughout the internal (code) and external documentation.  There's no need to memorize this section; skim it once, refer back to it as you explore the implementation.

Standard terminology:

* balance scale (aka scale or balance) - device for weighing, corresponds to the equation that appears above it, see [BalanceScale](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/BalanceScale.js)
* constant term - term with a constant value, e.g. `1` or `2/3`, see [ConstantTerm](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/ConstantTerm.js)
* equation - a mathematical relation in which two expressions are joined by an equal sign (=)
* expression - a combination of symbols that is well-formed according to rules that depend on the context
* inequality - a mathematical relation in which two expressions are joined by a 
relational symbol (!=, >, >=, <, <=) indicating that the 2 expressions are different
* like terms - https://en.wikipedia.org/wiki/Like_terms
* operand - the input value to an operation
* operation - in this sim, used to refer to binary operations involving one operator and one operand
* operator - in this sim, identifies the function of a binary operation, or the operators in an equation expression
* relational operator - denotes the relationship between the left and right side of an equation, e.g. `=`, `>`, `<`
* terms - numbers or objects that appear in an equation, see [Term](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Term.js)
* variable term - term with a coefficient and associated variable, e.g. `5x` or `-x`, see [VariableTerm](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/VariableTerm.js)

Sim-specific terminology:

* challenge - a single-variable equation, where the goal is to solve for the variable
* challenge generator - generates challenges for a specific game level
* clear scale button - deletes all terms from the scale
* delete snapshot button - deletes the snapshot that is selected in the Snapshots accordion box
* dragged term - a term that you're dragging
* equivalent term - a term on the opposite side that is identical to the dragged term
* inverse term - a term on the opposite side that is the inverse of the dragged term
* level-selection buttons - the buttons used to select the game level
* locked - when the sim is locked, interacting with terms on one side of the equation will result in an equivalent interaction on the opposite side
* object variable - a real-world object (shape, fruit, coin, animal) whose value is variable. As distnguished from a symbolic variable (`x`)
* object term - term associated with an object variable
* opposite plate - the plate associated with the equivalent term, opposite the dragging term
* organize button - organizes terms on the plates
* plate - the balance scale has 2 of these, one for each side of the equation, see [Plate](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Plate.js)
* restore snapshot button - restores the snapshot that is selected in the Snapshots accordion box
* "sum to zero" - the phrase used when adding 2 terms results in a value of zero 
* term creator - responsible for creating and managing terms, uses the PhET creator pattern, see [TermCreator](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/TermCreator.js) 
* toolbox - panels that appear below the plates, terms can be dragged to/from
* universal operation - an operation that is applied to both sides of the equation 

## General

This section describes how this simulation uses patterns that are common to most PhET simulations.

**Model-view transform**: Many PhET simulations have a model-view transform that maps between model and view coordinate
frames. The domain of this simulation has no need for a model coordinate frame, so the model and view coordinate frames
are treated as equivalent, and no transform is required. (If you don't understand that, don't worry about it.)

**Query parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and
testing. Sim-specific query parameters are documented in
[EqualityExplorerQueryParameters](https://github.com/phetsims/equality-explorer/blob/master/js/common/EqualityExplorerQueryParameters.js). Query parameters that are common to all sims are documented at QUERY_PARAMETERS_SCHEMA in [initialize-globals.js](https://github.com/phetsims/chipper/blob/master/js/initialize-globals.js).

**Memory management**:

All calls that register an observer have associated documentation indicating whether a corresponding unregister call is required. This includes calls to `link`, `lazyLink`, `addListener`, `new DerivedProperty`, `Property.multilink` and `new Multilink`.  When unregistering is not needed, it's typically because instances of a type exist for the lifetime of teh sim. Examples:

```js
// unlink not needed.
this.variable.valueProperty.link( function( value ) { ... } );

// removeListener required when the term is disposed.
term.disposedEmitter.addListener( this.termWasDisposedBound );
```

Instances of these types are dynamic and require memory management; `dispose` must be implemented and called.

- Term and its subtypes (ConstantTerm, VariableTerm, ObjectTerm)
- TermNode and its subtypes (ConstantTermNode, VariableTermNode, MysteryTermNode)
- TermDragListener and its subtypes (CombinedTermsDragListener, SeparateTermsDragListener)
- EquationNode
- EquationPanel
- Snapshot
- SumToZeroNode
- UniversalOperation
- UniversalOperationNode
- UniversalOperationAnimation
- Challenge
- EqualityExplorerRewardNode

Instances of all other types are static, created during sim initialization, and exist for the lifetime of sim.

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
