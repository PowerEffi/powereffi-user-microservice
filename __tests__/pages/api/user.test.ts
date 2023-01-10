/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import userHandler from '../../../pages/api/user';
import {describe, expect, it} from '@jest/globals';

describe('/api/user API Endpoint', () => {

  function mockRequestResponse(method: RequestMethod = 'POST') {
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
    const { req, res } = mockRequestResponse();

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
});
