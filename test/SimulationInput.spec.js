import SimulationInput from "../src/SimulationInput.js"
import { it } from "mocha"
import assert from "node:assert/strict"

it("create obj with wrong parameters", async () => {
  assert.throws(() => {
    new SimulationInput("0.al9", "u", "")
  }, /^Error: SimulationInput wrong values. Parameters can only be Number type$/)
})
