{ name = (./extension.dhall).name
, dependencies =
  [ "aff"
  , "arrays"
  , "effect"
  , "gjs"
  , "gnome-shell"
  , "integers"
  , "maybe"
  , "prelude"
  , "psci-support"
  , "stringutils"
  ]
, packages =
    https://github.com/purescript/package-sets/releases/download/psc-0.14.1-20210516/packages.dhall sha256:f5e978371d4cdc4b916add9011021509c8d869f4c3f6d0d2694c0e03a85046c8
  with gjs = ../../purescript-gjs/purescript-gjs/spago.dhall as Location
  with gnome-shell =
      ../../purescript-gjs/purescript-gnome-shell/spago.dhall as Location
, sources = [ "src/**/*.purs" ]
}
