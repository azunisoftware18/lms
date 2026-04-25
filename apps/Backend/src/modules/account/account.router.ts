// src/modules/account/account.router.ts
import { Router, Request, Response } from 'express';
import { AccountController } from './account.controller.js';
import { validateRequest } from '../../common/middlewares/validateRequest.js';
import { createAccountSchema, updateAccountSchema } from './account.schema.js';

const router = Router();
const accountController = new AccountController();

// GET routes
router.get('/', (req: Request, res: Response) => accountController.getAllAccounts(req, res));
router.get('/tree', (req: Request, res: Response) => accountController.getAccountTree(req, res));
router.get('/summary', (req: Request, res: Response) => accountController.getAccountSummary(req, res));
router.get('/parent-options', (req: Request, res: Response) => accountController.getParentOptions(req, res));
router.get('/:id', (req: Request, res: Response) => accountController.getAccountById(req, res));

// POST routes
router.post('/', validateRequest(createAccountSchema), (req: Request, res: Response) => accountController.createAccount(req, res));

// PUT routes
router.put('/:id', validateRequest(updateAccountSchema), (req: Request, res: Response) => accountController.updateAccount(req, res));

// DELETE routes
router.delete('/:id', (req: Request, res: Response) => accountController.deleteAccount(req, res));

export default router;