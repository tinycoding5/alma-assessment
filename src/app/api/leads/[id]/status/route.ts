import { FORM_DATA_FILE } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { Lead } from "@/types";
import { writeFile } from "fs/promises";

interface RouteParams {
  id: string;
}

interface RouteContext {
  params: RouteParams;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const cookie = request.headers.get("cookie");
  const tokenMatch = cookie?.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const id = context.params.id;
    const body = await request.json();
    const { status } = body;

    if (!status || !["PENDING", "REACHED_OUT"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const data = fs.existsSync(FORM_DATA_FILE)
      ? JSON.parse(fs.readFileSync(FORM_DATA_FILE, "utf-8"))
      : [];

    const leadIndex = data.findIndex((item: Lead) => item.id === id);
    if (leadIndex > -1) {
      data[leadIndex].status = status;
      await writeFile(FORM_DATA_FILE, JSON.stringify(data, null, 2));
      return NextResponse.json({
        message: "Updated Successfully!",
      });
    } else {
      return NextResponse.json(
        { error: "Couldn't find the lead" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to update lead status", error);
    return NextResponse.json(
      { error: "Failed to update lead status" },
      { status: 500 }
    );
  }
}
