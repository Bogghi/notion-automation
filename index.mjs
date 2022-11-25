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
const SCOPES = ['https://www.googleapis.com/auth/calendar']
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json') 

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

const preparateDataForCalendar = () => getSceduledEvents().then((resolve) => {
    let scheduledEvenets = []

    resolve.results.forEach((event, index) => {
        let startStr = event.properties.Giorno.date.start,
            endStr = event.properties.Giorno.date.end,
            start = {},
            end = {},
            date,
            dateTime,
            timeZone

        if(startStr !== null && endStr !== null)
            timeZone = 'CET'
        else 
            timeZone = null
        
        if(startStr !== null && startStr.length > 10){
            date = startStr.substr(0,9)
            dateTime = startStr.substr(0, startStr.indexOf('+'))
        }else {
            date = startStr
            dateTime = null
        }

        start = {
            date: date,
            dateTime: dateTime,
            timeZone: timeZone
        }

        if(endStr !== null && endStr.length > 10){
            date = endStr.substr(0,9)
            dateTime = endStr.substr(0, endStr.indexOf('+'))
        }else {
            date = endStr
            dateTime = null
        }

        end = {
            date: date,
            dateTime: dateTime,
            timeZone: timeZone
        }

        scheduledEvenets.push({
            summary: event.properties.Nome.title[0].plain_text,
            start: start,
            end: end,
            allProperties: event.properties,
        })
    })

    return scheduledEvenets
})



preparateDataForCalendar().then((resolve) => console.log(resolve))