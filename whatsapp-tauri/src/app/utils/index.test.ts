import assert from "node:assert/strict";
import test from "node:test";
import { formatMentions, getMentionNames } from "./index.ts";

test("formats phone and LID mentions using participant names", () => {
  const names = getMentionNames([{
    id: "15551234567@s.whatsapp.net",
    name: "Avi",
    phoneJid: "15551234567@s.whatsapp.net",
    lidJid: "20538651095165@lid",
  }]);

  assert.equal(formatMentions("@20538651095165 where are y'all", names), "@Avi where are y'all");
  assert.equal(formatMentions("keep @999 unchanged", names), "keep @999 unchanged");
});
