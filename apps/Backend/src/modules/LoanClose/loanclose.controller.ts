import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../../db/prismaService.js";

export const generateNOCPDFController = async (req: Request, res: Response) => {
  try {
    const loanAccountNumber =
      (req.params.loanAccountNumber as string) ||
      (req.params.loanNumber as string);

    if (!loanAccountNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Loan account number required" });
    }

    const loan = await prisma.loanApplication.findUnique({
      where: { loanNumber: loanAccountNumber },
      include: { customer: true },
    });

    if (!loan) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }

    const customerName = (loan.customer && (loan.customer as any).name) || "-";
    const loanType = (loan.loanTypeId as string) || "-";
    const closureDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const finalPayable = (loan.totalPayable ??
      loan.approvedAmount ??
      loan.requestedAmount) as number;

    const data = {
      nocNumber: `NOC-${loan.loanNumber}-${Date.now()}`,
      loanAccountNumber: loan.loanNumber,
      date: closureDate,
      customerName,
      loanType,
      closureDate,
      finalPayable: finalPayable ?? "",
    } as any;

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=NOC_${String(data.loanAccountNumber)}.pdf`,
    );

    doc.pipe(res);

    // Title
    doc
      .fontSize(16)
      .text("NO OBJECTION CERTIFICATE (NOC)", { align: "center" });
    doc
      .fontSize(10)
      .text("(System Generated – No Signature Required)", { align: "center" });

    doc.moveDown();

    // Bank Details
    doc.fontSize(12).text("Bank Details", { underline: true });
    doc.text(`Institution: ABC Bank Ltd.`);
    doc.text(`Branch: Main Branch`);

    doc.moveDown();

    // Reference
    doc.text("Reference Details", { underline: true });
    doc.text(`NOC No: ${data.nocNumber}`);
    doc.text(`Loan A/C No: ${data.loanAccountNumber}`);
    doc.text(`Date: ${data.date}`);

    doc.moveDown();

    // Customer
    doc.text("Customer Details", { underline: true });
    doc.text(`Name: ${data.customerName}`);

    doc.moveDown();

    // Loan Info
    doc.text("Loan Details", { underline: true });
    doc.text(`Loan Type: ${data.loanType}`);
    doc.text(`Closure Date: ${data.closureDate}`);
    if (data.finalPayable)
      doc.text(`Final Payment Amount: ₹${data.finalPayable}`);

    doc.moveDown();

    // Declaration
    doc.text("Declaration", { underline: true });
    doc.text(
      `This is to certify that ${data.customerName} has fully repaid the loan bearing account number ${data.loanAccountNumber}.`,
    );
    doc.text(
      `There are no outstanding dues and the loan account is closed. The bank has no objection.`,
    );

    doc.moveDown();

    doc.text("Generated On: " + new Date().toLocaleDateString());

    doc.end();
  } catch (error: any) {
    console.error("generateNOCPDFController error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate NOC PDF" });
  }
};

export default { generateNOCPDFController };
