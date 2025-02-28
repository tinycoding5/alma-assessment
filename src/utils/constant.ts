import path from "path";

export const DB_PATH = path.join(process.cwd(), "data");
export const FORM_DATA_FILE = path.join(DB_PATH, "form-data.json");
export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
