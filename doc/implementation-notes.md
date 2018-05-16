# Equality Explorer - implementation notes

This document contains miscellaneous notes related to the implementation of Equality Explorer. 
It supplements the internal (source code) documentation, and (hopefully) provides insight into
"big picture" implementation issues.  The audience for this document is software developers who
are familiar with JavaScript and PhET simulation development (as described in 
[PhET Development Overview](http://bit.ly/phet-html5-development-overview)).

First, read [model.md](https://github.com/phetsims/equality-explorer/blob/master/doc/model.md),
which provides a high-level description of the simulation model.

## Terminology

This section defines terminology that you'll see used throughout the internal and external documentation.  There's no need to memorize this section; skim it once, refer back to it as you explore the implementation.

Standard terminology:

* balance scale (a.k.a. scale or balance) - device for weighing, corresponds to the equation that appears above it, see [BalanceScale](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/BalanceScale.js)
* constant term - term with a constant value, e.g. `1` or `2/3`, see [ConstantTerm](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/ConstantTerm.js)
* equation - a mathematical relation in which two expressions are joined by an equal sign (=)
* expression - a combination of symbols that is well-formed according to rules that depend on the context
* inequality - a mathematical relation in which two expressions are joined by a 
relational symbol (!=, >, >=, <, <=) indicating that the 2 expressions are different
* like terms - see https://en.wikipedia.org/wiki/Like_terms
* operand - an input value to an operation
* operation - in this sim, used to refer to binary operations involving one operator and two operands
* operator - in this sim, identifies the function of a binary operation, or the operators in an equation expression
* relational operator - denotes the relationship between the left and right side of an equation, e.g. `=`, `>`, `<`
* terms - numbers or objects that appear in an equation, see [Term](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Term.js)
* variable term - term with a coefficient and associated variable, e.g. `5x` or `-x`, see [VariableTerm](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/VariableTerm.js)

Sim-specific terminology:

* challenge - a single-variable equation, where the goal is to solve for the variable, see [Challenge](https://github.com/phetsims/equality-explorer/blob/master/js/solveit/model/Challenge.js)
* challenge generator - generates challenges for a specific game level, see [ChallengeGenerator](https://github.com/phetsims/equality-explorer/blob/master/js/solveit/model/ChallengeGenerator.js) and its subtypes
* clear scale button - deletes all terms from the scale
* delete snapshot button - deletes the snapshot that is selected in the Snapshots accordion box
* dragged term - a term that you're dragging
* equivalent term - a term on the opposite side that is identical to the dragged term
* inverse term - a term on the opposite side that is the inverse of the dragged term
* level-selection buttons - the buttons used to select the game level
* locked - when the sim is locked, interacting with terms on one side of the equation will result in an equivalent interaction on the opposite side
* object variable - a real-world object (shape, fruit, coin, animal) whose value is variable. As distnguished from a symbolic variable (`x`), see [ObjectVariable](https://github.com/phetsims/equality-explorer/blob/master/js/basics/model/ObjectVariable.js)
* object term - term associated with an object variable, see [ObjectTerm](https://github.com/phetsims/equality-explorer/blob/master/js/basics/model/ObjectTerm.js)
* opposite plate - the plate associated with the equivalent term, opposite the dragging term
* organize button - organizes terms on the plates
* plate - the balance scale has 2 of these, one for each side of the equation, see [Plate](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Plate.js)
* restore snapshot button - restores the snapshot that is selected in the Snapshots accordion box
* "sum to zero" - the phrase used when adding 2 terms results in a value of zero 
* term creator - responsible for creating and managing terms, uses the PhET [creator pattern](https://github.com/phetsims/scenery-phet/issues/214), see [TermCreator](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/TermCreator.js) 
* toolbox - panels that appear below the plates, terms can be dragged to/from
* universal operation - an operation that is applied to both sides of the equation, see [UniveralOperation](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/UniversalOperation.js) 

## General

This section describes how this simulation uses patterns that are common to most PhET simulations.

**Model-view transform**: Many PhET simulations have a model-view transform that maps between model and view coordinate
frames. The domain of this simulation has no need for a model coordinate frame, so the model and view coordinate frames
are treated as equivalent, and no transform is required. (If you don't understand that, don't worry about it.)

**Query parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and
testing. Sim-specific query parameters are documented in
[EqualityExplorerQueryParameters](https://github.com/phetsims/equality-explorer/blob/master/js/common/EqualityExplorerQueryParameters.js). Query parameters that are common to all sims are documented at QUERY_PARAMETERS_SCHEMA in [initialize-globals.js](https://github.com/phetsims/chipper/blob/master/js/initialize-globals.js).

**Assertions**: The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking. If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

**Memory management**: All calls that register a listener or observer have associated documentation indicating whether a corresponding call is required to deregister. This includes calls to `link`, `lazyLink`, `addListener`, `new DerivedProperty`, `Property.multilink` and `new Multilink`.  When deregistering is not needed, it's typically because instances of a type exist for the lifetime of the sim. Examples:

```js
// unlink not needed.
this.variable.valueProperty.link( function( value ) { ... } );

// removeListener required in dispose.
this.addInputListener( this.termDragListener ); 
```

Instances of the types listed below are dynamic and require memory management; `dispose` must be implemented and called. If you make significant modifications to this sim that involve dynamic types, you should perform memory leak testing similar to https://github.com/phetsims/equality-explorer/issues/64.

- `Term` and its subtypes (`ConstantTerm`, `VariableTerm`, `ObjectTerm`)
- `TermNode` and its subtypes (`ConstantTermNode`, `VariableTermNode`, `ObjectTermNode`)
- `TermDragListener` and its subtypes (`CombinedTermsDragListener`, `SeparateTermsDragListener`)
- `EquationNode`
- `EquationPanel`
- `Snapshot`
- `SumToZeroNode`
- `UniversalOperation`
- `UniversalOperationNode`
- `Challenge`
- `EqualityExplorerRewardNode`

Instances of all other types are static, created at startup or lazily, and exist for the lifetime of the sim.

**Creator Pattern**: TODO

## Screens

This section provides a concise overview of the screens, their similarities and their differences. For more details, consult the (somewhat out of date) [Equality Explorer HTML5 design document](https://docs.google.com/document/d/1xu9nawWcndFqgg5zyCGm25h-OFUsuFYnXF3QHW42spQ).

Screens differ primarily in their strategy for putting terms on the scale. The two strategies are:

(1) **Separate like terms**: Like terms occupy separate cells on the scale, and are combined only if they sum to zero. This strategy is used in the _Basics_, _Numbers_ and _Variables_ screens.  Those screens consequently have a 6x6 grid of cells on each plate.

(2) **Combine like terms**: Like terms are combined in one cell on the scale. This strategy is used in the _Operations_ and _Solve It!_ screens. Those screens have a 1x2 grid of cells on each plate; one cell for variable terms, the other cell for constant terms.

All screens have one of more _scenes_, containing four common elements: a balance scale, an equation that represents what is on the scale, 2 term toolboxes, and a Snapshots accordion box. If a screen has more than one scene, it also has a control for choosing the scene. The _Basics_ and _Solve It!_ screens have more than one scene; other screens have a single scene. 

The first three screens are similar, except for the number of scenes and types of terms in each scene.  They all use strategy (1) above for putting terms on the scale. 

The _Basics_ screen has 4 scenes with 'real-world object' terms (plus constant terms in the 'shapes' scene).  A set of radio buttons is used to choose a scene. 

The _Numbers_ screen has one scene with constant terms. It introduces the lock featues, described in more detail later.  

The _Variables_ screen has one scene with variable and constant terms. It introduces a picker for changing the variable's values.

The _Operations_ screen also has one scene with variable and constant terms, but uses strategy (2) for putting terms on the scale.  This screen also introduces the 'universal operation control', used to apply operations to both sides of the scale.

The _Solve It!_ screen has 4 scenes, one for each game level. Level-selection buttons are used to choose a scene (level). The scenes in this screen differ from other screens in a couple of important ways:  since the goal is to determine the value of `x`, the picker for setting `x` is hidden; and two equations are shown above the scale; the top one corresponds to the challenge, the bottom one corresponds to what's currently on the scale.

## Model

This section provides an overview of the most important model elements, and some miscellaneous topics
related to the model.

Fractions vs integers

All fractions must be reduced.

Model and Scenes

Variable vs ObjectVariable

EqualityExplorerMovable base type, responsibilites

Term hierarchy

TermCreator responsibilities and the creator pattern.

BalanceScale, Plate, Grid

Universal Operation

Snapshots

## View

This section provides an overview of the most important view components, and some miscellaneous topics
related to the view.

ScreenView and SceneNodes

TermNode creation and event forwarding

TermDragListener and its subtypes

Halos 

Sum-to-zero animation, halo vs no halo

Lock feature - dragged term, equivalent term, inverse term

EquationNode, dynamic vs static. Terms that evaluate to zero are omitted. A term with coefficient of `1` is displayed as `x`.  A term with coeffient of `-1` is displayed as `-x`.

## Solve It! screen

A few notes related to the _Solve It!_ screen:

[Challenge](https://github.com/phetsims/equality-explorer/blob/master/js/solveit/model/Challenge.js) encapsulates equations with the general form `ax + b = mx + n`, where the goal is to solve for `x`  Terms that evaluate to zero are omitted from the general form.

[ChallengeGenerator](https://github.com/phetsims/equality-explorer/blob/master/js/solveit/model/ChallengeGenerator.js) and its subtypes are responsible for generating challenges for the 4 game levels. Variables and comments in the code correspond to the specification in the [Challenge Generation design document](https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo).

Game levels are numbered 1 to 4 in both the model and view, and in type names (e.g. `ChallengeGenerator1` for Level 1), so that the implementation corresponds to the description in the design document.  (This differs from other models that you may have encountered, where 0-based indexing is typically used in the model, then converted to 1-based indexing in the view.) 

## Miscellaneous

**Support for multiple variables**: While this simulation only presents the student with at most one variable (`x`), the code was written to support multiple variables. As of this writing, a non-production screen is provided to verify multi-variable support.  Run with the `xy` query parameter to add the _x & y_ screen.  Note that this screen may be moved to its own simulation in the future; see https://github.com/phetsims/equality-explorer/issues/99.
