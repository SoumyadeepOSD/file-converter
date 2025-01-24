/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { dialogType } from "./constant/types";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown'
import { useGroqChat } from "./hooks/useGroqChat";


const App = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState<string>("");
  const { dialog, loading, getGroqChatCompletion } = useGroqChat(toast);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = () => {
    if (query.trim()) {
      getGroqChatCompletion(query);
      setQuery("");
    }
  };


  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTo({
        top: resultRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [dialog]);

  return (
    <div className="bg-black h-[100vh] w-full flex flex-col items-center justify-center py-5">
      <h1 className="text-transparent bg-gradient-to-br from-orange-800 to-blue-700 bg-clip-text font-bold text-2xl fixed top-10">Food Recipe Generating App</h1>
      <div
        className="overflow-y-auto max-h-[500px] max-w-[800px]"
        ref={resultRef}
      >
        {dialog && dialog.map((e: dialogType, i: number) => (
          <div
            key={i | e.id}
            className="mt-4 text-white bg-black p-3 rounded-lg"
          >
            <div className="bg-green-800 py-3 px-2 rounded-2xl">
              <h1 className="text-sm font-bold text-white text-end w-fit">{e.query}</h1>
            </div>
            <div className="bg-blue-950 mt-5 px-3 py-2 rounded-2xl">
              <ReactMarkdown>{e.res}</ReactMarkdown>
            </div>
          </div>
        ))
        }
        {loading&&(<div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-2xl font-bold text-white animate-pulse">Generating Results</h1>
          <div className="bg-blue-600 rounded-full h-10 w-10 animate-bounce delay-5"/>
        </div>)}
      </div>
      {loading && (<Skeleton className="w-[100px] h-[20px] rounded-full" />)}
      <div className="flex flex-row items-center justify-center gap-2 w-[70%] mb-10 fixed bottom-0">
        <Input
          placeholder="Enter the food name"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          className="text-white bg-slate-600"
        />
        <Button onClick={handleSearch} disabled={loading} variant="outline">
          {loading ? "Loading..." : "Search"}
        </Button>
      </div>
    </div>
  );
};

export default App;
