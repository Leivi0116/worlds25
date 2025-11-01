import { google } from "googleapis"

const sheets = google.sheets("v4")

const GOOGLE_SHEETS_ID = "1R2rutvEAb0tZi4y8bW9HGcxL9VTUq0oEr-piTGVn9tM" // make sure to replace with the real Sheet ID

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

export async function getTicketAvailability(spreadsheetId: string = GOOGLE_SHEETS_ID) {
  try {
    const authClient = await auth.getClient()
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range: "Tickets!A2:E",
    })

    const rows = response.data.values || []
    return rows.map((row: any[]) => ({
      ticketTier: row[0] || "",
      available: Number.parseInt(row[1]) || 0,
      sold: Number.parseInt(row[2]) || 0,
      limit: Number.parseInt(row[3]) || 0,
      type: row[0] || "",
      price: Number.parseInt(row[4]) || 0,
    }))
  } catch (error) {
    console.error("[v0] Error fetching ticket availability:", error)
    throw error
  }
}

export async function addSubmissionToSheet(
  spreadsheetId: string = GOOGLE_SHEETS_ID,
  data: {
    name: string
    email: string
    contact: string
    ticketType: string
    quantity: number
    totalAmount: number
    paymentCode: string
    timestamp: string
    fileUrl?: string
    imageData?: string
    selectedSeats?: string | string[] // can be string or array
    fileName?: string
  },
) {
  try {
    const authClient = await auth.getClient()

    const fileContent = data.imageData || data.fileUrl || ""

    // ✅ FIX: Convert array to comma-separated string
    const seatsContent = Array.isArray(data.selectedSeats)
      ? data.selectedSeats.join(", ")
      : data.selectedSeats || ""

    const values = [
      [
        data.timestamp,
        data.name,
        data.email,
        data.contact,
        data.ticketType,
        data.quantity,
        data.totalAmount,
        data.paymentCode,
        seatsContent, // fixed
        fileContent,
      ],
    ]

    await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId,
      range: "Submissions!A:J", // make sure the sheet name exists
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })
  } catch (error) {
    console.error("[v0] Error adding submission:", error)
    throw error
  }
}

export async function updateTicketSoldCount(
  spreadsheetId: string = GOOGLE_SHEETS_ID,
  ticketType: string,
  quantity: number,
) {
  try {
    const authClient = await auth.getClient()

    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range: "Tickets!A2:E",
    })

    const rows = response.data.values || []
    let rowIndex = -1

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === ticketType) {
        rowIndex = i + 2
        break
      }
    }

    if (rowIndex === -1) {
      throw new Error(`Ticket type "${ticketType}" not found`)
    }

    const currentSold = Number.parseInt(rows[rowIndex - 2][2]) || 0
    const newSold = currentSold + quantity
    const newAvailable = Number.parseInt(rows[rowIndex - 2][1]) - quantity

    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: `Tickets!B${rowIndex}:C${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[newAvailable, newSold]],
      },
    })
  } catch (error) {
    console.error("[v0] Error updating ticket sold count:", error)
    throw error
  }
}
