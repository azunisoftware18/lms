// src/modules/account/account.types.ts
export interface IAccount {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'INCOME' | 'EXPENSE';
  parentAccountId: string | null;
  openingBalance: number;
  currentBalance: number;
  status: 'ACTIVE' | 'INACTIVE';
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateAccountDTO {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'INCOME' | 'EXPENSE';
  parentAccountId?: string | null;
  openingBalance?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  description?: string;
}

export interface IUpdateAccountDTO {
  code?: string;
  name?: string;
  type?: 'ASSET' | 'LIABILITY' | 'INCOME' | 'EXPENSE';
  parentAccountId?: string | null;
  openingBalance?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  description?: string;
}

export interface IAccountFilters {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface IAccountResponse {
  success: boolean;
  data?: IAccount | IAccount[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}