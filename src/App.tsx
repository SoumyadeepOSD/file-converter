/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, Calendar1Icon, Clock, MapPin, Search, Wind } from "lucide-react";
import { sidebarMenuOption } from "./constants/menu-option";
import { sidebarMenuOptionType } from "./constants/types";
import { Switch } from "@/components/ui/switch";
import { Input } from "./components/ui/input";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  cloudy,
  cloudyNight,
  cold,
  foggy,
  hotWeather,
  rainyDay,
  snow,
  storm,
  sunny,
  windy,
} from "./constants/images";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SmallCard from "./components/custom-components/small-card";
import useDebounce from "./hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = import.meta.env.VITE_API_KEY!;
const weatherImages: Record<string, string> = {
  Sunny: sunny,
  Clear: sunny,
  Cloudy: cloudy,
  Overcast: cloudy,
  "Partly cloudy": cloudy,
  "Cloudy Night": cloudyNight,
  Rain: rainyDay,
  Snow: snow,
  Storm: storm,
  Fog: foggy,
  Windy: windy,
  Hot: hotWeather,
  Cold: cold,
};

const getWeatherImage = (condition: string): string => {
  return weatherImages[condition] || sunny; // Default to sunny if no match
};

const App = () => {
  const [option, setOption] = useState<number>(1);
  const [data, setData] = useState<any>(null);
  const [forecastPlot, setForecastPlot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [day, setDay] = useState<number>(1);
  const [timingForecast, setTimingForecast] = useState<any>(null);

  const handleOptionClick = (id: number) => {
    setOption(id);
  };


  const debouncedQuery = useDebounce({ value: day, delay: 1000 });
  const getApiResponse = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`
      );
      if (res.status === 200) {
        setData(res.data);
        console.log(res.data);
      }
    } catch (error: any) {
      console.error("Error fetching weather data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTempGraphResponse = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?q=${query}&days=1&key=${API_KEY}`
      );
      if (res.status === 200) {
        setForecastPlot(res.data);
        console.log(res.data.forecast.forecastday[0].day);
      }
    } catch (error: any) {
      console.error("Error fetching weather data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };



  const getTimingResponse = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?q=${query}&days=${debouncedQuery}&key=${API_KEY}`
      );
      if (res.status === 200) {
        setTimingForecast(res.data.forecast);
        console.log(res.data.forecast.forecastday);
      }
    } catch (error: any) {
      console.error("Error fetching weather data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      await getApiResponse();
      await getTempGraphResponse();
    } catch (error: any) {
      console.error("Error fetching weather data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getApiResponse();
    getTempGraphResponse();
  }, []);

  const chartData = {
    labels: forecastPlot?.forecast.forecastday[0].hour.map((e: any) => e.time.split(" ")[1]) || [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: forecastPlot?.forecast.forecastday[0].hour.map((e: any) => e.temp_c) || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const windsChartData = {
    labels: forecastPlot?.forecast.forecastday[0].hour.map((e: any) => e.time.split(" ")[1]) || [],
    datasets: [
      {
        label: "Wind Speed (km/h)",
        data: forecastPlot?.forecast.forecastday[0].hour.map((e: any) => e.wind_kph) || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };
  const windChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  useEffect(() => {
    getTimingResponse();
  }, [debouncedQuery]);

  return (
    <div className="bg-gradient-to-b from-purple-950 to-indigo-800 h-[100vh] w-full flex flex-row gap-5 text-white p-5">
      <div className="bg-indigo-950 w-[250px] rounded-md flex flex-col items-center py-5">
        <h1 className="text-lg font-thin tracking-wide">WEATHERNOW</h1>
        <div className="flex flex-col items-start justify-start w-[70%] mt-10">
          {sidebarMenuOption.map((e: sidebarMenuOptionType) => {
            const isActive = option === e.id;
            return (
              <div
                key={e.id}
                onClick={() => handleOptionClick(e.id)}
                className={`py-3 px-3 w-full rounded-lg cursor-pointer ${isActive ? "bg-indigo-600" : "hover:bg-indigo-600"
                  }`}
              >
                <h1
                  className={`text-xs font-semibold ${isActive ? "text-yellow-400" : "text-white"
                    }`}
                >
                  {e.title}
                </h1>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-10 w-full p-3 rounded-md">
        <div className="flex flex-row h-fit items-center bg-blue-950 p-3 rounded-lg">
          <div className="flex flex-row gap-2 items-center justify-start w-[200px] h-fit">
            <MapPin color="white" size={20} />
            <h1>Location, Temp</h1>
          </div>
          <div className="flex flex-row items-center justify-center h-fit w-[700px] relative">
            <Input
              className="border-2 border-purple-400 py-5 text-sm text-slate-300 font-semibold"
              placeholder="Search Location City, Postal Code or Place"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <Search
              color="white"
              size={30}
              className="bg-purple-600 p-2 rounded-full absolute right-3"
              onClick={handleSearch}
            />
          </div>
          <div className="w-[350px] flex flex-row items-center justify-center h-fit gap-5">
            <Switch />
          </div>
        </div>
        <div className="grid grid-cols-2 h-full">
          {isLoading ? (
            <div className="text-white text-center text-xl">Loading...</div>
          ) : data ? (
            <div className="grid grid-rows-2">
              <div className="bg-indigo-950 rounded-lg flex flex-row items-center justify-between p-5 w-[80%]">
                <div className="flex flex-col items-start justify-start text-white">
                  <img
                    alt="weather-logo"
                    src={
                      data.current.condition.icon ||
                      getWeatherImage(data.current.condition.text)
                    }
                    className="w-20 h-20"
                  />
                  <h1 className="font-semibold text-5xl">
                    {data.current.temp_c}°C
                  </h1>
                  <h1 className="font-semibold text-lg">
                    {data.location.name}, {data.location.country}
                  </h1>
                  <h1 className="text-sm flex flex-row items-start gap-2">
                    <Wind color="white" size={20} className="animate-pulse" />
                    <span>Real Feel {data.current.feelslike_c}°C</span>
                  </h1>
                  <h1 className="text-base flex flex-row items-start gap-2">
                    <Calendar color="white" size={20} />
                    <span>
                      {new Date(data.location.localtime).toDateString()}
                    </span>
                  </h1>
                  <h1 className="text-base flex flex-row items-start gap-2">
                    <Clock color="white" size={20} />
                    <span>
                      {new Date(data.location.localtime).toLocaleTimeString()}
                    </span>
                  </h1>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-white font-semibold text-xl">
                    Temperature Graph
                  </h1>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 w-[80%]">
                <SmallCard title="wind" value={data.current.wind_kph} data={windsChartData} options={windChartOptions} />
                <SmallCard title="rain" value={forecastPlot.forecast.forecastday[0].day.daily_chance_of_rain} />
                <SmallCard title="uv" value={data.current.uv} />
                <SmallCard title="cloud" value={data.current.cloud} />
              </div>
            </div>
          ) : (
            <div className="text-white text-center text-xl">
              Unable to fetch data.
            </div>
          )}
          <div className="bg-indigo-950 w-full p-5">
            <h1 className="text-2xl font-semibold">Select Number of days for forecast</h1>
            <div>
              <Select onValueChange={(e) => {
                setDay(+e);
              }}>
                <SelectTrigger
                  className="w-[180px]">
                  <SelectValue placeholder="Select Day(s)" />
                </SelectTrigger>
                <SelectContent>
                  {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((e) => (
                      <SelectItem key={e} value={e.toString()}>
                        {e} Day
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              {/* {JSON.stringify(timingForecast.forecastday)} */}
              <div
                className="forecast-container mt-3 max-h-[300px] overflow-y-auto"
                style={{ maxHeight: '450px' }}
              >
                {timingForecast && timingForecast.forecastday?.map((e: any, i: number) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-start gap-2 border-2 bg-gradient-to-br from-blue-800/50 to-slate-900 rounded-md my-2 p-3"
                    >
                      <div className="flex flex-row items-start gap-2">
                        <Calendar1Icon color="white" size={20} />
                        <h1>{e.date}</h1>
                      </div>
                      <img alt="img" src={e.day.condition.icon} />
                      <span>{e.day.condition.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
