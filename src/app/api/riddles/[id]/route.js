import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(request, context) {
  const { id } = await context.params;
  try {
    const res = await fetch(`${BACKEND_URL}/riddles/${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch riddle" },
      { status: 500 }
    );
  }
}

export async function POST(request, context) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/riddles/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to submit answer" },
      { status: 500 }
    );
  }
} 