import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const openDb = async (filePath) => {
  const db = await open({
    filename: filePath,
    driver: sqlite3.Database
  });
  return db;
};
