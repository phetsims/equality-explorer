# Equality Explorer - implementation notes

This document contains miscellaneous notes related to the implementation of Equality Explorer. 
It supplements the internal (source code) documentation, and (hopefully) provides insight into
"big picture" implementation issues.  The audience for this document is software developers who
are familiar with JavaScript and PhET simulation development (as described in 
[PhET Development Overview](http://bit.ly/phet-html5-development-overview)).

## Terminology

This section enumerates terms that you'll see used throughout the internal and external documentation.
In alphabetical order:

* inequality - a mathematical relation in which two _expressions_ are joined by a 
relational symbol (!=, >, >=, <, <=) indicating that the 2 expressions are different
* equation - a mathematical relation in which two _expressions_ are joined by an equal sign (=)
* expression - a combination of symbols that is well-formed according to rules that depend on the context


