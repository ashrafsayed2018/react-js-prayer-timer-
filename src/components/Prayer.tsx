import {Card, CardContent, CardMedia, Typography } from "@mui/material";
type PrayerProps = {
    name: string,
    time:string,
    image:string,
}
export default function Prayer({name,time,image}:PrayerProps) {
  return (
    <Card sx={{ width: "14vw" }}>
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title="green iguana"
      />
      <CardContent>
        <h2>
          {name}
        </h2>
        <Typography variant="h3" color="text.secondary">
            {time}
        </Typography>
      </CardContent>
    </Card>
  )
}
