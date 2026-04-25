// src/modules/account/account.service.ts
import PrismaClient from '@prisma/client';
import {
  ICreateAccountDTO,
  IUpdateAccountDTO,
  IAccountFilters,
  IAccount
} from './account.types.js';

const prisma = new PrismaClient();

export class AccountService {
  
  async createAccount(data: ICreateAccountDTO): Promise<IAccount> {
    // Check if account with same code exists
    const existingAccount = await prisma.account.findUnique({
      where: { code: data.code }
    });

    if (existingAccount) {
      throw new Error('Account with this code already exists');
    }

    const account = await prisma.account.create({
      data: {
        code: data.code,
        name: data.name,
        type: data.type,
        parentAccountId: data.parentAccountId || null,
        openingBalance: data.openingBalance || 0,
        currentBalance: data.openingBalance || 0,
        status: data.status || 'ACTIVE',
        description: data.description || null
      }
    });

    // Update parent's current balance if needed
    if (data.parentAccountId) {
      await this.updateParentBalance(data.parentAccountId);
    }

    return account as IAccount;
  }

  async getAccountById(id: string): Promise<IAccount | null> {
    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        parentAccount: true,
        childAccounts: true
      }
    });
    return account as IAccount | null;
  }

  async getAllAccounts(filters: IAccountFilters): Promise<{ accounts: IAccount[]; total: number }> {
    const { search, type, status, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        skip,
        take: limit,
        orderBy: { code: 'asc' },
        include: {
          parentAccount: {
            select: { id: true, code: true, name: true }
          }
        }
      }),
      prisma.account.count({ where })
    ]);

    return { accounts: accounts as IAccount[], total };
  }

  async getAccountTree(): Promise<any[]> {
    const accounts = await prisma.account.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { code: 'asc' }
    });

    return this.buildTree(accounts);
  }

  private buildTree(accounts: any[], parentId: string | null = null): any[] {
    return accounts
      .filter((acc: any) => acc.parentAccountId === parentId)
      .map((acc: any) => ({
        ...acc,
        children: this.buildTree(accounts, acc.id)
      }));
  }

  async updateAccount(id: string, data: IUpdateAccountDTO): Promise<IAccount> {
    // Check if account exists
    const existingAccount = await prisma.account.findUnique({
      where: { id }
    });

    if (!existingAccount) {
      throw new Error('Account not found');
    }

    // Check code uniqueness if code is being changed
    if (data.code && data.code !== existingAccount.code) {
      const codeExists = await prisma.account.findUnique({
        where: { code: data.code }
      });
      if (codeExists) {
        throw new Error('Account with this code already exists');
      }
    }

    // Prevent circular parent reference
    if (data.parentAccountId === id) {
      throw new Error('Cannot set account as its own parent');
    }

    const oldParentId = existingAccount.parentAccountId;
    const newParentId = data.parentAccountId;

    const updatedAccount = await prisma.account.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        type: data.type,
        parentAccountId: data.parentAccountId === null ? null : data.parentAccountId,
        status: data.status,
        description: data.description
      }
    });

    // Update balances if opening balance changed
    if (data.openingBalance !== undefined && data.openingBalance !== existingAccount.openingBalance) {
      await prisma.account.update({
        where: { id },
        data: { 
          openingBalance: data.openingBalance,
          currentBalance: data.openingBalance
        }
      });
    }

    // Update parent balances
    if (oldParentId !== newParentId) {
      if (oldParentId) await this.updateParentBalance(oldParentId);
      if (newParentId) await this.updateParentBalance(newParentId);
    }

    return updatedAccount as IAccount;
  }

  async deleteAccount(id: string): Promise<void> {
    // Check if account exists
    const account = await prisma.account.findUnique({
      where: { id },
      include: { childAccounts: true }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Check if account has child accounts
    if (account.childAccounts.length > 0) {
      throw new Error('Cannot delete account with child accounts. Delete or reassign child accounts first.');
    }

    const parentId = account.parentAccountId;

    await prisma.account.delete({ where: { id } });

    // Update parent balance
    if (parentId) {
      await this.updateParentBalance(parentId);
    }
  }

  private async updateParentBalance(parentId: string): Promise<void> {
    const childAccounts = await prisma.account.findMany({
      where: { parentAccountId: parentId }
    });

    const totalBalance = childAccounts.reduce((sum: number, acc: { currentBalance: number }) => sum + acc.currentBalance, 0);

    await prisma.account.update({
      where: { id: parentId },
      data: { currentBalance: totalBalance }
    });
  }

  async getAccountSummary(): Promise<any> {
    const accounts = await prisma.account.groupBy({
      by: ['type'],
      _sum: {
        currentBalance: true
      }
    });

    const totalAccounts = await prisma.account.count();
    const activeAccounts = await prisma.account.count({ where: { status: 'ACTIVE' } });

    return {
      totalAccounts,
      activeAccounts,
      inactiveAccounts: totalAccounts - activeAccounts,
      balanceByType: accounts.map((acc: any) => ({
        type: acc.type,
        totalBalance: acc._sum.currentBalance || 0
      }))
    };
  }

  async getParentOptions(): Promise<{ value: string; label: string }[]> {
    const accounts = await prisma.account.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { code: 'asc' }
    });
    
    return accounts.map((acc: any) => ({
      value: acc.id,
      label: `${acc.code} - ${acc.name}`
    }));
  }
}