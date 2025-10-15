import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100000);

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "read";

    const url = new URL("http://www.cvjayatehnik.com/api/recomendations.php");
    url.searchParams.set("action", action);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: "Bearer Tokengadgethouse",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.status || !data.data) {
      throw new Error("Invalid API response structure");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Kelompok 3 recommendations:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          status: "error",
          error: "Request timeout",
          message: "API request took too long to respond",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        error: "Failed to fetch recommendations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const body = await request.json();

    const url = new URL("http://www.cvjayatehnik.com/api/recomendations.php");
    url.searchParams.set("action", "create");

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: "Bearer Tokengadgethouse",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.message || "API returned error status");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating Kelompok 3 recommendation:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          status: "error",
          error: "Request timeout",
          message: "API request took too long to respond",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        error: "Failed to create recommendation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const body = await request.json();

    const url = new URL("http://www.cvjayatehnik.com/api/recomendations.php");
    url.searchParams.set("action", "update");

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        Authorization: "Bearer Tokengadgethouse",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(data.message || "API returned error status");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating Kelompok 3 recommendation:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          status: "error",
          error: "Request timeout",
          message: "API request took too long to respond",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        error: "Failed to update recommendation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          status: "error",
          error: "Missing product ID",
          message: "Product ID is required for delete operation",
        },
        { status: 400 }
      );
    }

    const url = new URL("http://www.cvjayatehnik.com/api/recomendations.php");
    url.searchParams.set("action", "delete");
    url.searchParams.set("id", id);

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Authorization: "Bearer Tokengadgethouse",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting Kelompok 3 recommendation:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          status: "error",
          error: "Request timeout",
          message: "API request took too long to respond",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        error: "Failed to delete recommendation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
