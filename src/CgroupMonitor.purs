module CgroupMonitor where

import Prelude
import SystemdTop

import Clutter.Actor as Actor
import Clutter.ActorAlign as ActorAlign
import Data.Array (take)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.String.Utils (words)
import Data.Traversable (traverse, traverse_)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class (liftEffect)
import GJS as GJS
import GLib as GLib
import GLib.MainLoop as GLib.MainLoop
import Gio.File as File
import Gnome.Extension (ExtensionSimple)
import Gnome.UI.Main.Panel as Panel
import Gnome.UI.PanelMenu as PanelMenu
import St.BoxLayout as BoxLayout
import St.Label as Label

-- | Return available memory in GB
getAvailableMemory :: Aff (Maybe Int)
getAvailableMemory = do
  meminfo <- words <$> File.readFile "/proc/meminfo"
  pure (toGB <$> getNumber meminfo 7)
  where
  toGB n = n / (1024 * 1024)

worker :: Label.Label -> Effect Boolean
worker label = do
  GJS.log "running..."
  launchAff_ $ do
    avail <- getAvailableMemory
    liftEffect $ case avail of
      Just gb ->   Label.set_text label (show gb <> " GB")
      Nothing -> Label.set_text label "N/A GB"
  pure true

type Env
  = { button :: PanelMenu.Button
    , timer :: GLib.EventSourceId
    }

extension :: ExtensionSimple Env
extension = { enable, disable }
  where
  onClick = do
    GJS.log "clicked!"
    pure true

  enable = do
    -- ui
    button <- PanelMenu.newButton 0.0 "CgroupMonitor" false
    box <- BoxLayout.new
    label <- Label.new "test"
    Actor.add_child box label
    Actor.add_child button box
    Actor.set_y_align label ActorAlign.center
    Panel.addToStatusArea "CgroupMonitor" button
    void $ Actor.onButtonPressEvent button (\_ _ -> onClick)
    -- worker
    void $ worker label
    timer <- GLib.timeoutAdd 5000 (worker label)
    pure { button, timer }

  disable env = do
    Actor.destroy env.button
    GLib.sourceRemove env.timer

main :: Effect Unit
main = case GJS.argv of
  [ "--run" ] -> do
    loop <- GLib.MainLoop.new
    launchAff_ (go loop)
    GLib.MainLoop.run loop
    where
    go loop = do
      availMem <- fromMaybe 0 <$> getAvailableMemory
      cgTop <- parse <$> runCgTop Memory
      liftEffect
        $ do
            GJS.log availMem
            traverse_ (GJS.log <<< prettyCgroupInfo) (take 10 cgTop)
            -- GJS.log $ show (take 3 cgTop)
            GLib.MainLoop.quit loop
  _ -> pure mempty
