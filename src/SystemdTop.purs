module SystemdTop where

import Prelude
import Control.Alternative (guard)
import Data.Array (last, mapMaybe, (!!))
import Data.Number (fromString)
import Data.Maybe (Maybe)
import Data.String (Pattern(..), split)
import Data.String.Utils (endsWith, lines, words)
import Effect.Aff (Aff)
import Gio.Subprocess as Subprocess
import CgroupMetric

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
    , tasks :: Number
    , cpu :: Number
    , mem :: Number
    }

prettyCgroupInfo :: CgroupInfo -> String
prettyCgroupInfo cg = cg.name <> ": " <> prettyTasks cg.tasks <> " " <> prettyCpuTime cg.cpu <> " " <> prettyMem cg.mem

getNumber :: Array String -> Int -> Maybe Number
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
