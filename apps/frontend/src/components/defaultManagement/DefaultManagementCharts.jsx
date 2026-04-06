export default function DefaultManagementCharts({ rows }) {
  const getOutstanding = (loan) =>
    Number(
      loan.loanRecoveries?.[0]?.balanceAmount ??
        loan.outstandingAmount ??
        loan.approvedAmount ??
        0,
    );

  const maxOutstanding = Math.max(
    ...rows.map((r) => getOutstanding(r)),
    1,
  );

  const dpdBuckets = [
    { range: "0-30 days", color: "bg-green-500", min: 0, max: 30 },
    { range: "31-60 days", color: "bg-yellow-500", min: 31, max: 60 },
    { range: "61-90 days", color: "bg-orange-500", min: 61, max: 90 },
    { range: "90+ days", color: "bg-red-500", min: 91, max: Infinity },
  ];

  const stageDistribution = Object.entries(
    rows.reduce((acc, loan) => {
      const stage = loan.loanRecoveries?.[0]?.recoveryStage || "INITIAL_CONTACT";
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700">Outstanding Balance by Loan</h3>
            <span className="text-xs text-slate-400">Amount in ₹</span>
          </div>
          {rows.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
              No data available
            </div>
          ) : (
            <div className="h-64 flex items-end gap-2 overflow-x-auto">
              {rows.map((loan) => {
                const outstanding = getOutstanding(loan);
                const height = maxOutstanding > 0 ? (outstanding / maxOutstanding) * 100 : 0;
                return (
                  <div key={loan.id} className="flex-1 min-w-[92px] h-full flex flex-col justify-end">
                    <div className="h-[calc(100%-42px)] flex items-end">
                      <div
                        className="w-full bg-blue-600 rounded-t-md transition-all duration-500"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                    <div className="text-xs mt-2 font-medium truncate w-full text-center">{loan.loanNumber}</div>
                    <div className="text-[10px] text-slate-400 text-center">₹{outstanding.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700">DPD Distribution</h3>
            <span className="text-xs text-slate-400">Days Past Due</span>
          </div>
          <div className="space-y-3">
            {dpdBuckets.map((bucket) => {
              const count = rows.filter((l) => l.dpd >= bucket.min && l.dpd <= bucket.max).length;
              const percentage = rows.length > 0 ? (count / rows.length) * 100 : 0;
              return (
                <div key={bucket.range}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{bucket.range}</span>
                    <span className="font-medium">{count} loans ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${bucket.color} h-2 rounded-full`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-700">Recovery Stage Distribution</h3>
          <span className="text-xs text-slate-400">Current status</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {stageDistribution.map(([stage, count]) => {
            const percentage = rows.length > 0 ? (count / rows.length) * 100 : 0;
            return (
              <div key={stage} className="flex-1 min-w-[120px]">
                <div className="text-sm font-medium text-slate-600">{stage.replace(/_/g, " ")}</div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{percentage.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
