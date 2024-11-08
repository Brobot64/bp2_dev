import { NextResponse } from "next/server";

export const responseHandler = (data: any, status: number) =>
  NextResponse.json({ data: data }, { status: status });
