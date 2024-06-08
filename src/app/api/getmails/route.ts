import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { maxMails } = await req.json();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const allMessages: any[] = [];

    const response:any = await gmail.users.messages.list({
      userId: "me",
      maxResults: maxMails,
    });

    if (response.data.messages) {
      // Fetch details for each message
      const messages = await Promise.all(
        response.data.messages.map(async (message:any) => {
          const msg: any = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
          });
          return msg.data;
        })
      );

      console.log(messages[0]);

      // Decode and process the body of each message
      const decodedMessages = messages.map((message) => {
        let senderName = "";

        // Extract sender's name from headers
        const headers = message.payload.headers;
        const fromHeader = headers.find((header: any) => header.name === "From");
        if (fromHeader) {
          const match = fromHeader.value.match(/(.*)<.*>/);
          senderName = match ? match[1].trim() : fromHeader.value;
        }

        if (message.payload.mimeType === "multipart/alternative") {
          const parts = message.payload.parts;
          const body = parts[0].body;

          if (body.data) {
            // Decode the body if it's base64 encoded
            const decodedBody = Buffer.from(body.data, "base64").toString("utf-8");
            return {
              id: message.id,
              snippet: message.snippet,
              body: decodedBody,
              senderName,
            };
          }
        }

        // Return the message as-is if it's not multipart/alternative or doesn't have data
        return {
          id: message.id,
          snippet: message.snippet,
          body: "",
          senderName,
        };
      });

      allMessages.push(...decodedMessages);
    }

    return NextResponse.json(allMessages);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
