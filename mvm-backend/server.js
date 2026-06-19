const express=require('express');
const cors=require('cors');
require('dotenv').config();

const dashboardRoutes=
require('./routes/dashboard.routes');

const app=express();

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true
  })
);
app.use(express.json());

app.use(
'/api/dashboard',
dashboardRoutes
);
app.listen(process.env.PORT, () => {
  console.log('Server Running On Port 5001');
});
