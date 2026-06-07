import { NextResponse } from "next/server";

export async function GET() {
  // Test if GrowthChart component height is actually 700px
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Growth Chart Debug</title>
    </head>
    <body style="background: #c41e3a; color: white; padding: 20px; font-family: Arial;">
      <h1>🔍 Growth Chart Debug</h1>

      <p><strong>Expected:</strong></p>
      <pre style="background: #333; padding: 10px; overflow-x: auto;">
ResponsiveContainer width="100%" height={700}
      </pre>

      <p><strong>Test 1:</strong> Height should be 700px</p>
      <div style="width: 300px; height: 700px; background: rgba(255,255,255,0.2); border: 2px solid yellow; margin: 10px 0;">
        This is 700px height reference
      </div>

      <p><strong>Test 2:</strong> Check if /groei renders with this height</p>
      <p>If chart on /groei page is NOT as tall as the yellow box above → code change NOT applied</p>

      <p><strong>Current Status:</strong></p>
      <ul>
        <li>✓ GrowthChart.tsx height changed to 700px</li>
        <li>✓ Server rebuilt</li>
        <li>⚠️ NEED TO VERIFY: Is it actually rendering?</li>
      </ul>

      <hr>
      <p><small>Check /groei page and compare chart height to this 700px box</small></p>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
