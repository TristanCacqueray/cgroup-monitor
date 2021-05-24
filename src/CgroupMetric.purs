module CgroupMetric where

import Prelude

import Data.Array (foldM)
import Data.Either (Either(..), fromLeft)
import Data.Number.Format (fixed, toString, toStringWith)

prettyTasks :: Number -> String
prettyTasks tasks = toString tasks <> " tasks"

prettyCpuTime :: Number -> String
prettyCpuTime cpu = fromLeft "N/A" $ foldM go { value: cpu, unit: "usec" } units
  where
  units =
    [ { name: "msec", sz: 1000.0 }
    , { name: "sec", sz: 1000.0 }
    , { name: "min", sz: 60.0 }
    , { name: "hour", sz: 60.0 }
    , { name: "max", sz: 0.0 }
    ]

  go :: { value :: Number, unit :: String } -> { name :: String, sz :: Number } -> Either String { value :: Number, unit :: String }
  go acc nextUnit
    | nextUnit.sz == 0.0 || acc.value < nextUnit.sz = Left $ toStringWith (fixed 3) acc.value <> " " <> acc.unit
    | otherwise = Right $ { value: acc.value / nextUnit.sz, unit: nextUnit.name }

prettyMem :: Number -> String
prettyMem mem = fromLeft "N/A" $ foldM go { value: mem / 1024.0, unit: "KB" } units
  where
  units =
    [ { name: "MB", sz: 1024.0 }
    , { name: "GB", sz: 1024.0 }
    , { name: "max", sz: 0.0 }
    ]

  go :: { value :: Number, unit :: String } -> { name :: String, sz :: Number } -> Either String { value :: Number, unit :: String }
  go acc nextUnit
    | nextUnit.sz == 0.0 || acc.value < nextUnit.sz = Left $ toStringWith (fixed 3) acc.value <> " " <> acc.unit
    | otherwise = Right $ { value: acc.value / nextUnit.sz, unit: nextUnit.name }
