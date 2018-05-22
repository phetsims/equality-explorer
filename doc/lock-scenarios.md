# Equality Explorer - Lock feature scenarios

The lock feature is deceptively complicated, involving many scenarios.  This document describes the most basic set of scenarios.  It's highly recommended to use this set of scenarios as a baseline for regression testing.  For extra credit, try make up variations and use multitouch.  

Issue [phetsims/equality-explorer#19](https://github.com/phetsims/equality-explorer/issues/19) contains the original discussion and (incomplete) specification of the lock feature.

Relevant terminology from [implementation-notes.md](https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md#terminology):

* dragged term - the term that you're dragging
* equivalent term - the term on the opposite side of the scale that is identical to the dragged term
* inverse term - a term created on the opposite side of the scale that is the inverse of the dragged term, and is paired with the equivalent term
* plate - the balance scale has 2 of these, one for each side of the equation
* opposite plate - the plate associated with the equivalent term, opposite the dragged term
* toolbox - panel that appears below a plate, terms can be dragged to/from

In all scenarios:

* start with lock on, unless otherwise indicated
* equivalent term should follow dragged term during dragging and animation
* dragged term and equivalent term should be put on plates simultaneously
* equivalent term should not be draggable, or interact with other terms
* inverse term should be draggable, and doing so will break the association to the equivalent term

## Separate Like Terms

The first 16 scenarios involve screens where like terms are placed in separate cells on the scale.  Those screens are _Numbers_ and _Variables_.

### Scenario 1

1. Drag a term from a toolbox.
2. Verify that an equivalent term comes out of the opposite toolbox.
3. Release the term below the plates.
4. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 2

1. Start with one of the plates full.
1. On the side of the scale with a full plate, drag a term from a toolbox.
2. Verify that an equivalent term comes out of the opposite toolbox.
3. Release the dragged term anywhere above the plate.
4. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 3

1. Start with one of the plates full.
1. On the _opposite_ side of the scale as the full plate, drag a term from a toolbox.
2. Verify that an equivalent term comes out of the opposite toolbox.
3. Release the dragged term anywhere above the plate.
4. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 4

1. Drag a term from a toolbox.
2. Verify that an equivalent term comes out of the opposite toolbox.
3. Release the dragged term above the plate, and above any other terms on the plate.
4. The dragged term animates to an empty cell on the plate.
5. Verify that the equivalent term follows the dragged term during animation, then jumps to an empty cell on the opposite plate.

### Scenario 5

1. Drag a term from a toolbox.
2. Verify that an equivalent term comes out of the opposite toolbox.
3. Position the dragged term so that it overlaps a like term that will sum to zero.
4. Release the dragged term.
5. Verify that the dragged term and the term that it overlaps sum to zero. 
6. Verify that the equivalent term moves immediately to an empty cell on the opposite plate.

### Scenario 6

1. Identify a term that appears on both plates.
2. Drag one of these terms.
3. Verify that the equivalent term comes off the opposite plate.
4. Release the dragged term below the plate.
5. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 7

1. Run with `?speed=0.1` to slow animation.
2. Fill the left plate. 
3. Identify a term that appears on both plates, and drag one of those terms from the left plate.
4. Verify that the equivalent term comes off the right plate.
5. Release the dragged term above the left plate, and above all other terms.
6. Before the dragged term reaches the left plate, fill the empty cell on the left plate.
6. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 8

1. Run with `?speed=0.1` to slow animation.
2. Fill the _right_ plate. 
3. Identify a term that appears on both plates, and drag one of those terms from the left plate.
4. Verify that the equivalent term comes off the right plate.
5. Release the dragged term above the left plate, and above all other terms.
6. Before the dragged term reaches the left plate, fill the empty cell on the right plate.
6. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 9

1. Identify a term that appears on both plates, drag one of those terms.
2. Verify that the equivalent term comes off the opposite plate.
3. Release the dragged term above the plate, and above all other terms.
4. Verify that the dragged term and equivalent term return to their respective plates.

### Scenario 10

1. Identify a term that appears on both plates, drag one of those terms. 
2. Verify that an equivalent term comes off the opposite plate.
3. Position the dragged term so that it overlaps a like term that will sum to zero.
4. Release the dragged term.
5. Verify that the dragged term and the term that it overlaps sum to zero. 
6. Verify that the equivalent term moves immediately to an empty cell on the opposite plate.

### Scenario 11

1. Start with lock off.
2. Put a '1' on a plate.
3. Fill the opposite plate with '-1'.
4. Turn lock on.
5. Attempt to drag '1' off plate.
6. Verify that the drag is cancelled, and a dialog is displayed indicating "Left side of the balance is full" or "Right side of the balance is full", depending on which plate is full.

### Scenario 12

inverse created, term released below plate, term and equivalent return to toolbox, inverse remains on plate

### Scenario 13

inverse created, term released above plate, term plate full (or becomes full), term and equivalent return to toolbox, inverse remains on plate

### Scenario 14

inverse created, term released above plate, equivalent plate full (or becomes full), term and equivalent return to toolbox, inverse remains on plate

### Scenario 15

inverse created, term released above plate, room on both plates, term goes to plate, equivalent returns to plate and replaces inverse

### Scenario 16

inverse created, inverse dragged, association broken

## Combine Like Terms

The next 15 scenarios involve screens where like terms are combined in one cell on the scale.  Those screens are _Operations_ and _Solve It!_.
