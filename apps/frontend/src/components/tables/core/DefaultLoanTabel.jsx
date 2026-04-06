import React from "react";
import { TableShell, TableHead, TableBody } from "./index";
import { Eye, RefreshCw, FilePlus, MessageCircle } from "lucide-react";

export default function DefaultLoanTabel({
	data = [],
	loading = false,
	onView = () => {},
	onCheck = () => {},
	onCreateRecovery = () => {},
	onAddNote = () => {},
}) {
	const columns = [
		{ header: "Loan #", accessor: "loanNumber" },
		{
			header: "Customer",
			accessor: "customer",
			render: (_, row) => (
				<div className="flex flex-col">
					<span className="font-medium">{`${row.customer?.firstName || ""} ${row.customer?.lastName || ""}`}</span>
					<span className="text-xs text-slate-400">{row.customer?.contactNumber}</span>
					{row.customer?.panNumber && (
						<span className="text-xs text-slate-400">PAN: {row.customer.panNumber}</span>
					)}
				</div>
			),
		},
		{ header: "Branch", accessor: "branchName", render: (v) => v || "-" },
		{ header: "Loan Type", accessor: "loanType", render: (v) => v || "-" },
		{ header: "Approved", accessor: "approvedAmount", render: (v) => (v != null ? `₹${v}` : "-") },
		{ header: "Outstanding", accessor: "outstanding", render: (v) => (v != null ? `₹${v}` : "-") },
		{ header: "Recovered", accessor: "recoveredAmount", render: (v) => (v != null ? `₹${v}` : "-") },
		{ header: "DPD", accessor: "dpd" },
		{ header: "Recovery Stage", accessor: "recoveryStage", render: (v) => v || "-" },
		{ header: "Recovery Status", accessor: "recoveryStatus", render: (v) => v || "-" },
		{ header: "Assigned To", accessor: "assignedTo", render: (v) => v || "-" },
		{ header: "Last Payment", accessor: "lastPaymentDate", render: (v) => (v ? new Date(v).toLocaleDateString() : "-") },
		{ header: "Defaulted At", accessor: "defaultedAt", render: (v) => (v ? new Date(v).toLocaleDateString() : "-") },
	];

	// Normalize rows so TableBody can render simple accessors
	const rows = (data || []).map((r) => ({
		id: r.id,
		loanNumber: r.loanNumber,
		customer: r.customer,
		branchName: r.branchName || r.branchId || "-",
		loanType: r.loanType || r.loanTypeName || "-",
		dpd: r.dpd,
		approvedAmount: r.approvedAmount,
		outstanding:
			r.loanRecoveries && r.loanRecoveries.length
				? r.loanRecoveries[0].balanceAmount
				: r.outstandingAmount ?? null,
		recoveredAmount:
			r.loanRecoveries && r.loanRecoveries.length
				? r.loanRecoveries[0].recoveredAmount
				: 0,
		recoveryStage:
			r.loanRecoveries && r.loanRecoveries.length
				? r.loanRecoveries[0].recoveryStage
				: "INITIAL_CONTACT",
		recoveryStatus:
			r.loanRecoveries && r.loanRecoveries.length
				? r.loanRecoveries[0].recoveryStatus
				: "ONGOING",
		assignedTo: r.assignedTo || r.recoveryOfficer || null,
		lastPaymentDate: r.lastPaymentDate || r.lastPayment || null,
		defaultedAt: r.defaultedAt,
		raw: r,
	}));

	const actions = (row) => [
		{
			label: "View",
			inline: true,
			icon: <Eye size={14} />,
			onClick: () => onView(row),
		},
		{
			label: "Check",
			inline: true,
			icon: <RefreshCw size={14} />,
			onClick: () => onCheck(row.id),
		},
		{
			label: "Create Recovery",
			onClick: () => onCreateRecovery(row.id),
		},
		{
			label: "Add Note",
			onClick: () => onAddNote(row.id),
		},
	];

	return (
		<TableShell>
			<TableHead columns={columns} title={`Defaulted Loans (${rows.length})`} />
			<TableBody columns={columns} data={rows} actions={actions} />
		</TableShell>
	);
}

