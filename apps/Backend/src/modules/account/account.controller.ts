// src/modules/account/account.controller.ts
import { Request, Response } from 'express';

function getStringQuery(val: unknown): string | undefined {
  if (Array.isArray(val)) {
    const first = val[0];
    return typeof first === 'string' ? first : undefined;
  }
  return typeof val === 'string' ? val : undefined;
}

function getNumberQuery(val: unknown, fallback: number): number {
  const s = getStringQuery(val);
  if (!s) return fallback;
  const n = Number.parseInt(s, 10);
  return Number.isNaN(n) ? fallback : n;
}
import { AccountService } from './account.service.js';

const accountService = new AccountService();

export class AccountController {
  
  async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const account = await accountService.createAccount(req.body);
      res.status(201).json({
        success: true,
        data: account,
        message: 'Account created successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAccountById(req: Request, res: Response): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);
      const account = await accountService.getAccountById(id);
      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: account
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      const search = getStringQuery(req.query.search);
      const type = getStringQuery(req.query.type);
      const status = getStringQuery(req.query.status);
      const page = getNumberQuery(req.query.page, 1);
      const limit = getNumberQuery(req.query.limit, 50);

      const { accounts, total } = await accountService.getAllAccounts({
        search,
        type,
        status,
        page,
        limit
      });

      res.status(200).json({
        success: true,
        data: accounts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAccountTree(req: Request, res: Response): Promise<void> {
    try {
      const tree = await accountService.getAccountTree();
      res.status(200).json({
        success: true,
        data: tree
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateAccount(req: Request, res: Response): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);
      const account = await accountService.updateAccount(id, req.body);
      res.status(200).json({
        success: true,
        data: account,
        message: 'Account updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);
      await accountService.deleteAccount(id);
      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAccountSummary(req: Request, res: Response): Promise<void> {
    try {
      const summary = await accountService.getAccountSummary();
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getParentOptions(req: Request, res: Response): Promise<void> {
    try {
      const options = await accountService.getParentOptions();
      res.status(200).json({
        success: true,
        data: options
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}