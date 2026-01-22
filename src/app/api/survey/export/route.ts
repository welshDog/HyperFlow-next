import { NextResponse } from "next/server";
import { listSurveyResponses } from "@/app/actions/survey";

type Row = { id: string; createdAt: number; data: Record<string, unknown> };

export async function GET() {
  const rows = (await listSurveyResponses()) as Row[];
  const headers: string[] = ["id", "createdAt", "field", "value"];
  const lines: string[] = [];
  lines.push(headers.join(","));
  rows.forEach((r: Row) => {
    Object.entries(r.data).forEach(([k, v]) => {
      lines.push([r.id, String(r.createdAt), k, JSON.stringify(v)].join(","));
    });
  });
  const csv = lines.join("\n");
  return new NextResponse(csv, { headers: { "content-type": "text/csv" } });
}
