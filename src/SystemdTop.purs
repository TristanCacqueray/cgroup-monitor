module SystemdTop where

import Prelude
import Control.Alternative (guard)
import Data.Array (foldM, last, mapMaybe, (!!))
import Data.Either (Either(..), fromLeft)
import Data.Int (fromString, toNumber)
import Data.Maybe (Maybe)
import Data.Number.Format (fixed, toStringWith)
import Data.String (Pattern(..), split)
import Data.String.Utils (endsWith, lines, words)
import Effect.Aff (Aff)
import Gio.Subprocess as Subprocess

data CgOrder
  = Cpu
  | Memory

runCgTop :: CgOrder -> Aff (Array String)
runCgTop order = lines <$> cmd
  where
  cmd = Subprocess.cmd [ "systemd-cgtop", orderArg, "--cpu=time", "-1", "--depth=10", "-P", "--raw" ]

  orderArg = case order of
    Cpu -> "--order=cpu"
    Memory -> "--order=memory"

type CgroupInfo
  = { name :: String
    , tasks :: Int
    , cpu :: Int
    , mem :: Int
    }

prettyCgroupInfo :: CgroupInfo -> String
prettyCgroupInfo cg = cg.name <> ": " <> show cg.tasks <> " " <> prettyCpuTime cg.cpu <> " " <> prettyMem cg.mem

prettyCpuTime :: Int -> String
prettyCpuTime cpu = fromLeft "N/A" $ foldM go { value: toNumber cpu, unit: "usec" } units
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

prettyMem :: Int -> String
prettyMem mem = fromLeft "N/A" $ foldM go { value: toNumber (mem / 1024), unit: "KB" } units
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

getNumber :: Array String -> Int -> Maybe Int
getNumber arr pos = join $ fromString <$> arr !! pos

parse :: Array String -> Array CgroupInfo
parse = mapMaybe (go <<< words)
  where
  go :: Array String -> Maybe CgroupInfo
  go xs = do
    path <- xs !! 0
    tasks <- getNumber xs 1
    cpu <- getNumber xs 2
    mem <- getNumber xs 3
    guard <<< not <<< isGlobalScope $ path
    name <- pretty path
    pure { name, tasks, cpu, mem }

  isGlobalScope :: String -> Boolean
  isGlobalScope path = endsWith ".slice" path || endsWith "/container" path || endsWith "user@1000.service" path

  pretty :: String -> Maybe String
  pretty path = last $ split (Pattern "/") path
