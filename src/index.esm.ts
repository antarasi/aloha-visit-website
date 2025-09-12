import { Plugin, PluginContext } from 'aloha-sdk'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'

export default class BrowserPlugin extends Plugin {
  private turndownService: TurndownService

  constructor(context: PluginContext) {
    super(context)
    this.turndownService = new TurndownService()
      .remove('script')
      .remove('style')
      .remove('link')
      .remove('meta')
      .remove('object')
      .remove('embed')
      .remove('nav')
      .remove('footer')
      .remove('title')
      .remove('img')
  }

  async toolCall(toolName: string, args: { url: string }): Promise<string> {
    if (toolName === "visitWebsite") {
        return this.visitWebsite(args.url)
    }

    throw new Error(`This tool is not available`)
  }

  async visitWebsite(url: string): Promise<string> {
    const body = await this.getContext().renderUrl(url)
    const $ = cheerio.load(body)
    const mdResponse = this.turndownService.turndown($.root().html() || 'No content found :(')
    return `Here's the content fetched from [${url}](${url}): \n\n${mdResponse.trim()}`
  }
}