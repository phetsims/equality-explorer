# Equality Explorer - model description

This is a high-level description of the model used in Equality Explorer. It's intended for audiences
that are not necessarily technical.

Equality Explorer allows the student to build equations and inequalities (herein referred to as _equations_) by placing _terms_ on a _balance scale_. The scale has a finite number of _cells_ in which to place terms. The 2 sides of the scale correspond to the 2 sides of an equation, which is shown above the scale.  

There are 2 modes of operation when building equations:

(1) Like terms occupy separate cells on the scale, and can be combined only if they sum to zero. This is the mode of operation in the _Basics_, _Numbers_ and _Variables_ screens.

(2) Like terms are combined in one cell on the scale.  This is the mode of operation in the _Operations_ and _Solve It!_ screens.

The _Basics_ screen introduces equations using real-world objects (shapes, fruits, coins and animals) whose weights are hidden.

The _Numbers_ screen introduces the _lock_ feature, activated using the padlock button at the bottom center of the screen. When locked, making a change to one side of the equation results in an equivalent change to the opposite side of the equation. For example, if the student drags a constant term '1' to the left plate, a '1' will also be dragged to the right plate.  If the student drags a '1' off the left plate, and the right plate is empty, '1' and '-1' will be created on the right side; the '1' will be dragged and the -1 will remain on the plate.  

The _Variables_ screen introduces the variable `x`, and the abiltiy to change its value.

The _Operations_ screen introduces the ability to apply _operations_ to both sides of the scale. An operation consists of an _operator_ and an _operand_. The operators are addition, subtraction, multiplication and division.  The operands are constant and variable terms.  Constant terms have a range of -10 to 10.  Variable terms involve the variable `x`, with a coefficient range of -10 to 10.  Multiplication and division are supported for constant terms only. Division by zero is not allowed.

The _Solve It!_ screen is a game that tests the student's ability to solve equations involving one variable. The game is organized into 4 _levels_:

- Level 1: One-step equations
- Level 2: Two-step equations
- Level 3: Multi-step equations with fractions
- Level 4: Multi-step equations with variables on both sides

Each level provides an infinite number of _challenges_, generates at random. Each challenge provides an equation, and the goal is solve for `x` by reducing the equation to either `x = N` or `N = x`.  When goal is reached, a smiley face is displayed.  When 10 challenges have been solved, an additional reward appears.
