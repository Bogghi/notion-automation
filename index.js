import { Client } from "@notionhq/client"
import * as dotenv from 'dotenv'
dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

async function addItem(text) {

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Status",
        select: {
          equals: "Schedulati"
        }
      }
    })
    console.log(response.results[0].properties)
  } catch (error) {
    console.error(error.body)
  }
}

addItem("Yurts in Big Sur, California")