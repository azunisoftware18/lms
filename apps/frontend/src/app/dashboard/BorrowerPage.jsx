import { useState } from "react";

import { Icons } from "../../components/common/Icon";
import { borrowers as dummyBorrowers } from "../../lib/dashboardDummyData";

import Button from "../../components/ui/Button";
import SearchField from "../../components/ui/SearchField";

import { Table } from "../../components/tables";

import ActionMenu from "../../components/common/ActionMenu";

export default function BorrowerPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const borrowers = dummyBorrowers;

  const filteredBorrowers = borrowers.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Icons.Users className="text-blue-600" size={26} />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Borrower Management
            </h1>

            <p className="text-gray-500 text-sm">
              Manage borrower accounts and loan history
            </p>
          </div>
        </div>

        <Button>
          <Icons.UserPlus size={16} />
          <span className="text-sm font-medium">Add Borrower</span>
        </Button>
      </div>

      {/* SEARCH */}

      <div className="mb-6">
        <SearchField
          placeholder="Search borrower..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Phone</Table.Cell>
              <Table.Cell>Email</Table.Cell>
              <Table.Cell>Branch</Table.Cell>
              <Table.Cell>Status</Table.Cell>
              <Table.Cell>Action</Table.Cell>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {filteredBorrowers.map((b) => (
              <Table.Row key={b.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Icons.User size={16} />
                    </div>

                    {b.name}
                  </div>
                </Table.Cell>

                <Table.Cell>{b.phone}</Table.Cell>

                <Table.Cell>{b.email}</Table.Cell>

                <Table.Cell>{b.branch}</Table.Cell>

                <Table.Cell>
                  <span
                    className={`px-3 py-1 text-xs rounded-full
                    ${
                      b.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </Table.Cell>

                <Table.Cell>
                  <ActionMenu />
                </Table.Cell>
              </Table.Row>
            ))}

            {filteredBorrowers.length === 0 && (
              <Table.Empty text="No Borrowers Found" />
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
