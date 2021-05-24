module Test.Main where

import Prelude
import Effect (Effect)
import Test.Unit (suite, test)
import Test.Unit.Main (runTest)
import Test.Unit.Assert as Assert
import CgroupMetric

main :: Effect Unit
main =
  runTest do
    suite "Pretty" do
      test "Cpu times" do
        Assert.equal "1.000 usec" (prettyCpuTime 1.0)
        Assert.equal "1.420 msec" (prettyCpuTime 1420.0)
        Assert.equal "1.000 sec" (prettyCpuTime 1000000.0)
        Assert.equal "1.000 min" (prettyCpuTime 60000000.0)
        Assert.equal "1.000 hour" (prettyCpuTime 3600000000.0)
      test "Mem size" do
        Assert.equal "1.000 KB" (prettyMem 1024.0)
        Assert.equal "10.000 MB" (prettyMem (10.0 * 1024.0 * 1024.0))
        Assert.equal "10.500 GB" (prettyMem (10.5 * 1024.0 * 1024.0 * 1024.0))
