import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoClient";
import dayjs from "dayjs"; // Ensure dayjs is installed: npm install dayjs

const CREATOR_COLLECTION = "creators";
const ADSTERRA_STATS_URL =
  "https://api3.adsterratools.com/publisher/stats.json";

/**
 * GET handler: Fetches Adsterra stats using the creator's stored API Key.
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDB();

    // 1. Retrieve the stored API Key
    const creator = await db
      .collection(CREATOR_COLLECTION)
      .findOne(
        { userId: userId },
        { projection: { _id: 0, creatorApiKey: 1 } }
      );

    const apiKey = creator?.creatorApiKey;

    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "Creator API Key not found. Please complete the monetization setup.",
        },
        { status: 404 }
      );
    }

    // 2. Parse Query Parameters from the incoming request
    const { searchParams } = new URL(request.url);

    const adsterraQueryParams = new URLSearchParams();

    // Default dates and grouping
    const startDate =
      searchParams.get("start_date") ||
      dayjs().subtract(6, "day").format("YYYY-MM-DD");
    const finishDate =
      searchParams.get("finish_date") || dayjs().format("YYYY-MM-DD");
    const groupBy =
      searchParams.getAll("group_by").length > 0
        ? searchParams.getAll("group_by")
        : ["date"];

    adsterraQueryParams.append("start_date", startDate);
    adsterraQueryParams.append("finish_date", finishDate);

    // Append array parameters in the required Adsterra format: group_by[]=value
    groupBy.forEach((group) => adsterraQueryParams.append("group_by[]", group));

    // Optional parameters passed directly (using getAll to handle potential arrays)
    ["country", "domain", "placement", "placement_ids"].forEach((param) => {
      if (searchParams.has(param)) {
        searchParams
          .getAll(param)
          .forEach((val) => adsterraQueryParams.append(param + "[]", val));
      }
    });

    // 3. Call the external Adsterra API
    const fetchUrl = `${ADSTERRA_STATS_URL}?${adsterraQueryParams.toString()}`;

    const adsterraResponse = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey, // Use the stored, secure API Key
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const adsterraData = await adsterraResponse.json();

    if (adsterraResponse.ok) {
      // Success: Return the raw stats data from Adsterra (contains 'items' array)
      return NextResponse.json(adsterraData, { status: 200 });
    } else {
      // External API error
      console.error("Adsterra API Error Status:", adsterraResponse.status);
      console.error("Adsterra API Error Details:", adsterraData);

      // Return the specific error message and status code from Adsterra
      return NextResponse.json(adsterraData, {
        status: adsterraResponse.status,
      });
    }
  } catch (err) {
    console.error("Internal Server Error during stats fetch:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
