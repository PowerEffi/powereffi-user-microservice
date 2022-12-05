import type {NextApiRequest, NextApiResponse} from 'next';
import md5 from 'md5';
import {DefaultResponseMsg} from '../../types/DefaultResponseMsg';
import { User } from '../../types/User';
import {GetUsersQueryParams} from '../../types/GetUsersQueryParams';
import connectDB from '../../middlewares/connectDB';
import {UserModel} from '../../models/UserModel';

const handler = async(req:NextApiRequest, res:NextApiResponse<DefaultResponseMsg | User[]>) =>{
    try{
        const userId = req?.body?.userId ? req?.body?.userId : req?.query?.userId as string;

        if(req.method != 'POST')
        {
            const failedValidation = await validateUser(userId);
            if(failedValidation){
                return res.status(400).json({ error: failedValidation});
            }
        }

        if(req.method === 'POST'){
            return await saveUser(req, res);
        }else if(req.method === 'GET'){
            return await getUsers(req, res, userId);
        }else if(req.method === 'PUT'){
            return await updateUser(req, res, userId);
        }else if(req.method === 'DELETE'){
            return await deleteUser(req, res, userId);
        }

        res.status(400).json({ error: 'Metodo solicitado nao existe '});
    }catch(e){
        console.log('Ocorreu erro ao gerenciar tarefas: ', e);
        res.status(500).json({ error: 'Ocorreu erro ao gerenciar tarefas, tente novamente '});
    }
}

/**
 * @swagger
 * /api/user:
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
 * /api/user:
 *   get:
 *     tag:
 *      - User
 *     description: Get list of users
 *     parameters:
 *          -   name: id
 *              in: query
 *              schema:
 *                  type: integer
 *              description: User ID
 *              required: true
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

    const query = {} as any;
    query.id = params.id;

    console.log('query', query);
    const result = await UserModel.find(query) as User[];
    console.log('result', result);
    return res.status(200).json(result);
}

const validateUser = async (userId : string) =>{
    if(!userId){
        return 'Usuario nao informado';
    }

    const userFound = await UserModel.findById(userId);
    if(!userFound){
        return 'Usuario nao encontrado';
    }
}

const updateUser = async (req:NextApiRequest, res:NextApiResponse<DefaultResponseMsg | User[]>, userId : string) =>{
    const userFound = await validateUserAndReturnValue(req, userId);
    if(!userFound){
        return res.status(400).json({ error: 'Usuário não encontrado'});
    }

    if(req.body){
        const user = req.body as User;

        if(user.name && user.name.trim() !== ''){
            user.name = user.name;
        }

        if(user.phone){
            user.phone = user.phone;
        }

        if(user.documentNumber && user.documentNumber.trim() !== ''){
            user.documentNumber = user.documentNumber;
        }

        if(user.email && user.email.trim() !== ''){
            user.email = user.email;
        }
        
        await UserModel.findByIdAndUpdate({ _id : userFound._id}, userFound);
        return res.status(200).json({ msg: 'Usuário atualizada com sucesso'});
    }
    
    return res.status(400).json({ error: 'Parâmetros de entrada inválidos'});
}

const deleteUser = async (req:NextApiRequest, res:NextApiResponse<DefaultResponseMsg | User[]>, userId : string) =>{
    const userFound = await validateUserAndReturnValue(req, userId);
    if(!userFound){
        return res.status(400).json({ error: 'Usuário não encontrado'});
    }

    await UserModel.findByIdAndUpdate({ _id : userFound._id}, {ativo : false});
    return res.status(200).json({ msg: 'Usuário atualizada com sucesso'});  
}

const validateUserAndReturnValue = async (req:NextApiRequest, userId : string) => {
    const id = req.query?.id as string;

    if(!id || id.trim() ===''){
        return null;
    }

    const userFound = await UserModel.findById(id);
    if(!userFound || userFound.userId !== userId){
        return null;
    }

    return userFound;
}

export default connectDB(handler);