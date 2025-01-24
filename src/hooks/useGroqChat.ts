/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Groq from "groq-sdk";
import { dialogType } from "@/constant/types";

export const useGroqChat = (toast: (options: { title: string }) => void) => {
    const [dialog, setDialog] = useState<dialogType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    const getGroqChatCompletion = async(query:string)=>{
        const GROQ_API_KEY = import.meta.env.VITE_API_KEY!;
        const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });
        try {
            setLoading(true);
            const res = await groq.chat.completions.create({
                messages: [
                  {
                    role: "user",
                    content: query,
                  },
                ],
                model: "llama-3.3-70b-versatile",
            });
            const responseText = res.choices[0]?.message?.content || "";
            setDialog((prev) => [
                ...prev,
                { id: prev.length, query, res: responseText },
              ]);
        } catch (error:any) {
            setError(error.message);
      toast({ title: `${error.message}` });
      console.error(error.message);
        }finally {
            setLoading(false);
          }
    };
    return {
        dialog,
        loading,
        error,
        getGroqChatCompletion,
      };
};