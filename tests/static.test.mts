import test from "node:test";
import assert from "node:assert/strict";
import BrowserPlugin from "../dist/index.esm.js"; // testing against dist to make sure it has all dependencies bundled
import { PluginContext } from 'aloha-sdk'
import fs from 'node:fs'

class PluginContextMock extends PluginContext {
  async renderUrl(_url: string): Promise<string> {
    return fs.readFileSync(new URL('./assets/search-results.html', import.meta.url), 'utf8')
  }
}

test("visit-website", async () => {
  const search = new BrowserPlugin(new PluginContextMock());

  const expectedResponse = fs.readFileSync(new URL('./assets/expected-response.md', import.meta.url), 'utf8')
  const actualResponse = await search.toolCall("visitWebsite", { url: "https://www.sampleurl.com" })

  assert.equal(actualResponse, expectedResponse);
});

