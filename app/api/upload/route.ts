import { google } from "googleapis";
import { type NextRequest, NextResponse } from "next/server";

const GOOGLE_DRIVE_FOLDER_ID = "0AC0QI42JO3zwUk9PVA"; // make sure this folder is shared with your service account!

const GOOGLE_CREDENTIALS = {
  type: "service_account",
  project_id: "worlds-476414",
  private_key_id: "a87290b3adc41c7d1d508b7fb356d4ff3748a82a",
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") ||
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEaKR0b/M0L1KP\nfa9U2W+9R3EDwN640Myp9Xo7WbkDWH5RrfIZuogVavFsnX7Xp31kmarRodL/Y+Np\nacvEWB8ZVRQx468AWCBmLAm/tW2I4Opi6qq8HQRojraFyNqRRCMSrl5AZ0GGq+Fu\nJmEzM9m88PhpNtTsjVTNGWFlnawhZU3nv/DWhymxQyqt8PO21/+OwQJ6V0CBXIkR\nWLd8HevkUCO0E/V0IdgTMYg0GlXBPYUAWAbMkAoKsIEVEbpskaGfRaJsuzF4ZQox\ngD8rfjjw1Ops7FnWEtfiJjY5zMt8wl9uBHmrPQUGaKD5nj6TUuCnuwR4oYgJtXOC\nuER40DrdAgMBAAECggEAJgGQxzZNk8zPd1RNHAhqWrBrIlyNTKqc3AuUME1ro4XZ\nhcE47rkdcbWMy6WLYLw4o8GnoCKmE4T3AdQ22cLqm6qOupuyJskm1daSOV5oeHr7\naBI8YSPlUT1CfQ9xmfgbKFeFBgXlFGQIvpmfJ/sR2IGxtBxn5fFwVjLh2bnB0AE0\nujyvmL32iH+2C3Mx2fwvgAJK38djKk6WaAMV8E3AUNyza30qWQkX4nHLrawnN/9B\nAck7dP9m7Iko2z8lPJfZd5V8J+KUe2S+ogmOV7qrMnGsrwP1kSdRKT8nCgnGbPd3\nNqU5zKvs17ChHFTEHAw8zIx6xWkeOLFVoS5/4j+r2QKBgQD9mARG/3TYFsywO4qb\nd3/uRnlaPckZAPCgrGE8cqIfZfG9SEQbn6Rf2fSH1fF30vfzM+PQSgLV8xnf9F7Y\nP4MZIFlOqDBOXxXCxSRilcr/dKnF9rgm8tmXUTZaPaMX4fWDbSfnLUH9dSx6D6xn\njlvIsckbHoDEdKydo5ceFu0mCQKBgQDGRbjpTYebVyA3LBH9SJLTXIVjyvXskDJ7\npx+AVpZL0+S9ko2Y2xO/4oYJ6V/FdOaq72B16TzwREy+dekzXHpnTOrJx9QCor/2\n6KiK3oCfoaW3ng3fgUlDitl05huctVUf6JGCiB6ojqqzyTrcVlXBlP5lPR9K8kzN\nSCwda2tDNQKBgQCgLUvOWH7CGqyRSBqFllZs94ChGlOSAoD6y8bjOnjioi6t4x55\n4D0f+fg1cFID4HKS4ByuLIFcCCA40A60QnGZBlDCmQNiDTcefg08Y+cDsfmmO+8X\nUt9Tb42INFR2uler+t9waqq64C8Gri20fzvEKV+gTIUDEbsSGwlRjSOfmQKBgHog\nmDWcu9rDX+ScELii602lv8QoUDLW30GrP4wdyZYLfuoGS5HL3+5h6Y5RYdyOlUbV\nC+WVNSQJ7fujRXGNlRfsGPMRU1YMSZIc3TQsua2aNClWAdWaHTatYCTRWFC+oSB2\ncKqmjbvlpN/5I3h09X23+LsDWzMe7I/F1OaKNBfBAoGBALvvjvejFT0n8JR5gKhL\nGNwmpEHUHFFzuSqVN4LlD5YldW3/fdGCTq8T0D2v5/M7REZ3IXOCEud8Gfx7FBYs\nWx9nMhNrZb8uJlwF5+x0L7fxSab1//0peQhp9ihDzMp1BHBG0cR8lSu2apKtvpqY\n6JuUJGvLOIv0/K0muXLvICSP\n-----END PRIVATE KEY-----\n",
  client_email: "wolrdsdatabase@worlds-476414.iam.gserviceaccount.com",
  client_id: "104286728489640524203",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/wolrdsdatabase%40worlds-476414.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload request received");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const paymentCode = formData.get("paymentCode") as string;

    if (!file) {
      console.error("[v0] No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
    }

    const drive = google.drive("v3");
    const authClient = await auth.getClient();

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `payment-proof-${paymentCode}-${Date.now()}.${file.type.split("/")[1]}`;

    console.log("[v0] Uploading to Google Drive:", fileName);

    // ✅ Create the file
    const response = await drive.files.create({
      auth: authClient,
      requestBody: {
        name: fileName,
        parents: [GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: require("stream").Readable.from(buffer),
      },
      supportsAllDrives: true, // important for Shared Drives
      fields: "id, name",
    });

    const fileId = response.data.id;
    if (!fileId) throw new Error("Google Drive upload failed: No file ID returned");

    console.log("[v0] File uploaded:", fileId);

    // ✅ Make file public
    await drive.permissions.create({
      auth: authClient,
      fileId,
      requestBody: { role: "reader", type: "anyone" },
      supportsAllDrives: true,
    });

    const driveLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    console.log("[v0] Google Drive link:", driveLink);

    return NextResponse.json({
      success: true,
      fileUrl: driveLink,
      fileName: file.name,
      message: "Image uploaded to Google Drive successfully",
    });
  } catch (error) {
    console.error("[v0] Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Upload failed", details: errorMessage }, { status: 500 });
  }
}
