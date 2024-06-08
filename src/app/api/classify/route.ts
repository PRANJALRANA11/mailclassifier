
// API flow emailArray ----> Model Classification -----> Pushed to classifed labeled Array
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";

export async function POST(req: NextRequest) {
  try {
    const { email,keys } = await req.json();
    const categories = {
      important:
        "Important: Emails that are personal or work-related and require immediate attention.",
      promotions:
        "Promotions: Emails related to sales, discounts, and marketing campaigns.",
      social: "Social: Emails from social networks, friends, and family.",
      marketing:
        "Marketing: Emails related to marketing, newsletters, and notifications.",
      spam: "Spam: Unwanted or unsolicited emails.",
      general: "General: If none of the above are matched, use General.",
    };
    
    console.log("email",email);
    let classified_labels = [];
    for (let emailItems of email) {
      const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-4o",
      });
    //   To extract the body of mail which don't consist snippet and vice-versa
      if (
        emailItems.snippet.replace(/[\u200B-\u200D\uFEFF]/g, "").trim() == ""
      ) {
        const text = emailItems.body
          .replace(/\\r\\n/g, " ")
          .replace(/https?:\/\/[^\s]+/g, "")
          .replace(/<[^>]+>/g, "")
          .trim();
        const prompt = `Classify the following text into one of the categories: ${categories.important},${categories.general},${categories.marketing},${categories.promotions},${categories.social},${categories.spam}.\n\nText: "${text}"\n\nCategory:`;
        let response = await model.invoke(prompt);
        classified_labels.push(response.content);
        console.log(response);
      } else {
        const prompt = `Classify the following text into one of the categories: ${categories.important},${categories.general},${categories.marketing},${categories.promotions},${categories.social},${categories.spam}.\n\nText: "${emailItems.snippet}"\n\nCategory:`;
        let response = await model.invoke(prompt);
        classified_labels.push(response.content);
        console.log(response);
      }
    }

    console.log(classified_labels);
    return NextResponse.json(classified_labels);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
