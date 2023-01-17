/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import userHandler from '../../../pages/api/user';
import {describe, expect, it} from '@jest/globals';

describe('/api/user API Endpoint', () => {

  function mockRequestResponsePost(method: RequestMethod = 'POST') {
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
    const { req, res } = mockRequestResponsePost();

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
    const { req, res } = mockRequestResponsePost();

    req.body = {
      "name": "Dummy Name",
      "phone": 11223344556,
      "documentNumber": "112233445566",
      "email": "email@host.com",
      "password": "Admin@123",
      "ativo": true
    }

    req.headers.authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2M2MDdjZmNkZTk5NjhmODAwOTI5NGUiLCJpYXQiOjE2NzM5OTQ2ODV9.zSKCms5gWpRCFXxbf9pqb2kC2-JmwHiBhQaTT3JiN9o"

    await userHandler(req, res);
    expect(res.statusCode).toBe(200);
  });

});

describe('/api/user API Endpoint', () => {
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

    req.headers.authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2M2MDdjZmNkZTk5NjhmODAwOTI5NGUiLCJpYXQiOjE2NzM5OTQ2ODV9.zSKCms5gWpRCFXxbf9pqb2kC2-JmwHiBhQaTT3JiN9o"
    req.query.id = "63c721c779bff5c41388c203"

    await userHandler(req, res);
    expect(res.statusCode).toBe(200);
  });
});