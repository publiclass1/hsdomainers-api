import fetch from 'node-fetch'
import { toJson } from "../utils/util";
const API_URL = process.env.DNS_API_SERVER || 'http://localhost.link:3001'
const TOKEN = process.env.DNS_API_TOKEN || 'intersnipe'

export default class DNSServerAPIService {

  static async createRecord(domains: string[]) {
    console.log('domains to create', {
      domains
    })
    try {
      const rs = await fetch(`${API_URL}/domains`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
          'x-token': TOKEN
        },
        body: JSON.stringify({
          domains: domains
        })
      })
      const resData = await rs.json()
      return resData
    } catch (e) {
      console.log(e)
    }
    return false
  }

  static async removeRecordByDomain(domain: string) {
    try {
      const rs = await fetch(`${API_URL}/domains/${domain}`, {
        headers: {
          'x-token': TOKEN
        },
        method: 'DELETE',
      })
      const resData = await rs.json()
    } catch (e) {
      console.log(e)
    }
  }

}