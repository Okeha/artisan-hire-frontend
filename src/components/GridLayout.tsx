// import { Grid } from '@mui/material'
import Grid from "@mui/material/Grid2";
import React, { useState, useEffect } from "react";
import ArtisanCard from "./ArtisanCard.tsx";

function GridLayout() {
  const [artisans, setArtisans] = useState([
    {
      _id: "",
      profilePic: "",
      firstname: "",
      lastname: "",
      stars: 0,
      category: "",
      price: 0,
      skills: [],
    },
  ]);

  useEffect(() => {
    async function getArtisans() {
      const response = await fetch(
        "https://artisan-hire-backend.onrender.com/api/v1/artisans"
      );
      const data = await response.json();

      console.log(data);
      setArtisans(data.body.artisans);
    }
    getArtisans();
  }, []);

  return (
    <div>
      <Grid container spacing={2}>
        {artisans.map((artisan) => (
          <Grid size={{ xs: 12, md: 4 }} key={artisan.firstname}>
            <ArtisanCard {...artisan} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default GridLayout;
