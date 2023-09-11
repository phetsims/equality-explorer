# Equality Explorer - model description

This is a high-level description of the model used in Equality Explorer. It's intended for audiences that are not
necessarily technical.

Equality Explorer allows the student to build equations and inequalities (herein referred to as _equations_) by placing
_terms_ on a _balance scale_. The scale has a finite number of _cells_ in which to place terms. The 2 sides of the scale
correspond to the 2 sides of an equation, which is shown above the scale.

Equations are built using _constant terms_ (e.g. `1`, `-1`, `5`, `2/3`) and _variable terms_ (e.g. `5x`, `-2x`). If a
variable term's coefficient is `1` or `-1`, then `x` or `-x` is shown respectively.

Throughout the simulation, fractional constants and coefficients are _always_ reduced. E.g. `4/6` becomes `2/3`; `-10/2`
becomes `-5`.

When building equations, there are two strategies for handling like terms:

(1) **Separate Like Terms**: Like terms occupy separate cells on the scale, and are combined only if they sum to zero.
This strategy is used in the _Basics_, _Numbers_ and _Variables_ screens.

(2) **Combine Like Terms**: Like terms are combined in one cell on the scale. This strategy is used in the _Operations_
and _Solve It!_ screens.

All screens provide the ability to save and restore _snapshots_. Each snapshot contains the contents of the scale (
including the positions of all terms on the scale) and the values of any variables.

The _Basics_ screen introduces equations using terms that correspond to real-world objects (shapes, fruits, coins and
animals) whose values are hidden.

The _Numbers_ screen introduces the _lock_ feature, activated using the padlock button at the bottom center of the
screen. When locked, making a change to one side of the equation results in an equivalent change to the opposite side of
the equation. For example, if the student drags a constant term `1` to the left plate, a `1` will also be dragged to the
right plate. If the student drags a `1` off the left plate, and the right plate is empty, `1` and `-1` will be created
on the right side; the `1` will be dragged and the `-1` will remain on the plate.

The _Variables_ screen introduces the variable `x`, and the ability to change its value.

The _Operations_ screen introduces the ability to apply _universal operations_ to both sides of the scale. A universal
operation consists of an _operator_ and an _operand_. The operators are addition, subtraction, multiplication and
division. The operands are constant and variable terms. Constant terms have a range of `-10` to `10`. Variable terms
involve the variable `x`, with a coefficient range of `-10` to `10`. Multiplication and division are supported for
constant terms only. Division by zero is not allowed.

The _Solve It!_ screen is a game that tests the student's ability to solve equations involving one variable. The game is
organized into 5 _levels_ that are progressively more difficult:

- Level 1: One-step equations with positive coefficents (`ax = c`, `x + b = c`, or `x/d = c`)
- Level 2: One-step equations with negative coefficients (`ax = c` or `x/d = c`)
- Level 3: Two-step equations (`ax + b = c`)
- Level 4: Multi-step equations with fractions (`(a/d)x + b = c` or `(a/d)x + (b/d) = c`)
- Level 5: Multi-step equations with variables on both sides (`ax + b = mx + n`)

Each level provides an open-ended number of _challenges_, generated randomly. Each challenge provides an equation (no
inequalities), and the goal is solve for `x` by reducing the equation to either `x = N` or `N = x`. For each challenge
solved, the student is awarded one star and a smiley face appears. When 10 challenges have been solved, an additional
reward appears.
