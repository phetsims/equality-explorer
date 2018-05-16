# Equality Explorer - implementation notes

This document contains notes related to the implementation of Equality Explorer. This is not an exhaustive description of the implementation.  The intention is to provide a high-level overview, and to supplement the internal documentation (source code comments) and external documentation (design documents).  

The audience for this document is software developers who are familiar with JavaScript and PhET simulation development (as described in [PhET Development Overview](http://bit.ly/phet-html5-development-overview)).  The reader should also be familiar with general design patterns used in PhET simulations.

Before reading this document, see [model.md](https://github.com/phetsims/equality-explorer/blob/master/doc/model.md), which provides a high-level description of the simulation model.

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
* object variable - a real-world object (shape, fruit, coin, animal) whose value is variable. As distinguished from a symbolic variable (`x`), see [ObjectVariable](https://github.com/phetsims/equality-explorer/blob/master/js/basics/model/ObjectVariable.js)
* object term - term associated with an object variable, see [ObjectTerm](https://github.com/phetsims/equality-explorer/blob/master/js/basics/model/ObjectTerm.js)
* opposite plate - the plate associated with the equivalent term, opposite the dragging term
* organize button - organizes terms on the plates
* plate - the balance scale has 2 of these, one for each side of the equation, see [Plate](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Plate.js)
* restore snapshot button - restores the snapshot that is selected in the Snapshots accordion box
* "sum to zero" - the phrase used when adding 2 terms results in a value of zero 
* term creator - responsible for creating and managing terms, uses the PhET [creator pattern](https://github.com/phetsims/scenery-phet/issues/214), see [TermCreator](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/TermCreator.js) 
* toolbox - panels that appear below the plates, terms can be dragged to/from
* universal operation - an operation that is applied to both sides of the equation, see [UniveralOperation](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/UniversalOperation.js) 

## Common Patterns

This section describes how this simulation uses patterns that are generally common to PhET simulations.

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

Instances of the types listed below are dynamic &mdash; they come and go during the lifetime of the sim. They require memory management, so `dispose` must be implemented and called. If you make modifications that involve dynamic types, you should perform memory leak testing similar to https://github.com/phetsims/equality-explorer/issues/64.

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

Instances of all other types are static. They are created at startup or lazily, and exist for the lifetime of the sim.

**Creator Pattern**: Discussion about this pattern can be found in https://github.com/phetsims/scenery-phet/issues/214. What you won't find there is a summary of the pattern or a canonical example.  So I'll attempt to summarize what it is, and how it's applied in this simulation.  

A creator is responsible for handling the user interaction that results in the creation of both the model and view for a type of model element.  In this sim, the creator is also responsible for managing the model element throughout its lifecycle.  

In this sim, creators live in the toolboxes below the scale, see [TermsToolbox](https://github.com/phetsims/equality-explorer/blob/master/js/common/view/TermsToolbox.js). The objects displayed in the toolboxes are `TermCreatorNode`s, each with an associated `TermCreator`.  Clicking on one of the objects in the toolbox creates a term, via the following steps:

1. The `TermCreatorNode` receives the `{Event} event`.
2. The `TermCreatorNode` propagates the `event` to its associated `TermCreator`, and instructs it to create a `Term`.  See `addInputListener` in `TermCreatorNode`.
3. The `TermCreator` creates the `Term`, adds it to its list of managed `Term`s, and adds a listener to the `Term`'s `{Emitter} disposedEmitter` (fired when the `Term` is eventually disposed).  See `createTerm` in `TermCreator`. 
4. The `TermCreator` notifies listeners that a new `Term` has been created by firing `{Emitter} termCreatedEmitter`. The `event` that was provided by the `TermCreator` is propagated to `termCreatedEmitter` listeners. See `manageTerm` in `TermCreator`.
5. The view listens for `termCreatedEmitter`. It creates the associated view component, a `TermNode` subtype. The `event` is propagated to the `TermNode`.  A listener is added for the `Term`'s `disposedEmitter`, to dispose of the associated `TermNode`. See `termCreatedListener` in `SceneNode`.
6. `TermNode` propagates the `event` to its drag listener, a subtype of `TermDragListener`. Interaction with the newly-created `Term` begins.  See `startDrag` in `TermNode`.

A term's lifecycle ends when it is returned to the toolbox, or when some action results in deleting it from the scale. When a term is disposed, the following steps occur:

1. The `Term`'s `dispose` method is called, which causes its `disposedEmitter` to fire.  See `dispose `in `EqualityExplorerMovable`. 
2. The `TermCreator` that manages the `Term` receives notification that the `Term` has been disposed. It removes the `Term` from the scale (if relevant), and removes the `Term` from its list of managed `Term`s.  See `termWasDisposed` in `TermCreator`.
3. The listener associated with the `Term`'s `disposedEmitter` receives notification that the `Term` has been disposed. The listener calls the `TermNode`'s `dispose` method, removing it from the scenegraph.  See `termCreatedListener` in `SceneNode`.

## Screens and Scenes

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

[Scene](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Scene.js) is the base type for all scenes.  See the [**Screens and Scenes**](https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md#screens-and-scenes) section above for a description of scenes.

The balance scale is composed of 3 primary model elements: [BalanceScale](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/BalanceScale.js), [Plate](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Plate.js) and [Grid](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Grid.js).

[EqualityExplorerMovable](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/EqualityExplorerMovable.js) is a base type that is responsible for an object's location and animation to a desired location. It's used to implement terms.

[Term](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Term.js) is the base type for terms. There are 3 subtypes. [ConstantTerm](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/ConstantTerm.js) corresponds to constant terms. [VariableTerm](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/VariableTerm.js) corresponds to terms that are associated with a symbolic variable, e.g. `x`.  [ObjectTerm](https://github.com/phetsims/equality-explorer/blob/master/js/basics/model/ObjectTerm.js) is a term that is associated with a real-world object (shape, fruit, coin, animal).  VariableTerm and ObjectTerm are similar in that they are associated with a variable, but their requirements are different enough to justify separate types.  And there are in fact two variable types: [Variable](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/Variable.js) is a typical symbolic variable, and its subtype [ObjectVariable](https://github.com/phetsims/equality-explorer/blob/master/js/basics/model/ObjectVariable.js) contains more information pertaining to a real-world object. (Note that the value of ObjectVariables cannot be change in _Equality Explorer_, but they can be changed in the _Equality Explorer: Basics_ simulation.) 

[TermCreator](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/TermCreator.js) is the base type for creating and managing terms. It uses the PhET creator pattern, described more in the [**Common Patterns**](https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md#common-patterns) section.  Term creators are responsible for creating and managing terms.  There is a subtype for each term type, namely [ConstantTermCreator](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/ConstantTermCreator.js), [VariableTermCreator](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/VariableTermCreator.js) and [ObjectTermCreator](https://github.com/phetsims/equality-explorer/blob/master/js/basics/model/ObjectTermCreator.js).

[UniversalOperation](https://github.com/phetsims/equality-explorer/blob/master/js/common/model/UniversalOperation.js) encapsulates a 'universal operation', terminology invented in the design document. It refers to an operation that is applied to all terms both sides of the scale, using a control that allows the student to select a binary operator and an operand. The operands are `Term` instances.

Snapshots

Through the simulation, variable values are represented using integers. All other numbers (constants, coefficients,...) are represented using fraction, using the common-code [Fraction](https://github.com/phetsims/phetcommon/blob/master/js/model/Fraction.js) type.  Fraction are always in reduced form, both in the model and view.

## View

This section provides an overview of the most important view components, and some miscellaneous topics
related to the view.

ScreenView and SceneNodes

TermNode creation and event forwarding

TermDragListener and its subtypes

Halos 

Sum-to-zero animation, halo vs no halo, location based on where the plates are post-operation, batching for universal operation, batching when lock is on

Lock feature - dragged term, equivalent term, inverse term

EquationNode, dynamic vs static. Terms that evaluate to zero are omitted. A term with coefficient of `1` is displayed as `x`.  A term with coeffient of `-1` is displayed as `-x`.

## Solve It! screen

A few notes related to the _Solve It!_ screen:

[Challenge](https://github.com/phetsims/equality-explorer/blob/master/js/solveit/model/Challenge.js) encapsulates equations with the general form `ax + b = mx + n`, where the goal is to solve for `x`  Terms that evaluate to zero are omitted from the general form.

[ChallengeGenerator](https://github.com/phetsims/equality-explorer/blob/master/js/solveit/model/ChallengeGenerator.js) and its subtypes are responsible for generating challenges for the 4 game levels. Variables and comments in the code correspond to the specification in the [Challenge Generation design document](https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo).

Game levels are numbered 1 to 4 in both the model and view, and in type names (e.g. `ChallengeGenerator1` for Level 1), so that the implementation corresponds to the description in the design document.  (This differs from the more typical approach of using 0-based indexing in the model, then converted to 1-based indexing in the view.) 

## Miscellaneous

**Support for multiple variables**: While this simulation only presents the student with at most one variable (`x`), the code was written to support multiple variables. As of this writing, a non-production screen is provided to verify multi-variable support.  Run with the `xy` query parameter to add the _x & y_ screen.  Note that this screen may be moved to its own simulation in the future; see https://github.com/phetsims/equality-explorer/issues/99.
