import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidCookTime } from "../validation.js";

test("rejects a negative cook time", () => {
  assert.equal(isValidCookTime(-5), false);
});
