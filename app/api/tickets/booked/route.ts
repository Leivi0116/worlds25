import { google } from "googleapis"
import { NextResponse } from "next/server"

const sheets = google.sheets("v4")

const GOOGLE_SHEETS_ID = "1R2rutvEAb0tZi4y8bW9HGcxL9VTUq0oEr-piTGVn9tM"

const GOOGLE_CREDENTIALS = {
  type: "service_account",
  project_id: "worlds-476414",
  private_key_id: "a87290b3adc41c7d1d508b7fb356d4ff3748a82a",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEaKR0b/M0L1KP\nfa9U2W+9R3EDwN640Myp9Xo7WbkDWH5RrfIZuogVavFsnX7Xp31kmarRodL/Y+Np\nacvEWB8ZVRQx468AWCBmLAm/tW2I4Opi6qq8HQRojraFyNqRRCMSrl5AZ0GGq+Fu\nJmEzM9m88PhpNtTsjVTNGWFlnawhZU3nv/DWhymxQyqt8PO21/+OwQJ6V0CBXIkR\nWLd8HevkUCO0E/V0IdgTMYg0GlXBPYUAWAbMkAoKsIEVEbpskaGfRaJsuzF4ZQox\ngD8rfjjw1Ops7FnWEtfiJjY5zMt8wl9uBHmrPQUGaKD5nj6TUuCnuwR4oYgJtXOC\nuER40DrdAgMBAAECggEAJgGQxzZNk8zPd1RNHAhqWrBrIlyNTKqc3AuUME1ro4XZ\nhcE47rkdcbWMy6WLYLw4o8GnoCKmE4T3AdQ22cLqm6qOupuyJskm1daSOV5oeHr7\naBI8YSPlUT1CfQ9xmfgbKFeFBgXlFGQIvpmfJ/sR2IGxtBxn5fFwVjLh2bnB0AE0\nujyvmL32iH+2C3Mx2fwvgAJK38djKk6WaAMV8E3AUNyza30qWQkX4nHLrawnN/9B\nAck7dP9m7Iko2z8lPJfZd5V8J+KUe2S+ogmOV7qrMnGsrwP1kSdRKT8nCgnGbPd3\nNqU5zKvs17ChHFTEHAw8zIx6xWkeOLFVoS5/4j+r2QKBgQD9mARG/3TYFsywO4qb\nd3/uRnlaPckZAPCgrGE8cqIfZfG9SEQbn6Rf2fSH1fF30vfzM+PQSgLV8xnf9F7Y\nP4MZIFlOqDBOXxXCxSRilcr/dKnF9rgm8tmXUTZaPaMX4fWDbSfnLUH9dSx6D6xn\njlvIsckbHoDEdKydo5ceFu0mCQKBgQDGRbjpTYebVyA3LBH9SJLTXIVjyvXskDJ7\npx+AVpZL0+S9ko2Y2xO/4oYJ6V/FdOaq72B16TzwREy+dekzXHpnTOrJx9QCor/2\n6KiK3oCfoaW3ng3fgUlDitl05huctVUf6JGCiB6ojqqzyTrcVlXBlP5lPR9K8kzN\nSCwda2tDNQKBgQCgLUvOWH7CGqyRSBqFllZs94ChGlOSAoD6y8bjOnjioi6t4x55\n4D0f+fg1cFID4HKS4ByuLIFcCCA40A60QnGZBlDCmQNiDTcefg08Y+cDsfmmO+8X\nUt9Tb42INFR2uler+t9waqq64C8Gri20fzvEKV+gTIUDEbsSGwlRjSOfmQKBgHog\nmDWcu9rDX+ScELii602lv8QoUDLW30GrP4wdyZYLfuoGS5HL3+5h6Y5RYdyOlUbV\nC+WVNSQJ7fujRXGNlRfsGPMRU1YMSZIc3TQsua2aNClWAdWaHTatYCTRWFC+oSB2\ncKqmjbvlpN/5I3h09X23+LsDWzMe7I/F1OaKNBfBAoGBALvvjvejFT0n8JR5gKhL\nGNwmpEHUHFFzuSqVN4LlD5YldW3/fdGCTq8T0D2v5/M7REZ3IXOCEud8Gfx7FBYs\nWx9nMhNrZb8uJlwF5+x0L7fxSab1//0peQhp9ihDzMp1BHBG0cR8lSu2apKtvpqY\n6JuUJGvLOIv0/K0muXLvICSP\n-----END PRIVATE KEY-----\n",
  client_email: "wolrdsdatabase@worlds-476414.iam.gserviceaccount.com",
  client_id: "104286728489640524203",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/wolrdsdatabase%40worlds-476414.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

export async function GET() {
  try {
    const authClient = await auth.getClient()
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: "Submissions!A2:I",
    })

    const rows = response.data.values || []
    const bookedSeats = new Set<string>()

    rows.forEach((row: any[]) => {
      if (row[8]) {
        // Column I (index 8) contains selected seats
        const seatsString = row[8]
        // Parse comma-separated seat IDs and add to set
        const seats = seatsString.split(",").map((s: string) => s.trim())
        seats.forEach((seat: string) => {
          if (seat) bookedSeats.add(seat)
        })
      }
    })

    return NextResponse.json({ bookedSeats: Array.from(bookedSeats) })
  } catch (error) {
    console.error("[v0] Error fetching booked seats:", error)
    return NextResponse.json({ error: "Failed to fetch booked seats", bookedSeats: [] }, { status: 500 })
  }
}
