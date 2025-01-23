import { useState, useEffect } from "react";


const useDebounce = ({value, delay}:{value:string|number,delay:number})=>{
    const [debouncedValue, setDebouncedValue] = useState<string|number>("");
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setDebouncedValue(value);
        },delay);

        return ()=>{
            clearTimeout(timer);
        };
    },[value, delay]);
    return debouncedValue;
};

export default useDebounce;