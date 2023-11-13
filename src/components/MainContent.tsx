import { Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Prayer from './Prayer';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import moment from"moment";
import "moment/dist/locale/ar-dz"
moment.locale("ar");
type selectedCountryProps = {
  apiName: string,
  displayName: string,
} | undefined;

type TimingsProps = {
  Fajr:string,
  Dhuhr:string,
  Asr:string,
  Sunset:string,
  Isha:string,

}
export default function  MainContent ()   {
    // states
    const [selectedCountry,setSelectedCountry] = useState<selectedCountryProps>({
      apiName:"egypt",
      displayName:"مصر"
    });
    const [timings,setTimings] =  useState<TimingsProps>({
    Fajr: "04:48",
    "Dhuhr": "11:39",
    "Asr": "14:40",
    "Sunset": "17:00",
    "Isha": "18:30"
    })
    const [today,setToday] = useState("")
    const [remainingTime,setRemaingTime] = useState<string>()
    const [nextPrayerIndex,setNextPrayerIndex] = useState(0)

    const prayerArray = useMemo(() => {
     return [
        {key: "Fajr",displayName:"الفجر"},
        {key: "Dhuhr",displayName:"الظهر"},
        {key: "Asr",displayName:"العصر"},
        {key: "Sunset",displayName:"المغرب"},
        {key: "Isha",displayName:"العشاء"}
      ]
    },[])

    useEffect(() => {

        const getTimings = async () => {
            const response = await  axios.get(`https://api.aladhan.com/v1/timingsByCity/13-11-2023?city=cairo&country=${selectedCountry?.apiName}&method=8`)
             setTimings(response.data.data.timings)
        }
        getTimings()
         return () => {
          return;
         };

         

    }, [selectedCountry])


  


    useEffect(() => {

      const t = moment();
      setToday(t.format("MMM Do YYYY | h:mm"))
      const  setUpCountdownTimer = 
      
      () => {
  
        const momentNow = moment();
        const FajrMoment = moment(timings.Fajr,"hh:mm")
        const DhuhrMoment = moment(timings.Dhuhr,"hh:mm")
        const AsrMoment = moment(timings.Asr,"hh:mm")
        const SunsetMoment = moment(timings.Sunset,"hh:mm")
        const ishaMoment = moment(timings.Isha,"hh:mm")
  
  
        let prayerIndex = 0;
    
  
        if(momentNow.isAfter(FajrMoment) && momentNow.isBefore(DhuhrMoment)) {
          prayerIndex = 1;
        } else if(momentNow.isAfter(DhuhrMoment) && momentNow.isBefore(AsrMoment)) {
          prayerIndex = 2;
        } else if(momentNow.isAfter(AsrMoment) && momentNow.isBefore(SunsetMoment)) {
          prayerIndex = 3;
        }
        else if(momentNow.isAfter(SunsetMoment) && momentNow.isBefore(ishaMoment)) {
          prayerIndex = 4;
        } else {
          prayerIndex = 0;
        }
        setNextPrayerIndex(prayerIndex)
         // getting the difference between between the prayer time and now 

          const nextPrayerObject = prayerArray[prayerIndex];
          const nextPrayerTime = timings[nextPrayerObject.key as keyof TimingsProps] ;
          const nextPrayerTimeMoment = moment(nextPrayerTime,"hh:mm");
          let remainingTime = moment(nextPrayerTime,"hh:mm").diff(momentNow)
          if(remainingTime < 0) {
            const midNightDiff = moment("23:59:59","hh:mm:ss").diff(momentNow);
            const fajrToMidNigthDiff = nextPrayerTimeMoment.diff(moment("00:00:00","hh:mm:ss"));
            const totalDiff = midNightDiff + fajrToMidNigthDiff;
            remainingTime = totalDiff;
          }
          const durationRemainingTime = moment.duration(remainingTime)
          const hoursDuration = durationRemainingTime.hours() < 10 ? ` ${durationRemainingTime.hours()} 0 ` : durationRemainingTime.hours;
          const minutesDuration = durationRemainingTime.minutes() < 10 ? ` ${durationRemainingTime.minutes()} 0 `  : durationRemainingTime.minutes();
          const secondsDuration = durationRemainingTime.seconds() < 10 ? ` ${durationRemainingTime.seconds()} 0 ` : durationRemainingTime.seconds();

          setRemaingTime(`${secondsDuration} :   ${minutesDuration} : ${hoursDuration}`)
      }
      const  interval = setInterval(() => {
        setUpCountdownTimer()
     
      }, 1000)
      return () => {
       console.log("unmounting")
       clearInterval(interval)
      }
      
    },[prayerArray,timings]);
  

 
    const availableCities = [
      {
        apiName:"kingdom of saudi arabia",
        displayName:"السعودية",
      },
      {
        apiName:"egypt",
        displayName:"مصر",
      },
      {
        apiName:"syria",
        displayName:"سوريا"
      }
    ]
 

  
    const handleCityChange = (e: SelectChangeEvent<string>) => {
        const cityObject:selectedCountryProps = availableCities.find(availableCity => availableCity.apiName ==e.target.value);
        setSelectedCountry(cityObject);
    };
  return (
    <>
    {/* top row */}
    <Grid container>
        <Grid xs={6} >
            <div>
                <h2> {today}</h2>
                <h1>{selectedCountry?.displayName}</h1>
            </div>
        </Grid>
        <Grid xs={6}>
            <div>
                <h2>متبقي حتى صلاة {prayerArray[nextPrayerIndex].displayName}</h2>
                <h1 >{remainingTime}</h1>
                
            </div>
        </Grid>
    </Grid>
    {/* top row */}
    <Divider />
    {/* pray cards */}
    <Stack direction='row' justifyContent="space-around" style={{marginTop:"50px"}}>
        <Prayer name="الفجر" 
        time={timings.Fajr} image="./fajr-prayer.png"/>
        <Prayer name="الظهر" 
        time={timings.Dhuhr} image="./dhhr-prayer-mosque.png"/>
        <Prayer name="العصر" 
        time={timings.Asr} image="./asr-prayer-mosque.png"/>
        <Prayer name="المغرب" 
        time={timings.Sunset} image="./sunset-prayer-mosque.png"/>
        <Prayer name="العشاء" 
        time={timings.Isha} image="./night-prayer-mosque.png"/>
    </Stack>
    {/* pray cards */}
    {/* select city */}
    <Stack direction={"row"} justifyContent={"center"} style={{marginTop:"40px"}}>
    <FormControl style={{width:"20%"}}>
        <InputLabel id="demo-simple-select-label"><span style={{color:"white"}}>المدينة</span></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCountry?.apiName}
          label="country"
          onChange={handleCityChange}
          style={{color:"white"}}
        >

          {availableCities.map((available) => {
            return <MenuItem value={available.apiName} key={available.apiName}>{available.displayName}</MenuItem>
          })
          }
        </Select>
      </FormControl>
    </Stack>
    {/* select city */}
    </>
  )
}
