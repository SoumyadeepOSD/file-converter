/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloudCogIcon, LoaderIcon, XCircleIcon } from "lucide-react"
import { useRef, useState } from "react"
import axios from "axios";
import { Button } from "./components/ui/button";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const App = () => {
  const inputRef = useRef<any>(null);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  }

  const removeFile = ()=>{
    setFile(null);
  }

  // *Actual Function to get PDF from DOCS from backend
  async function handleUpload(e: any) {
    e.preventDefault();  //!to avoid the avoid the default refresh behaviour of browser
    setLoading(true);
    if (!file) {
      alert(`Please select a file to upload`);
      return;
    }
    
    const formData = new FormData(); //!initialze a formdata to put the file in {key:value} format
    formData.append('file', file); //!append the file into formdata

    try {
      const response = await axios.post(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'   //~Mention about formdata in parsed content type
        },
        responseType: 'blob', //!response should be in blob(Binary Large object), it's used to manage file upload functionality 
      });
      const blob = new Blob([response.data], { type: 'application/pdf' }); //~Initialize a new blob with the response data & mention the type as pdf
      const url = window.URL.createObjectURL(blob); //~Temporary URL is being created to download pdf file without downloading it into server

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${file.name.split('.')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false);
    } catch (error: any) {
      console.error(error.message);
      setLoading(false);
    }finally{
      setLoading(false);
    }
  }

  function handleClick() {
    if (inputRef.current) {
      inputRef?.current?.click();
    }
  }
  return (
    <div className="h-[100vh] w-full bg-yellow-50 flex flex-col items-center justify-start">
      <h1
        className="text-xs font-bold text-blue-500 border-2 border-blue-300 rounded-lg px-3 my-5"
      >
        Inter transform your docs within seconds
      </h1>
      {/* Tagline */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[70px] bg-gradient-to-br from-amber-500 to-blue-900 bg-clip-text text-transparent">Transform your <span className="font-bold">Docs/Docx</span></h1>
        <h1 className="text-[70px] bg-gradient-to-br from-amber-500 to-blue-900 bg-clip-text text-transparent">into <span className="font-bold">PDF</span> format</h1>
      </div>
      {/* Upload Document */}
      <div onClick={handleClick} className="border-2 border-dashed border-slate-700 flex flex-col items-center justify-center rounded-lg p-10 hover:cursor-pointer hover:bg-yellow-100">
        <h1 className="text-xs font-bold">Upload your document here</h1>
        <CloudCogIcon color="black" size={30} />
        <input
          ref={inputRef}
          type="file"
          className="h-0 w-0"
          accept=".docx"
          onChange={handleFileChange}
        />
        {file && (
          <div
            className="bg-blue-200 border-2 border-blue-800 px-2 rounded-xl flex flex-row items-center gap-2"
          >
            <h1>
              {file.name}
            </h1>
            <XCircleIcon onClick={removeFile} color="red" size={20} className="hover:bg-red-300 rounded-full" />
          </div>
        )}
      </div>
      {file && <Button className="my-5" onClick={handleUpload}>
        {loading?<LoaderIcon color="white" size={20} className="animate-spin"/>:"Convert"}
      </Button>}
    </div>
  )
}

export default App