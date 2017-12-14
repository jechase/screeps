import { ErrorMapper } from "utils/ErrorMapper";
import { SpawnManager } from "SpawnManager";
import { CreepManager } from "CreepManager";
import { GC } from "GC";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(function () {
  console.log(`Time: ${Game.time}`);
  GC.run();

  CreepManager.run();

  SpawnManager.run();
});
