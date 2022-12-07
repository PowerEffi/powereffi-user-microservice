import type {NextApiRequest, NextApiResponse} from 'next';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import connectDB from '../../middlewares/connectDB';
import {UserModel} from '../../models/UserModel';
import {DefaultResponseMsg} from '../../types/DefaultResponseMsg';
import { Login } from '../../types/Login';
import { LoginResponse } from '../../types/LoginResponse';

/**
 * @swagger
 * /api/login:
 *   post:
 *     tag:
 *      -Login
 *     description: Authentication of users
 *     requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          login:
 *                              type: string
 *                              description: User login
 *                          password:
 *                              type: string
 *                              description: User password
 *     responses:
 *       200:
 *         description: Usuário adicionado com sucesso
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      token: 
 *                          type: string
 *                          description: Token of authentication
 *                      username:
 *                          type: string
 *                          description: User name
 *                      email:
 *                          type: string
 *                          description: User email 
 */
const handler = async (req : NextApiRequest, res : NextApiResponse<DefaultResponseMsg | LoginResponse>) => {
    try{
        if(req.method !== 'POST'){
            res.status(400).json({ error: 'O metodo solicitado não existe'});
            return;
        }

        const {MY_SECRET_KEY} = process.env;
        if(!MY_SECRET_KEY){
            res.status(500).json({ error: 'Variável de ambiente "MY_SECRET_KEY" não encontrada'});
            return;
        }

        if(req.body){
            const auth = req.body as Login;
            if(auth.login && auth.password){
                const usersFound = await UserModel.find({email : auth.login, password: md5(auth.password)});
                if(usersFound && usersFound.length > 0){
                    const user = usersFound[0];
                    const token = jwt.sign({_id : user._id}, MY_SECRET_KEY);
                    res.status(200).json({ token, name: user.name, email: user.email});
                    return;
                }
            }
        }

        res.status(400).json({ error: 'Usuário e/ou senha inválidos'});
    }catch(e){
        console.log('Ocorreu o erro ao autenticar o usuário: ', e);
        res.status(500).json({ error: 'Ocorreu um erro ao autenticar o usuário, tente novamente'});
    }
}

export default connectDB(handler);