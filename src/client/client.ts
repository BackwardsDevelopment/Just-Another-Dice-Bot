import { Client } from "discord.js";
import sqlite3 from "sqlite3";
import { open, Database as DatabaseType } from "sqlite";
import { join } from "node:path";
import { existsSync, writeFileSync } from "node:fs";

const Database = sqlite3.Database;
const db_file = join(__dirname, "..", "..", "settings.db");

export class ExtendedClient extends Client {

  private settingsDB: DatabaseType | undefined;

  constructor(options: any) {
    super(options);

    this.initDB();
  }

  private async initDB() {

    if (!existsSync(db_file)) {
      await this.genDB();
    }

    this.settingsDB = await open({
      filename: db_file,
      driver: Database
    });
  }

  private async genDB() {
    if (!db_file || existsSync(db_file))
      return false;
    writeFileSync(db_file, "");

    const tempDBHandler = await open({
      filename: db_file,
      driver: Database
    });

    await tempDBHandler.exec(`CREATE TABLE RollChannel ( channelId TEXT NOT NULL PRIMARY KEY )`);
    await tempDBHandler.close();
  }

  public async saveChannel(channelId: string) {
    const push = await this.settingsDB?.prepare("INSERT INTO RollChannel VALUES ( ? )");
    await push?.run(channelId);
    await push?.finalize();
    return true;
  }

  public async isChannel(channelId: string) {
    const channel = await this.settingsDB?.prepare("SELECT channelId FROM RollChannel WHERE channelId = ?");
    const channelRes = await channel?.all(channelId);
    await channel?.finalize();
    if (!channelRes)
      return false;
    else if (channelRes?.length == 0)
      return false;
    else if (channelRes?.length > 1) {
      console.warn(`Found too many channels with ID: ${channelId}`);
      return false;
    }
    return true;
  }

  public async removeChannel(channelId: string) {
    const check = await this.settingsDB?.prepare("SELECT channelId FROM RollChannel WHERE channelId = ?");
    const checkRes = await check?.all(channelId);
    await check?.finalize();
    if (!checkRes)
      return null;
    else if (checkRes?.length == 0)
      return null;
    else if (checkRes?.length > 1) {
      console.warn(`Found too many channels with ID: ${channelId}`);
      return null;
    }

    const remove = await this.settingsDB?.prepare("DELETE FROM RollChannel WHERE channelId = ?");
    await remove?.run(channelId);
    await remove?.finalize();
    return true;
  }
}