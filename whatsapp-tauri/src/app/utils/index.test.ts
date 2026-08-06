import assert from "node:assert/strict";
import test from "node:test";
import { getMentionAliases, getMentionNames, getMentionParts, getSelfMentionIds } from "./index.ts";

test("formats phone and LID mentions using participant names", () => {
  const users = [{
    id: "15551234567@s.whatsapp.net",
    pushName: "Avi",
    phoneJid: "15551234567@s.whatsapp.net",
    lidJid: "20538651095165@lid",
  }];
  const names = getMentionNames(users);

  assert.deepEqual(getMentionParts("@20538651095165 where are y'all", names), [
    { text: "Avi", id: "20538651095165", name: "Avi" },
    { text: " where are y'all" },
  ]);
  assert.deepEqual(getMentionParts("keep @+919876543210 unchanged", names), [
    { text: "keep " },
    { text: "+919876543210", id: "919876543210", name: undefined },
    { text: " unchanged" },
  ]);
  assert.deepEqual(
    getSelfMentionIds(getMentionAliases(users), "15551234567:2@s.whatsapp.net"),
    ["15551234567", "20538651095165"]
  );
});
