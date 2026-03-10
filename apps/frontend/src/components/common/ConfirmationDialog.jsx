import React, { useEffect, useState } from "react";
import { AlertTriangle, Loader2, MessageSquare } from "lucide-react";
import TextAreaField from "../ui/TextAreaField";
import Button from "../ui/Button";

export default function ConfirmationDialog({
    open,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
    variant = "danger",
    showRemark = false,
    isPopup = false,
    children,
}) {
    const [remark, setRemark] = useState("");

    useEffect(() => {
        if (open) setRemark("");
    }, [open, title]);

    if (!open) return null;

    const handleConfirm = () => {
        onConfirm(remark);
    };

    const containerClasses = isPopup
        ? "fixed inset-0 z-[100] flex items-center justify-center p-4"
        : "w-full max-w-md mx-auto";

    const contentClasses = isPopup
        ? "relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100"
        : "bg-white w-full rounded-2xl border border-slate-200 overflow-hidden shadow-sm";

    return (
        <div className={containerClasses}>
            {isPopup && (
                <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={!loading ? onCancel : undefined}
                />
            )}

            <div className={contentClasses}>
                <div className="p-6 pb-4 flex flex-col items-center text-center">
                    <div className={`mb-4 p-3 rounded-full ${variant === 'danger' ? 'bg-red-50' : 'bg-blue-50'}`}>
                        <AlertTriangle className={`w-8 h-8 ${variant === 'danger' ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <p className="mt-1 text-slate-500 text-sm leading-relaxed">{description}</p>
                </div>

                {children && (
                    <div className="mx-6 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                        {children}
                    </div>
                )}

                {showRemark && (
                    <div className="px-6 mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">
                            Reason / Remark *
                        </label>
                        <TextAreaField
                            placeholder="Provide reason for this action..."
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            rows={3}
                            isDisabled={loading}
                            icon={MessageSquare}
                        />
                    </div>
                )}

                <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3 bg-slate-50/50 mt-2">
                    {/* Cancel Button - Custom Component */}
                    <Button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600! bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800! transition-all flex items-center justify-center text-center"
                    >
                        {cancelText}
                    </Button>

                    {/* Confirm Button - Custom Component */}
                    <Button
                        type="button"
                        disabled={loading || (showRemark && !remark.trim())}
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2
              ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}