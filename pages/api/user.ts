import type {NextApiRequest, NextApiResponse} from 'next';
import md5 from 'md5';
import {DefaultResponseMsg} from '../../types/DefaultResponseMsg';
import { User } from '../../types/User';
import {GetUsersQueryParams} from '../../types/GetUsersQueryParams';
import connectDB from '../../middlewares/connectDB';
import {UserModel} from '../../models/UserModel';

const handler = async(req:NextApiRequest, res:NextApiResponse<DefaultResponseMsg | User[]>) =>{
    try{
        if(req.method === 'POST'){
            return await saveUser(req, res);
        }/*else if(req.method === 'GET'){
            return await getTasks(req, res);
        }else if(req.method === 'PUT'){
            return await updateTask(req, res);
        }else if(req.method === 'DELETE'){
            return await deleteTask(req, res);
        }*/

        res.status(400).json({ error: 'Metodo solicitado nao existe '});
    }catch(e){
        console.log('Ocorreu erro ao gerenciar tarefas: ', e);
        res.status(500).json({ error: 'Ocorreu erro ao gerenciar tarefas, tente novamente '});
    }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     tag:
 *      - User
 *     description: Creation of users
 *     requestBody:
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário adicionado com sucesso
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    msg: 
 *                      type: string
 *components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: User name
 *              phone:
 *                  type: number
 *                  description: User phone number
 *              documentNumber:
 *                  type: string
 *                  description: User document number
 *              email:
 *                  type: string
 *                  description: User email
 *              password:
 *                  type: string
 *                  description: User password
 *              ativo:
 *                  type: boolean
 *                  description: User status
 */
 const saveUser = async(req : NextApiRequest, res : NextApiResponse<DefaultResponseMsg>) =>{
    try{
        if(req.method !== 'POST'){
            res.status(400).json({ error: 'O metodo solicitado não existe'});
            return;
        }

        if(req.body){
            const user = req.body as User;
            if(!user.name || user.name.length < 3){
                res.status(400).json({ error: 'Nome inválido'});
                return;
            }

            if(!user.phone || user.phone.toString().length < 9){
                res.status(400).json({ error: 'Número de telefone inválido'});
                return;
            }

            if(!user.documentNumber){
                res.status(400).json({ error: 'Número de documento inválido'});
                return;
            }

            if(!user.name || user.name.length < 3){
                res.status(400).json({ error: 'Nome inválido'});
                return;
            }

            if(!user.email || !user.email.includes('@') || !user.email.includes('.')
                || user.email.length < 4){
                res.status(400).json({ error: 'E-mail inválido'});
                return;
            }

            if(!user.password){
                res.status(400).json({ error: 'Por favor, informe sua senha'});
                return;
            }

            const existingUser = await UserModel.find({email : user.email, ativo: true});
            if(existingUser && existingUser.length > 0){
                res.status(400).json({ error: 'Já existe usuário com o e-mail informado'});
                return;
            }

            user.ativo = true;

            const final = {
                ...user,
                password : md5(user.password)
            }

            await UserModel.create(final);
            res.status(200).json({msg: 'Usuário adicionado com sucesso'});
            return;
        }

        res.status(400).json({error: 'Parâmetros de entrada inválidos'});
    }catch(e){
        console.log('Ocorreu o erro ao criar o usuário: ', e);
        res.status(500).json({ error: 'Ocorreu erro ao criar usuário, tente novamente '});
    }
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     tag:
 *      - User
 *     description: Get list of users
 *     responses:
 *       200:
 *         description: Usuário consultados com sucesso
 *         content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/ArrayOfUsers'
 *components:
 *  schemas:
 *      UserGetRequest:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: User name
 *              ativo:
 *                  type: boolean
 *                  description: User status
 *      ArrayOfUsers:
 *          type: array
 *          items:
 *              $ref: '#/components/schemas/User'
 */
const getUsers = async (req:NextApiRequest, res:NextApiResponse<DefaultResponseMsg | User[]>, userId : string) =>{
    
    const params = req.query as GetUsersQueryParams;

    const query = {
        userId
    } as any;

    if(params?.name){
        query.name = params?.name;
    }

    if(params?.ativo){
        query.ativo = params?.ativo == true;
    }

    console.log('query', query);
    const result = await UserModel.find(query) as User[];
    console.log('result', result);
    return res.status(200).json(result);
}

export default connectDB(handler);