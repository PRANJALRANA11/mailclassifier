"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../components/ui/dropdown-menu";
import { Card, CardContent } from "../../components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

const Inbox: React.FC = () => {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<any[]>([]); // To set total emails from an account
  const [selectedCard, setSelectedCard] = useState<any>(null); // State to show a single mail card with whole info
  const [labels, setLabels] = useState<{ [key: string]: string }>({}); // State to store labels for each email
  const [emailLimit, setEmailLimit] = useState<number>(15); // State for the number of emails to display
  const [loader, setloader] = useState(false);
  const [loader_button, setloader_button] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setloader(true);
        const response = await axios.post("/api/getmails", {
          maxMails: emailLimit,
        });
        console.log(response);
        setEmails(response.data);
        setEmailLimit(Math.min(emailLimit, response.data.length)); // Adjust initial email limit based on fetched emails
        setloader(false);
      } catch (error) {
        console.log(error);
        setloader(false);
      }
    };
    fetchEmails();
  }, [emailLimit]);

  if (!session) {
    router.push("/");
    return null;
  }
//   To clean the text and remove unwanted characters
  const cleanText = (text: string) => {
    return text
      .replace(/\\r\\n/g, " ") // Replace \r\n with space
      .replace(/https?:\/\/[^\s]+/g, "") // Remove URLs
      .replace(/<[^>]+>/g, "") // Remove HTML tags
      .trim();
  };
//   To get the label color based on the category
  function getLabelColor(label: string) {
    const labelColors: { [key: string]: string } = {
      Important: "text-green-500",
      Spam: "text-red-500",
      Promotions: "text-indigo-700",
      Social: "text-purple-500",
      Marketing: "text-yellow-500",
      General: "text-rose-950",
    };
    return labelColors[label] || "text-gray-500";
  }
//   To classify the emails
  const classifyEmail = async (emailsToClassify: any[]) => {
    try {
      setloader_button(true);
      const response = await axios.post("/api/classify", {
        email: emailsToClassify,
        keys: localStorage.getItem("openaiKeys"),
      });
      const classifiedLabels = response.data;

      const newLabels = { ...labels };
      emailsToClassify.forEach((email, index) => {
        newLabels[email.id] = classifiedLabels[index];
      });
      setLabels(newLabels);

      console.log(newLabels);
      setloader_button(false);
    } catch (error) {
      console.log(error);
      setloader_button(false);
    }
  };

  return (
    <div className="w-3/5 mx-auto">
      <div className="flex mt-10">
        <div>
          <Avatar>
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h4 className="ml-4 w-15 font-semibold">{session?.user?.name}</h4>
          <p className="ml-4">{session?.user?.email}</p>
        </div>
        <div className="ml-auto">
          <Button variant="outline" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      </div>
      <div className="flex mt-40">
        <div className="ml-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <svg
                  className="w-4 h-4 mr-3 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
                {emailLimit}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-[20rem] overflow-auto">
              <DropdownMenuLabel>Select Mails</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={emailLimit.toString()}
                onValueChange={(value) => setEmailLimit(Number(value))}
              >
                {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                  <DropdownMenuRadioItem key={num} value={num.toString()}>
                    {num}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="ml-auto">
          <Button onClick={() => classifyEmail(emails)}>
            {loader_button ? (
              <div role="status ">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4  align-middle text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Classify"
            )}
          </Button>
        </div>
      </div>
      {loader ? (
        <Skeleton className="w-full h-[20rem] rounded-lg mt-10" />
      ) : (
        <div className="mt-20 ml-10 max-h-[20rem] overflow-y-auto">
          {emails.slice(0, emailLimit).map((email: any) => (
            <Card
              key={email.id}
              className="w-full mb-4 rounded-lg h-24 border-2 border-white cursor-pointer"
              onClick={() => setSelectedCard(email)}
            >
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-white">
                    {email.senderName}
                  </span>
                  <p className="text-sm text-white mt-2">
                    {email.snippet &&
                    email.snippet
                      .replace(/[\u200B-\u200D\uFEFF]/g, "")
                      .trim() !== ""
                      ? email.snippet.substring(0, 100)
                      : "No snippet"}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-md ${
                      labels[email.id] && getLabelColor(labels[email.id])
                    } font-semibold`}
                  >
                    {labels[email.id]}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet
        open={!!selectedCard}
        onOpenChange={(open) => !open && setSelectedCard(null)}
      >
        <SheetContent className="w-[80rem]">
          <SheetHeader>
            <SheetTitle className="mt-10 flex justify-between items-center">
              {selectedCard ? selectedCard.senderName : "No email selected"}
              <p
                className={`text-md ${
                  selectedCard &&
                  labels[selectedCard.id] &&
                  getLabelColor(labels[selectedCard.id])
                } font-semibold`}
              >
                {selectedCard && labels[selectedCard.id]}
              </p>
            </SheetTitle>
            <SheetDescription>
              {selectedCard &&
              selectedCard.body &&
              selectedCard.body.trim() !== ""
                ? cleanText(selectedCard.body)
                : selectedCard?.snippet}
              <Button onClick={() => classifyEmail([selectedCard])}>
                {loader_button ? (
                  <div role="status ">
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4  align-middle text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Classify"
                )}
              </Button>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Inbox;
