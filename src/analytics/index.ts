import path from "path";
import { existsSync } from "fs";
import { Auth, google } from "googleapis";
import logger from "../logger";

export class Analytics {
  private readonly spreadsheetId = process.env.SPREADSHEET_ID;
  private readonly sheetName = process.env.SHEET_NAME || "Sheet1";
  private readonly keyFile = path.join(__dirname, "../..", "google.json");
  private readonly scopes = ["https://www.googleapis.com/auth/spreadsheets"];
  private readonly hasInvalidConfig: boolean = false;

  constructor() {
    this.hasInvalidConfig = !this.spreadsheetId || !existsSync(this.keyFile);
  }

  private async authorize()  {
    const auth = new google.auth.GoogleAuth({
      keyFile: this.keyFile,
      scopes: this.scopes,
    });
    return auth.getClient();
  }

  private async appendRow(auth: Auth.OAuth2Client, row: string[]) {
    const sheets = google.sheets({ version: "v4", auth });
    const range = `${this.sheetName}!A1`; // Диапазон, куда вставить данные
    await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });
  }

  public async trackTgLang(lang: string) {
    if (this.hasInvalidConfig) {
      return;
    }
    try {
      const authClient = await this.authorize();
      const date = new Date().toISOString().split("T")[0];
      const row = [date, lang];
      await this.appendRow(authClient as Auth.OAuth2Client, row);
    } catch (error) {
      const { message } = error as { message: string };
      logger.error(`Error on user tracking: ${message}`);
    }
  }
}



