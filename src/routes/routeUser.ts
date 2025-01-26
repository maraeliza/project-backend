import { Router, Request, Response } from "express";
import User from "../components/user/userModel";
import UserRepository from "../components/user/userRepository";

const jwt = require("jsonwebtoken");
const path = require("path");

const router = Router();
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

const SECRET = process.env.SECRET_KEY_JWT;

const verifyJWT=async(req:any, res:Response, next:Function)=>{
  const token = req.headers['x-access-token'];  

  jwt.verify(token, SECRET, (err: any, decoded: any) => {
    if(err){
      console.log(err);
      return res.status(401).json({ auth: false, message: "Token inválido" });
    }
    else{
      req.userId = decoded.userId;
      next();
    }
  })
}

router.get("/", verifyJWT, (req: Request, res: Response) => {
  res.send("Listando todos os usuários");
  console.log(req.body);
});

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const user = req.body;
  try {
    console.log("DADOS DO USUARIO A REGISTRAR\n",user)
    var usuario = new User(user);
    
    var userRegistered = await usuario.register();

    if (userRegistered) {
      console.log("Usuario registrado com sucesso! ")
      return res.status(201).json({ message: "Usuário criado", user });
    } else {
      return res
        .status(400)
        .json({ message: "Não foi possível criar usuário" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const user = req.body;
  console.log(req.body);
  try {
    var userAuth = {
      senha: user.senha,
      cpf: user.cpf,
      cnpj: user.cnpj,
    };
    const userAutenticado = await User.authUser(userAuth);

    if (!userAutenticado) {
      return res
        .status(401)
        .json({ auth: false, message: "Senha ou CPF inválido" });
    }

    //se sim, pegar o id do usuário
    const id = await UserRepository.selectIDFromUser(user.cpf, user.cnpj);
    console.log("id usuario: ", id);

    try {
      //enviar o token para o front-end
      const token = await jwt.sign({ userId: id }, SECRET, {
        expiresIn: 30000,
      });
      console.log(token);
      if (token) {
        return res.status(200).json({ auth: true, token });
      } else {
        return res
          .status(500)
          .json({ auth: false, message: "Erro ao gerar token" });
      }
    } catch (erro) {
      return res
        .status(500)
        .json({ auth: false, message: "Erro ao gerar token" });
    }
  } catch (erro) {
    console.log(erro);
    return res.status(401).json({ auth: false, message: "Dados inválidos" });
  }
});

export default router;
