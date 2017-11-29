# `@modelica/fmi-data`

FMI standard for "Functional Mockup Interface".  It is a standard developed
by the [Modelica Association](http://modelica.org) to support interoperability
between simulation tools.  More information about FMI can be found on the
[FMI web site](http://fmi-standard.org).

This package defines various types definitions used to describe FMI capabilities
and compabitility between tools.  By creating these common type definitions, we can
then use these definitions across UI code, scripts and servers.  In this way,
they all have a common representation of the underlying data being exchanged.

This package includes code for processing and manipulating FMI related data as well
to support querying and rendering.  The code in this repository **does not** use
any `Node.js` related packages so it can be used both for front-end as well as
back-end applications.

The code and definitions can be installed with the following command:

```
yarn add @modelica/fmi-data
```
