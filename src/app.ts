import express, { Request, Response } from "express";

import countryRoutes from "./routes/routeCountry";
import planRoutes from "./routes/routePlan";
import userRoutes from "./routes/routeUser";
import tenantRoutes from "./routes/routeTenant";
import statusRoutes from "./routes/routeStatus";

import path from "path";

const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

const PORT = process.env.PORT;
const corsOptions = require("./configs/corsOptions");
const cors = require("cors");

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/countries", countryRoutes);
app.use("/users", userRoutes);
app.use("/plans", planRoutes);
app.use("/tenants", tenantRoutes);
app.use("/status", statusRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("GET feito com sucesso!");
});

const PORTA = PORT || 8080;
app.listen(PORTA, () => {
  console.log(
    `Servidor executando na porta ${PORTA}! http://localhost:${PORTA}`
  );
});
