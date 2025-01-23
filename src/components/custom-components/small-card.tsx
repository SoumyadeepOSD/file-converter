/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cloud, CloudRain, Sunset, Wind } from "lucide-react";
import { Line } from "react-chartjs-2";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const SmallCard = ({ title, value, data, options }: { title: string, value:number, data?:any, options?:any }) => {

    const iconMap: Record<string, JSX.Element> = {
        wind: <Wind color="white" size={30} />,
        rain: <CloudRain color="white" size={30} />,
        uv: <Sunset color="white" size={30} />,
        cloud: <Cloud color="white" size={30} />,
    };

    return (
        <div className="flex flex-col items-start justify-center w-full bg-gradient-to-br from-indigo-950 to-black rounded-lg p-3">
            <div className="flex flex-row items-start justify-between w-full">
                <div className="flex flex-row gap-2">
                    {iconMap[title] || <div>No icon found</div>}
                    <h1>{title}</h1>
                </div>
                <h1>Low</h1>
            </div>
            <div style={{ width: 60, height: 60 }}>
                {title!=="wind"?(
                    <CircularProgressbar 
                        value={value} 
                        text={`${value}%`} 
                />):
                (
                    <div className="flex flex-col items-start">
                        <div>
                            <Line data={data} options={options} style={{height:'80px', width:'200px'}}/>
                        </div>
                        <h1>{value}km/h</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmallCard;
