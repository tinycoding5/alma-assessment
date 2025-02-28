import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { FileData, Lead, LeadStatus } from "@/types";

import { mkdir, writeFile } from "fs/promises";
import { DB_PATH, FORM_DATA_FILE, UPLOADS_DIR } from "@/utils";

async function initializeDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      await mkdir(DB_PATH, { recursive: true });
    }

    if (!fs.existsSync(FORM_DATA_FILE)) {
      await writeFile(FORM_DATA_FILE, JSON.stringify([]));
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true });
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Save form data to the JSON file
async function saveFormData(data: Lead): Promise<void> {
  try {
    const existingData = fs.existsSync(FORM_DATA_FILE)
      ? JSON.parse(fs.readFileSync(FORM_DATA_FILE, "utf-8"))
      : [];

    existingData.push({
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });

    await writeFile(FORM_DATA_FILE, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error("Error saving form data:", error);
    throw new Error("Failed to save form data");
  }
}

// Save uploaded file
async function saveFile(file: File): Promise<FileData> {
  try {
    // Create a unique filename
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    // Convert file to ArrayBuffer and save it
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    // Return the public URL
    return {
      name: fileName,
      path: `/uploads/${fileName}`,
    };
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save file");
  }
}

// POST handler function
export async function POST(request: NextRequest) {
  try {
    await initializeDB();

    // Parse FormData
    const formData = await request.formData();

    const reqVisasOfInterest = formData.get("visasOfInterest");

    // Extract text fields
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const linkedinProfile = formData.get("linkedinProfile") as string;
    const country = formData.get("country") as string;
    const visasOfInterest = reqVisasOfInterest
      ? JSON.parse(reqVisasOfInterest as string)
      : [];
    const additionalInfo = formData.get("additionalInfo") as string;
    const status = formData.get("status") as LeadStatus;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Process file if present
    const file = formData.get("resume") as File | null;
    let fileUrl: FileData | undefined;

    if (file && file.size > 0) {
      fileUrl = await saveFile(file);
    }

    // Create form data object
    const formDataObj: Lead = {
      firstName,
      lastName,
      email,
      country,
      linkedinProfile,
      visasOfInterest,
      additionalInfo,
      status,
      resume: fileUrl,
    };

    // Save to database
    await saveFormData(formDataObj);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Form data submitted successfully",
        data: formDataObj,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing form:", error);
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");
  const tokenMatch = cookie?.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  try {
    await initializeDB();

    // Read data from file
    const data = fs.existsSync(FORM_DATA_FILE)
      ? JSON.parse(fs.readFileSync(FORM_DATA_FILE, "utf-8"))
      : [];

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error retrieving form data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve form submissions" },
      { status: 500 }
    );
  }
}
