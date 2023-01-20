/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import userHandler from '../../../pages/api/user';
import loginHandler from '../../../pages/api/login';
import {describe, expect, it} from '@jest/globals';
import { User } from '../../../types/User';
import md5 from 'md5';
import { UserModel } from '../../../models/UserModel';
import connectDB from '../../../middlewares/connectDB';
import { LoginResponse } from '../../../types/LoginResponse';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Login } from '../../../types/Login';

describe('/api/user API Endpoint', () => {
  var _token : string;

  beforeAll(async () => { 
    const {DB_CONNECTION_STRING} = process.env;
    await mongoose.connect(DB_CONNECTION_STRING!);
    await mockCreateAdminUser();
    await mockLoginAdminUser();
  });
  
  async function mockCreateAdminUser(){    
    const user = 
    {	
      name: "admin",
      phone: 11223344556,
      documentNumber: "112233445",
      email: "admin@admin.com",
      password: md5("Admin123"),
      ativo: true
    } as User;

    return await UserModel.create(user);
  }

  async function mockLoginAdminUser(){
    const dados = {
      "login": "admin@admin.com",
      "password": "Admin123"
    } as Login;

    const {MY_SECRET_KEY} = process.env;
    const usersFound = await UserModel.find({email : dados.login, password: md5(dados.password)});
    const user = usersFound[0];
    _token = jwt.sign({_id : user._id}, MY_SECRET_KEY!);
  }

  async function mockRequestResponsePost(method: RequestMethod = 'POST') {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });
    req.headers = {
      'Content-Type': 'application/json'
    };

    return { req, res };
  }

  it('should not create new user for unauthorized call', async () => {
    const { req, res } = await mockRequestResponsePost();

    req.body = {
      "name": "Dummy Name",
      "phone": 11223344556,
      "documentNumber": "112233445566",
      "email": "email@host.com",
      "password": "Admin@123",
      "ativo": true
    }

    await userHandler(req, res);
    expect(res.statusCode).toBe(401);
  });

  it('should create new user', async () => {
    const { req, res } = await mockRequestResponsePost();

    req.body = {
      "name": "Dummy Name",
      "phone": 11223344556,
      "documentNumber": "112233445566",
      "email": "email@host.com",
      "password": "Admin123",
      "ativo": true
    }

    req.headers.authorization = "Bearer " + _token;

    await userHandler(req, res);
    expect(res.statusCode).toBe(200);
  });

  function mockRequestResponseGet(method: RequestMethod = 'GET') {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });
    req.headers = {
      'Content-Type': 'application/json'
    },
      req.query.userId = "21312"
    return { req, res };
  }

  it('should not get user for unauthorized call', async () => {
    const { req, res } = mockRequestResponseGet();

    req.headers.authorization = "Bearer " + _token;
    req.query.id = "63c721c779bff5c41388c203"

    await userHandler(req, res);
    expect(res.statusCode).toBe(200);
  });
});