import { Client } from "@notionhq/client"
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import * as process from 'process'
import { authenticate } from "@google-cloud/local-auth"
import { GoogleApis } from "googleapis"

dotenv.config()

const notion = new Client({auth: process.env.NOTION_KEY})
const databaseId = process.env.NOTION_DATABASE_ID

const getSceduledEvents = async () => {
    let response = {}

    try{
        response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: "Status",
                select: {
                    equals: "Schedulati"
                }
            }
        })
    }catch(error){
        console.error(error.body)
    }
    
    return response;
}

const preperaDataForCalendar = () => getSceduledEvents().then((resolve) => {
    let scheduledEvenets = []

    resolve.results.forEach((event, index) => {
        scheduledEvenets.push({
            eventName: event.properties.Nome.title[0].plain_text,
            allProperties: event.properties
        })
    })

    return scheduledEvenets
})

preperaDataForCalendar().then((resolve) => console.log(resolve))