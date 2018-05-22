# Equality Explorer - Lock feature scenarios

The lock feature is deceptively complicated, involving many scenarios.  This document describes the most basic set of scenarios.  It's highly recommended to use this set of scenarios as a baseline for regression testing.  Issue [phetsims/equality-explorer#19](https://github.com/phetsims/equality-explorer/issues/19) contains the original discussion and (incomplete) specification of the lock feature.

Relevant terminology from [implementation-notes.md](https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md#terminology):

- dragged term - a term that you're dragging
- equivalent term - a term on the opposite side that is identical to the dragged term
- inverse term - a term on the opposite side that is the inverse of the dragged term
- plate - the balance scale has 2 of these, one for each side of the equation
- opposite plate - the plate associated with the equivalent term, opposite the dragged term
- toolbox - panel that appears below a plate, terms can be dragged to/from

In all scenarios:

- equivalent term should follow dragged term during dragging and animation
- dragged term and equivalent term should be put on plates simultaneously

## Separate Like Terms

The first 10 scenarios involved screens where like terms are placed in separate cells on the scale.  Those screens are _Numbers_ and _Variables_.

### Scenario 1

1. Drag a term from a toolbox.
2. Verify that the equivalent term comes out of the opposite toolbox.
3. Release the term below the plates.
4. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 2

1. Start with one of the plates full.
1. On the side of the scale with a full plate, drag a term from a toolbox.
2. Verify that the equivalent term comes out of the opposite toolbox.
3. Release the dragged term anywhere above the full plate.
4. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 3

1. Start with one of the plates full.
1. On the _opposite_ side of the scale as the full plate, drag a term from a toolbox.
2. Verify that the equivalent term comes out of the opposite toolbox.
3. Release the dragged term anywhere above the full plate.
4. Verify that the dragged term and equivalent term return to their respective toolboxes.

## Scenario 4

1. Drag a term from a toolbox.
2. Verify that the equivalent term comes out of the opposite toolbox.
3. Release the dragged term above the plate, and above any other terms on the plate.
4. The dragged term animates to an empty cell on the plate.
5. Verify that the equivalent term follows the dragged term during animation, then jumps to an empty cell on the opposite plate.

### Scenario 5

1. Drag a term from a toolbox.
2. Verify that the equivalent term comes out of the opposite toolbox.
3. Position the dragged term so that it overlaps a like term that will sum to zero.
4. Release the dragged term.
5. Verify that the dragged term and the term that it overlaps sum to zero. 
6. Verify that the equivalent term moves immediately to an empty cell on the opposite plate.


