# Equality Explorer - implementation notes

This document contains notes related to the implementation of Equality Explorer. This is not an exhaustive description
of the implementation. The intention is to provide a high-level overview, and to supplement the internal documentation (
source code comments) and external documentation (design documents).

The audience for this document is software developers who are familiar with JavaScript and PhET simulation development,
as described
in [PhET Development Overview](https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md). The
reader should also be familiar with general design patterns used in PhET simulations.

Before reading this document, see [model.md](https://github.com/phetsims/equality-explorer/blob/main/doc/model.md),
which provides a high-level description of the simulation model.

There are two design documents for this sim, but they are not necessarily up to date:

- [Equality Explorer HTML5](https://docs.google.com/document/d/1xu9nawWcndFqgg5zyCGm25h-OFUsuFYnXF3QHW42spQ)
- [Equality Explorer Game](https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo)

## Terminology

This section defines terminology that you'll see used throughout the internal and external documentation. There's no
need to memorize this section; skim it once, refer back to it as you explore the implementation.

Standard terminology:

* balance scale (a.k.a. scale or balance) - device for weighing, corresponds to the equation that appears above it,
  see `BalanceScale`
* constant term - term with a constant value, e.g. `1` or `2/3`, see `ConstantTerm`
* equation - a mathematical relation in which two expressions are joined by an equals sign (=)
* expression - in this sim, one side of an equation or inequality
* inequality - a mathematical relation in which two expressions are joined by a relational symbol (!=, >, >=, <, <=)
  indicating that the 2 expressions are different. In this simulation, the relational symbols are limited to > and <.
* like terms - terms that have the same variables and powers, see https://en.wikipedia.org/wiki/Like_terms
* operand - an input value to an operation
* operation - in this sim, used to refer to binary operations involving one operator and two operands
* operator - in this sim, identifies the function of a binary operation, or the operators in an equation expression
* relational operator - denotes the relationship between the left and right side of an equation, e.g. `=`, `>`, `<`
* terms - numbers or objects that appear in an equation, see `Term`.
* variable term - term with a coefficient and associated variable, e.g. `5x` or `-x`, see `VariableTerm`

Sim-specific terminology:

* challenge - a single-variable equation, where the goal is to solve for the variable, see `Challenge`
* challenge generator - generates challenges for a specific game level, see `ChallengeGenerator` and its subclasses
* "clear scale" button - deletes all terms from the scale
* "delete snapshot" button - deletes the snapshot that is selected in the Snapshots accordion box
* dragged term - the term that you're dragging
* equivalent term - the term on the opposite side of the scale that is identical to the dragged term
* inverse term - a term created on the opposite side of the scale that is the inverse of the dragged term, and is paired
  with the equivalent term
* level-selection buttons - the buttons used to select the game level
* locked - when the sim is locked, interacting with terms on one side of the equation will result in an equivalent
  interaction on the opposite side. See the [**Lock feature
  **](https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md#lock-feature) section for more
  details.
* object variable - a real-world object (shape, fruit, coin, animal) whose value is variable. As distinguished from a
  symbolic variable (`x`), see `ObjectVariable`
* object term - a term associated with an object variable, see `ObjectTerm`
* opposite plate - the plate associated with the equivalent term, opposite the dragged term
* "organize" button - organizes terms on the plates
* plate - the balance scale has 2 of these, one for each side of the equation, see `Plate`
* "restore snapshot" button - restores the snapshot that is selected in the Snapshots accordion box
* "sum to zero" - the phrase used when adding 2 terms results in a value of zero
* term creator - responsible for creating and managing terms, uses the
  PhET [creator pattern](https://github.com/phetsims/scenery-phet/issues/214), see `TermCreator`
* toolbox - panel that appear below a plate, terms can be dragged to/from
* universal operation - an operation that is applied to both sides of the equation, see `UniveralOperation`

## Common Patterns

This section describes how this simulation uses patterns that are generally common to PhET simulations.

**Model-view transform**: Many PhET simulations have a model-view transform that maps between model and view coordinate
frames. The domain of this simulation has no need for a model coordinate frame, so the model and view coordinate frames
are treated as equivalent, and no transform is required.

**Coordinate frames**: There is one global coordinate frame used to represent all locations throughout the sim. That
coordinate frame is described by `ScreenView.DEFAULT_LAYOUT_BOUNDS`. All coordinates and distances are unitless. There
is no use of relative coordinates; for example, the location of a term on a plate is expressed in the global coordinate
frame, not in a coordinate frame relative to the location of the plate.

**Query parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and testing.
Sim-specific query parameters are documented in `EqualityExplorerQueryParameters`.

**Assertions**: The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking.
If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

**Memory management**:

Instances of the classes listed below are dynamic &mdash; they come and go during the lifetime of the sim. They require
memory management, so `dispose` must be implemented and called. If you make modifications that involve dynamic classes,
you should perform memory leak testing similar
to [equality-explorer#64](https://github.com/phetsims/equality-explorer/issues/64).

- `Term` and its subclasses (`ConstantTerm`, `VariableTerm`, `ObjectTerm`)
- `TermNode` and its subclasses (`ConstantTermNode`, `VariableTermNode`, `ObjectTermNode`)
- `TermDragListener` and its subclasses (`CombinedTermsDragListener`, `SeparateTermsDragListener`)
- `Snapshot`
- `SumToZeroNode`
- `UniversalOperation`
- `UniversalOperationNode`
- `Challenge`
- `SolveItRewardNode`
- `HaloNode`
- `ReducedFractionNode`
- `SumToZeroNode`

Instances of other classes are static. They are created at startup or lazily, exist for the lifetime of the sim, and
were not designed (or intended) to be disposed. They are created with `isDisposable: false`, or have a `dispose` method
that looks like this:

```ts
public dispose(): void {
  Disposable.assertNotDisposable();
}
```

**Creator Pattern**: A very general description of this pattern can be found at
https://github.com/phetsims/phet-info/blob/main/doc/phet-software-design-patterns.md#creator-with-drag-forwarding. But
in practice, this pattern is implemented in many differing ways. So I'll attempt to summarize how this pattern is
applied in this simulation.

A creator is responsible for handling the user interaction that results in the creation of both the model and view for a
class of model element. In this sim, the creator is also responsible for managing the model element throughout its
lifecycle.

Creators live in the toolboxes below the scale, see `TermsToolboxNode`. The objects displayed in the toolboxes
are `TermCreatorNode`s, each with an associated `TermCreator`. Clicking on one of the objects in the toolbox creates a
term, via the following steps:

1. The `TermCreatorNode` receives a Scenery input `{SceneryEvent} event`. The `TermCreatorNode` propagates the `event`
   to its associated `TermCreator`, and instructs it to create a `Term`. See `addInputListener` in `TermCreatorNode`.
2. The `TermCreator` creates the `Term`, adds it to its list of managed `Term`s, and adds a listener to the `Term`'
   s `{Emitter} disposedEmitter` (fired when the `Term` is eventually disposed). See `createTerm` in `TermCreator`.
3. The `TermCreator` notifies listeners that a new `Term` has been created by firing `{Emitter} termCreatedEmitter`.
   The `event` is propagated to `termCreatedEmitter` listeners. See `manageTerm` in `TermCreator`.
4. The view listens for `termCreatedEmitter`. It creates the associated view component, a `TermNode` subclass.
   The `event` is propagated to the `TermNode`. A listener is added for the `Term`'s `disposedEmitter`, to dispose of
   the associated `TermNode`. See `termCreatedListener` in `EqualityExplorerSceneNode`.
5. `TermNode` propagates the `event` to its drag listener, a subclass of `TermDragListener`. Interaction with the
   newly-created `Term` begins. See `startDrag` in `TermNode`.

A term's lifecycle ends when it is returned to the toolbox, or when some action results in deleting it from the scale.
When a term is disposed, the following steps occur:

1. The `Term`'s `dispose` method is called, which causes its `disposedEmitter` to fire. See `dispose`
   in `EqualityExplorerMovable`, the superclass of `Term`.
2. The `TermCreator` that manages the `Term` receives notification that the `Term` has been disposed. It removes
   the `Term` from the scale (if relevant), and removes the `Term` from its list of managed `Term`s.
   See `termWasDisposed` in `TermCreator`.
3. The view listener associated with the `Term`'s `disposedEmitter` receives notification that the `Term` has been
   disposed. The listener calls the associated `TermNode`'s `dispose` method, removing it from the scenegraph.
   See `termCreatedListener` in `EqualityExplorerSceneNode`.

**Big Numbers**: In screens where like terms are combined (_Operations_ and _Solve It!_) there is no inherent maximum
value. If we allowed it, values would grow arbitrarily large, exceeding the ability to be represented. All integers (
including numerators and denominators) are therefore limited to `EqualityExplorerQueryParameters.maxInteger`,
currently `1E9`. If an interaction or operation would exceed that value, it is canceled, and the user is presented with
a dialog that informs them of the constraint.

## Screens and Scenes

This section provides a concise overview of the screens, their similarities and their differences. For more details,
consult the (somewhat out of
date) [Equality Explorer HTML5 design document](https://docs.google.com/document/d/1xu9nawWcndFqgg5zyCGm25h-OFUsuFYnXF3QHW42spQ).

Screens differ primarily in their strategy for putting terms on the scale. The two strategies are:

(1) **Separate like terms**: Like terms occupy separate cells on the scale, and are combined only if they sum to zero.
This strategy is used in the _Basics_, _Numbers_ and _Variables_ screens. Those screens have a 6x6 grid of cells on each
plate (visible using the `showGrid` query parameter).

(2) **Combine like terms**: Like terms are combined in one cell on the scale. This strategy is used in the _Operations_
and _Solve It!_ screens. Those screens have a 1x2 grid of cells on each plate; one cell for variable terms, the other
cell for constant terms.

All screens have one or more _scenes_, containing four common elements: a balance scale, an equation that represents
what is on the scale, 2 toolboxes containing `TermCreator`s, and a set of snapshots. If a screen has more than one
scene, it also has a control for choosing the scene. The _Basics_ and _Solve It!_ screens have more than one scene;
other screens have a single scene.

The first three screens are similar, except for the number of scenes and classes of terms in each scene. They all use
strategy (1) above for putting terms on the scale.

The _Basics_ screen has 4 scenes with 'real-world object' terms (plus constant terms in the 'shapes' scene). A set of
radio buttons is used to choose a scene.

The _Numbers_ screen has one scene with constant terms. It introduces the lock feature, described in the [**Lock feature
**](https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md#lock-feature) section.

The _Variables_ screen has one scene with variable terms and constant terms. It introduces a picker for changing the
variable's values.

The _Operations_ screen also has one scene with variable terms and constant terms, but uses strategy (2) for putting
terms on the scale. This screen also introduces the 'universal operation control', used to apply operations to both
sides of the scale.

The _Solve It!_ screen has 4 scenes, one for each game level. Level-selection buttons are used to choose a scene. The
scenes in this screen differ from other screens in a couple of important ways: Since the goal is to determine the value
of `x`, the picker for setting `x` is hidden. Two equations are shown above the scale &mdash; the top one corresponds to
the challenge, the bottom one corresponds to what's currently on the scale. See the [**Solve It! screen
**](https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md#solve-it-screen) section for
more notes.

## Model

This section provides an overview of the most important model elements, and some miscellaneous topics related to the
model.

`EqualityExplorerScene` is the base class for all scenes. See the [**Screens and Scenes
**](https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md#screens-and-scenes) section
above for a description of scenes.

The balance scale is composed of 3 primary model elements: `BalanceScale`, `Plate`, and `Grid`.

`EqualityExplorerMovable` is a base class that is responsible for an object's location and animation to a desired
location. It's used to implement terms.

`Term` is the base class for terms. There are 3 subclasses. `ConstantTerm` corresponds to constant terms. `VariableTerm`
corresponds to terms that are associated with a symbolic variable, e.g. `x`.  `ObjectTerm` is a term that is associated
with a real-world object (shape, fruit, coin, animal). VariableTerm and ObjectTerm are similar in that they are
associated with a variable, but their requirements are different enough to justify separate classes. And there are in
fact two variable classes: `Variable` is a typical symbolic variable, and its subclass `ObjectVariable` contains more
information pertaining to a real-world object. (Note that the value of ObjectVariables cannot be change in _Equality
Explorer_, but they can be changed in the _Equality Explorer: Basics_ simulation.)

`TermCreator` is the base class for creating and managing terms. It uses the PhET creator pattern, described more in
the [**Common Patterns
**](https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md#common-patterns) section. Term
creators are responsible for creating and managing terms. There is a subclass for each term class,
namely `ConstantTermCreator`, `VariableTermCreator`, and `ObjectTermCreator`.

`UniversalOperation` encapsulates a _universal operation_, terminology invented in the design document. It refers to an
operation that is applied to all terms on both sides of the scale, using a control that allows the student to select a
binary operator and an operand. The operands are `ConstantTerm` and `VariableTerm` instances.

`Snapshot` encapsulates the full state of the scale, including associated variables, terms, and the cells that those
terms occupy on the plates. `SnapshotCollection` is the collection of `Snapshot`s, and contains one related Property for
each possible `Snapshot`.

Throughout the simulation, variable values are represented using integers. All other numbers (constants,
coefficients,...) are represented as fractions, using the common-code `Fraction` class. Fraction are always in reduced
form, both in the model and view.

## View

This section provides an overview of the most important view components, and some miscellaneous topics related to the
view.

`EqualityExplorerSceneNode` is the base class for all scenes. See the [**Screens and Scenes
**](https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md#screens-and-scenes) section
above for a description of scenes. There is one `SceneNode` instance for each `Scene` instance. For screens that have
more than one scene, one `EqualityExplorerSceneNode` is made visible depending on which `Scene` is selected. Primarily
for performance reasons, we do not mutate a single instance of `EqualityExplorerSceneNode`.

`TermNode` is the base class for all terms. There is a subclass for each class of term,
namely `ConstantTermNode`, `VariableTermNode`, and `ObjectTermNode`.

Every `TermNode` has an associated drag listener that is a subclass of `TermDragListener`. `TermDragListener` and its
subclasses are the most complicated part of this simulation's implementation; they encapsulate all drag behavior,
animation behavior, and the lock feature (described in more detail in the [**Lock feature
**](https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md#lock-feature) section). Which
subclass of `TermDragListener` is used depends on the strategy used for putting terms on the scale, as described in
the [**Screens and Scenes
**](https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md#screens-and-scenes) section
above. [SeparateTermsDragListener](https://github.com/phetsims/equality-explorer/blob/main/js/common/view/SeparateTermsDragListener.js)
is used when like terms occupy separate cells on the scale. `CombinedTermsDragListener` is used when like terms are
combined in one cell on the scale.

`SumToZeroNode` encapsulates the animation that occurs when two like terms sum to zero. When constant terms sum to zero,
a '0' is displayed and fades out. When variable terms sum to zero, a '0x' is displayed and fades out. `SumToZeroNode`
includes an optional yellow halo, displayed when terms that sum to zero overlap while dragging. When terms sum to zero,
the animation is displayed after the scale moves, in the same cell that was previously occupied by one of the terms.
When a universal operation is applied, or when the lock feature is on, multiple terms may sum to zero as the result of
an operation. In these scenarios, animations are batched and displayed at the completion of the operation, after the
scale has reached equilibrium. For an example of batching, see `animateSumToZero` in `EqualityExplorerSceneNode`.

`EquationNode` displays equations throughout the simulation &mdash; in the "Equation or inequality" and "Snapshots"
accordion boxes, and in the _Solve It!_ screen. It handles all classes of terms, and omits terms that evaluate to zero.
A variable term (e.g. `x`) with coefficient of `1` is displayed as `x`. A variable term with coeffient of `-1` is
displayed as `-x`.

`SnapshotsAccordionBox` has an associated `SnapshotsCollection`, and allows the student to take N possible snapshots of
the current scene configuration. `SnapshotControl` alternates between displaying a camera button (for taking a snapshot)
and displaying a snapshot's equation. At most one snapshot can be selected at a time, and clicking anywhere
outside `SnapshotsAccordionBox` clears the selection. Controls at the bottom of `SnapshotsAccordionBox` apply to the
snapshots.

## Solve It! screen

A few notes related to the _Solve It!_ screen, since it has some components that are unique to this screen.

`Challenge` encapsulates equations with the general form `ax + b = mx + n`, where the goal is to solve for `x`. Terms
that evaluate to zero are omitted from the general form.

`ChallengeGenerator` and its subclasses are responsible for generating challenges for the 4 game levels. Variable names
and comments in the code correspond to the specification in
the [Challenge Generation design document](https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo).

Game levels are numbered 1 to 4 in both the model and view, and in class names (e.g. `ChallengeGenerator1` for Level 1),
so that the implementation corresponds to the description in the design document. This differs from the more typical
approach of using 0-based indexing in the model, then converted to 1-based indexing in the view.

## Lock feature

The lock feature is complicated enough to warrant its own section in this document. Specification of the lock feature is
spread out across
the [Equality Explorer HTML5](https://docs.google.com/document/d/1xu9nawWcndFqgg5zyCGm25h-OFUsuFYnXF3QHW42spQ) design
document, GitHub issue [equality-explorer#19](https://github.com/phetsims/equality-explorer/issues/19) and the
documentation in `TermDragListener`.

Each `TermNode` has an associated `Term` model element, and a `TermDragListener` that handles dragging the
associated `Term`. When unlocked, `TermDragListener` is responsible only for dragging its associated `Term`. When
locked, the `TermDragListener` becomes responsible for three `Term`s, as defined in the **Terminology*** section:

The _dragged term_ is the `Term` that is associated with the `TermNode`. It's the same `Term` that is controlled when
unlocked.

The _equivalent term_ a term on the opposite side of the scale that is identical to the dragged term. While dragging and
animating, it tracks the movement of the dragged term, but it is not draggable itself. If the dragged term originated
from a toolbox, then the equivalent term originates from the toolbox on the opposite side of the scale. If the dragged
term was on the scale, then the equivalent term was taken from the scale on the opposite plate. If no equivalent term
existed on the opposite plate, then the equivalent term and an _inverse term_ are created on the opposite plate. The
equivalent term tracks the dragged term, while the inverse term remains on the opposite plate. The inverse term is
draggable, and dragging it breaks its association with the dragged term and equivalent term. The inverse term is
relevant only for screens that use the 'separate like terms' strategy as described in [**Scenes and Scenes
**](https://github.com/phetsims/equality-explorer/blob/main/doc/implementation-notes.md#screens-and-scenes).

The dragged term and equivalent term must be added to the scale simultaneously. As soon as the dragged term reaches its
plate, the equivalent term immediately jumps to its location on the opposite plate. After investigating other
alternatives (e.g. proportional animation) it was decided that this approach was most desirable.

When the state of the lock feature changes, any `Terms` that are not on the scale (i.e. `Terms` that are dragging or
animating) are immediately disposed. This simolification eliminates the need to handle some complicated multitouch
scenarios.

For an overview of various scenarios involving the lock feature,
see [lock-scenarios.md](https://github.com/phetsims/equality-explorer/blob/main/doc/lock-scenarios.md).

## PhET-iO

**Dialogs**: The sim has 3 OopsDialogs, used to display messages when something goes wrong. They are implemented as
static instances, and reused when needed.
`EqualityExplorerSceneNode` is responsible for instantiating those instances eagerly. No PhetioCapsule is involved.

## Related simulations

**Equality Explorer: Basics**: The _Basics_ screen in this sim is identical to the _Basics_ screen in _Equality
Explorer_. The _Lab_ screen adds the ability to change the values (weights) of real-world objects, something that was
not doable in _Equality Explorer_.

**Equality Explorer: Two Variables**: Equality Explorer presents the student with one variable, `x`. But the code was
written to support multiple variables, and that's demonstrated in _Equality Explorer: Two Variables_, where the student
is presented with equations involving `x` and `y`.
