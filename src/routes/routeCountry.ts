import { Router, Request, Response } from "express";
import CountryRepository from "../components/country/countryRepository"; // Repositório de países
import Country from "../components/country/Country"; // Modelo de país (caso precise de algum)
import jwt from "jsonwebtoken";
import path from "path";

const router = Router();
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

const SECRET = process.env.SECRET_KEY_JWT || "";


router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const countries = await new CountryRepository().selectAllCountries();
    return res.status(200).json(countries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const countryData = req.body;
  try {
    console.log("DADOS DO PAÍS A REGISTRAR\n", countryData);

    const country = new Country(countryData);

    const countryRegistered = await new CountryRepository().isCountryRegistered(
      country.getName(),
      country.getIsoCode()
    );

    if (countryRegistered) {
      return res.status(400).json({ message: "País já registrado!" });
    }

    const idInserted = await new CountryRepository().insertCountry(country);

    if (idInserted != 0) {
      console.log("País registrado com sucesso!");
      country.setId(idInserted);
      return res.status(201).json({ message: "País criado", country });
    } else {
      return res.status(400).json({ message: "Não foi possível criar o país" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const countryId = req.params.id;
  try {
    const country = await new CountryRepository().selectCountryByID(
      Number(countryId)
    );
    if (country.length > 0) {
      return res.status(200).json(country[0]);
    } else {
      return res.status(404).json({ message: "País não encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.get("/name/:name", async (req: Request, res: Response): Promise<any> => {
  const countryName = req.params.name;
  try {
    const country = await new CountryRepository().selectCountryByName(
      countryName
    );
    if (country.length > 0) {
      return res.status(200).json(country);
    } else {
      return res.status(404).json({ message: "País não encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.post("/check", async (req: Request, res: Response): Promise<any> => {
  const { name, iso_code } = req.body;
  try {
    const isRegistered = await new CountryRepository().isCountryRegistered(
      name,
      iso_code
    );
    if (isRegistered) {
      return res.status(200).json({ message: "País já registrado" });
    } else {
      return res.status(404).json({ message: "País não registrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.delete(
  "/delete/:id",
  async (req: Request, res: Response): Promise<any> => {
    const countryId = req.params.id;

    try {
      const result = await new CountryRepository().deleteCountryByID(
        Number(countryId)
      );

      if (result) {
        return res.status(200).json({ message: "País deletado com sucesso" });
      } else {
        return res.status(404).json({ message: "País não encontrado" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" }); // Erro genérico no servidor
    }
  }
);

router.put("/update/:id", async (req: Request, res: Response): Promise<any> => {
  const countryId = req.params.id;
  const { name, iso_code, logo_url } = req.body;
  console.log("----------------ATUALIZANDO-------------------");
  console.log(countryId);
  console.log(req.body);
  try {
    // Verificar se o país existe
    const existingCountry = await new CountryRepository().selectCountryByID(
      Number(countryId)
    );
    console.log(existingCountry);
    if (existingCountry.length === 0) {
      return res.status(404).json({ message: "País não encontrado" });
    }

    // Verificar se os novos dados (nome ou iso_code) já estão registrados em outro país
    const countryRegistered = await new CountryRepository().isCountryRegistered(
      name,
      iso_code,
      countryId
    );
    if (countryRegistered) {
      return res
        .status(400)
        .json({ message: "Nome ou código ISO já registrado para outro país" });
    }

    // Atualizar o país no banco de dados
    const isUpdated = await new CountryRepository().updateCountry(
      Number(countryId),
      name,
      iso_code,
      logo_url
    );

    if (isUpdated) {
      return res.status(200).json({ message: "País atualizado com sucesso" });
    } else {
      return res.status(400).json({ message: "Falha ao atualizar o país" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

export default router;
