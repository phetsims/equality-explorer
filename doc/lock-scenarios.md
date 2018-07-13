# Equality Explorer - Lock feature scenarios

The lock feature is deceptively complicated, involving many scenarios.  This document describes the most basic set of scenarios.  It's highly recommended to use this set of scenarios as a baseline for regression testing.  For extra credit, make up your own variations and use multitouch.  

Issue [phetsims/equality-explorer#19](https://github.com/phetsims/equality-explorer/issues/19) contains the original discussion and (incomplete) specification of the lock feature.

Relevant terminology from [implementation-notes.md](https://github.com/phetsims/equality-explorer/blob/master/doc/implementation-notes.md#terminology):

* dragged term - the term that you're dragging
* equivalent term - the term on the opposite side of the scale that is identical to the dragged term
* inverse term - a term created on the opposite side of the scale that is the inverse of the dragged term, and is paired with the equivalent term
* plate - the balance scale has 2 of these, one for each side of the equation
* opposite plate - the plate associated with the equivalent term, opposite the dragged term
* toolbox - panel that appears below a plate, terms can be dragged to/from

In all scenarios:

* start with an empty scale, unless otherwise indicated
* equivalent term should follow dragged term during dragging and animation
* dragged term and equivalent term should be put on plates simultaneously
* equivalent term should not be draggable, or interact with other terms
* inverse term should be draggable, and doing so will break the association to the equivalent term

## Separate Like Terms

The first 15 scenarios involve screens where like terms are placed in separate cells on the scale.  Those screens are _Numbers_ and _Variables_, and you may use either of those screens to test theses scenarios. Scenarios 1-5 involve dragging a term from a toolbox. Scenarios 6-15 involve dragging a term from a plate.

### Scenario 1

1. Turn the lock on.
2. Drag an term from the left toolbox.
3. Verify that an equivalent term comes out of the right toolbox and follows the dragged term.
4. Release the dragged term below the plates.
5. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 2

1. Fill one of the plates with terms.
2. Turn the lock on.
3. On the side of the scale with a full plate, drag a term from a toolbox.
4. Verify that an equivalent term comes out of the opposite toolbox and follows the dragged term.
5. Release the dragged term anywhere above its plate.
6. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 3

1. Fill one of the plates with terms.
2. Turn the lock on.
3. On the _opposite_ side of the scale as the full plate, drag a term from a toolbox.
4. Verify that an equivalent term comes out of the opposite toolbox and follows the dragged term.
5. Release the dragged term anywhere above the plate.
6. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 4

1. Turn the lock on.
2. Drag a term from a toolbox.
3. Verify that an equivalent term comes out of the opposite toolbox and follows the dragged term.
4. Release the dragged term above the plate, and above any other terms on the plate.
5. The dragged term animates to an empty cell on the plate.
6. Verify that the equivalent term follows the dragged term during animation, then jumps to an empty cell on the opposite plate.

### Scenario 5

1. Turn the lock on.
2. Drag a term from a toolbox.
3. Verify that an equivalent term comes out of the opposite toolbox and follows the dragged term.
4. Position the dragged term so that it overlaps a like term that will sum to zero.
5. Release the dragged term. The dragged term and the term that it overlaps sum to zero. 
6. Verify that the equivalent term moves immediately to an empty cell on the opposite plate.

### Scenario 6

1. Put one of each term on both plates.
2. Term the lock on.
3. Drag one a term off one of the plates.
4. Verify that the equivalent term comes off the opposite plate and follows the dragged term.
5. Release the dragged term below the plate.
6. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 7

1. Run with `?speed=0.1` to slow animation.
2. Put one of each term on both plates, and fill the left plate.
3. Turn the lock on.
4. Identify a term that appears on both plates, and drag one of those terms from the left plate.
5. Verify that the equivalent term comes off the right plate and follows the dragged term.
6. Release the dragged term above the left plate, and above all other terms.
7. Before the dragged term reaches the left plate, fill the empty cell on the left plate.
8. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 8

1. Run with `?speed=0.1` to slow animation.
2. Put one of each term on both plates, and fill the _right_ plate.
3. Turn the lock on.
4. Identify a term that appears on both plates, and drag one of those terms from the left plate.
5. Verify that the equivalent term comes off the right plate and follows the dragged term.
6. Release the dragged term above the left plate, and above all other terms.
7. Before the dragged term reaches the left plate, fill the empty cell on the _right_ plate.
6. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 9

1. Put one of each term on both plates.
2. Turn the lock on.
3. Drag a term off one of the plates.
4. Verify that the equivalent term comes off the opposite plate and follows the dragged term.
5. Release the dragged term above the plate, and above all other terms.
6. Verify that the dragged term and equivalent term return to their respective plates.

### Scenario 10

1. Put one of each term on both plates.
2. Turn the lock on.
3. Drag a term off one of the plates. 
4. Verify that an equivalent term comes off the opposite plate and follows the dragged term.
5. Position the dragged term so that it overlaps a like term that will sum to zero.
6. Release the dragged term. Tdragged term and the term that it overlaps sum to zero. 
7. Verify that the equivalent term moves immediately to an empty cell on the opposite plate.

### Scenario 11

1. Put a '1' on a plate.
2. Fill the opposite plate with '-1'.
3. Turn the lock on.
4. Attempt to drag '1' off plate.
5. Verify that the drag is cancelled, and a dialog is displayed indicating "Left side of the balance is full" or "Right side of the balance is full", depending on which plate is full.

### Scenario 12

1. Put '1' on the left plate, nothing on the right plate.
2. Turn the lock on.
3. Drag '1' off the left plate. 
4. Verify that the equivalent term '1' is created on the right side, and the inverse term '-1' is created on the plate.
5. Release the dragged term below the plate.
6. Verify that the dragged term (1) and equivalent term (1) return to their respective toolboxes, and the inverse term (-1) remains on the right plate.

### Scenario 13

1. Fill the left plate with '1', nothing on the right plate.
2. Turn the lock on.
3. Drag a '1' off the left plate. 
4. Verify that the equivalent term '1' is created on the right side, and the inverse term '-1' is created on the plate.
5. Before releasing the dragged term, add a term to the left plate to fill it. 
6. Release the dragged term above the plate. 
7. Verify that the dragged term and equivalent term return to their respective toolboxes, and the inverse term remains on the right plate.

### Scenario 14

1. Put '1' on the left plate, nothing on the right plate.
2. Turn the lock on.
3. Drag '1' off the left plate. 
4. Verify that the equivalent term '1' is created on the right side, and the inverse term '-1' is created on the plate.
5. Release the dragged term above the plate.
6. Verify that the dragged term (1) and equivalent term (1) return to their respective plates, and the inverse term (-1) is replaced by the equivalent term.

### Scenario 15

1. Run with `?speed=0.1` to slow animation.
2. Put '1' on the left plate, nothing on the right plate.
3. Turn the lock on.
4. Drag '1' off the left plate. 
5. Verify that the equivalent term '1' is created on the right side, and the inverse term '-1' is created on the plate.
6. Release the dragged term above the plate.
7. Before the dragged term reaches its plate, grab the inverse term.
6. Verify that the dragged term (1) and equivalent term (1) return to their respective plates, and the inverse term (-1) is _not_ replaced by the equivalent term. 

## Combine Like Terms

The next 8 scenarios involve screens where like terms are combined in one cell on the scale.  Those screens are _Operations_ and _Solve It!_, and you may use either of those screens to test these scenarios.

### Scenario 16

1. Turn the lock on.
2. Drag an term from the left toolbox.
3. Verify that an equivalent term comes out of the right toolbox and follows the dragged term.
4. Release the dragged term below the plates.
5. Verify that the dragged term and equivalent term return to their respective toolboxes.

### Scenario 17

1. Put `x + 1` on both the left and right plates.
2. Turn the lock on.
3. On the side of the scale with a full plate, drag a term from a toolbox.
4. Verify that an equivalent term comes out of the opposite toolbox and follows the dragged term.
5. Release the dragged term anywhere above its plate.
6. Verify that the dragged term and equivalent term are added to the like terms on their respective plates.

### Scenario 18

1. Put `x + 1` on both the left and right plates.
2. Turn the lock on.
2. Drag a '-1' from a toolbox.
3. Verify that an equivalent term '-1' comes out of the opposite toolbox and follows the dragged term.
4. Position the dragged term so that it overlaps the like term '1' that will sum to zero.
5. Release the dragged term. The dragged term sums to zero. 
6. Verify that the equivalent term moves immediately to the opposite plate and sums to zero.

### Scenario 19

1. Put `x + 1` on the left and `x - 1` on the right plate.
2. Turn the lock on.
2. Drag a '-1' from a toolbox.
3. Verify that an equivalent term '-1' comes out of the opposite toolbox and follows the dragged term.
4. Position the dragged term so that it overlaps the like term '1' on the scale.
5. Release the dragged term. The dragged term and the like term that it overlaps sum to zero. 
6. Verify that the equivalent term moves immediately to the opposite plate and adds to produce `x - 2`.

### Scenario 20

1. Put `x + 1` on the left and `x - 1` on the right plate.
2. Turn the lock on.
2. Drag a '1' from a toolbox.
3. Verify that an equivalent term '1' comes out of the opposite toolbox and follows the dragged term.
4. Position the dragged term so that it overlaps the like term '1' on the scale.
5. Release the dragged term. The dragged term adds to produce `x + 2`. 
6. Verify that the equivalent term moves immediately to the opposite plate and sums to zero.

### Scenario 20

1. Put '1' on the left plate, nothing on the right plate.
2. Turn the lock on.
3. Drag '1' off the left plate. 
4. Verify that the equivalent term '1' is created on the right side, and the inverse term '-1' is created on the plate.
5. Release the dragged term below the plate.
6. Verify that the dragged term and equivalent term return to their respective toolboxes, and the inverse term remains on the right plate.

### Scenario 21

1. Put '1' on the left plate, nothing on the right plate.
2. Turn the lock on.
3. Drag '1' off the left plate. 
4. Verify that the equivalent term '1' is created on the right side, and the inverse term '-1' is created on the plate.
5. Release the dragged term above the plate.
6. Verify that the dragged term and equivalent term return to their respective plates, and that the equivalent term is added to the the inverse term on the right plate.

### Scenario 22

1. Run with `?speed=0.1` to slow animation.
2. Put '1' on the left plate, nothing on the right plate.
3. Turn the lock on.
4. Drag '1' off the left plate. 
5. Verify that the equivalent term '1' is created on the right side, and the inverse term '-1' is created on the plate.
6. Release the dragged term above the plate.
7. Before the dragged term reaches its plate, drag the inverse term off the right plate.
6. Verify that the dragged term and equivalent term return to their respective plates, and the inverse term is _not_ replaced by the equivalent term. 
