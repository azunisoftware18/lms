import React from "react";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import { colorVariables as libColorVariables } from "../../lib";
import { SectionCard } from "./LoanApplication/sharedFields";
import { StepNavbar } from "./LoanApplication";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { useReUploadDocument } from "../../hooks/useLoanApplication";

export default function DocumentUploadForm({
  selectedApplication,
  uploadFiles,
  setUploadFiles,
  uploadDocumentsMutation,
  applicantRequiredDocs = [],
  applicantOptionalDocs = [],
  coApplicantRequiredDocs = [],
  coApplicantOptionalDocs = [],
  guarantorRequiredDocs = [],
  guarantorOptionalDocs = [],
  otherRequiredDocs = [],
  otherOptionalDocs = [],
  onClose,
  refetchDocuments,
  colorVariables,
  initialDocument = null,
}) {
  const cv = colorVariables || libColorVariables;
  const normalizeDocType = (type) =>
    type.trim().toUpperCase().replace(/\s+/g, "_");

  const steps = React.useMemo(
    () => [
      {
        id: "applicant",
        label: "Applicant",
        shortLabel: "Applicant",
        key: "applicant",
      },
      {
        id: "coApplicant",
        label: "Co-Applicant",
        shortLabel: "Co-App",
        key: "coApplicant",
      },
      {
        id: "guarantor",
        label: "Guarantor",
        shortLabel: "Guarantor",
        key: "guarantor",
      },
      { id: "other", label: "Other", shortLabel: "Other", key: "other" },
    ],
    [],
  );

  const [currentStep, setCurrentStep] = React.useState("applicant");

  // If initialDocument provided (from Actions -> Upload on a rejected doc),
  // determine the target party key and document type to focus only that input.
  const mapPartyKey = (applicantType) => {
    if (!applicantType) return "applicant";
    const t = String(applicantType).toLowerCase();
    if (t.includes("co")) return "coApplicant";
    if (t.includes("guarantor")) return "guarantor";
    if (t.includes("other")) return "other";
    return "applicant";
  };

  const initialTargetParty = initialDocument
    ? mapPartyKey(initialDocument.applicantType || initialDocument.party)
    : null;
  const initialTargetDocType = initialDocument
    ? normalizeDocType(
        initialDocument.name || initialDocument.documentType || "",
      )
    : null;

  React.useEffect(() => {
    if (initialTargetParty) {
      setCurrentStep(initialTargetParty);
      // scroll will be handled by the existing effect when currentStep changes
    }
  }, [initialTargetParty]);

  const completedSteps = React.useMemo(() => {
    return steps
      .filter((s) => {
        const files = uploadFiles?.[s.key] || {};
        return Object.keys(files).some((k) => files[k]);
      })
      .map((s) => s.id);
  }, [uploadFiles, steps]);

  // Reupload mutation hook (top-level to comply with Hooks rules)
  const reuploadMutation = useReUploadDocument();

  const containerRef = React.useRef(null);
  const applicantRef = React.useRef(null);
  const coApplicantRef = React.useRef(null);
  const guarantorRef = React.useRef(null);
  const otherRef = React.useRef(null);

  React.useEffect(() => {
    const container = containerRef.current;
    let refNode = null;
    switch (currentStep) {
      case "applicant":
        refNode = applicantRef.current;
        break;
      case "coApplicant":
        refNode = coApplicantRef.current;
        break;
      case "guarantor":
        refNode = guarantorRef.current;
        break;
      case "other":
        refNode = otherRef.current;
        break;
      default:
        refNode = null;
    }
    if (!refNode) return;
    if (container) {
      const offsetTop = refNode.offsetTop - container.offsetTop;
      container.scrollTo({
        top: Math.max(0, offsetTop - 16),
        behavior: "smooth",
      });
    } else {
      refNode.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!selectedApplication) return;

        // When re-uploading a single rejected document, skip global required-docs check
        if (!initialDocument) {
          const missingRequired = [];
          [
            { party: "applicant", docs: applicantRequiredDocs },
            { party: "coApplicant", docs: coApplicantRequiredDocs },
            { party: "guarantor", docs: guarantorRequiredDocs },
            { party: "other", docs: otherRequiredDocs },
          ].forEach(({ party, docs }) => {
            const partyFiles = uploadFiles[party] || {};
            docs.forEach((docType) => {
              if (!partyFiles[docType])
                missingRequired.push(`${party} - ${docType}`);
            });
          });

          if (missingRequired.length > 0) {
            toast.error(
              `Please upload all required documents: ${missingRequired.join(", ")}`,
            );
            return;
          }
        }

        // If this form was opened to re-upload a single rejected document,
        // call the re-upload endpoint for that document only.
        if (initialDocument) {
          try {
            // Find the selected file in uploadFiles matching the target
            const partyKey = initialTargetParty || "applicant";
            const filesForParty = uploadFiles[partyKey] || {};

            // Find key in filesForParty whose normalized type matches initialTargetDocType
            const matchingEntry = Object.entries(filesForParty).find(
              ([k, v]) => {
                if (!v) return false;
                return normalizeDocType(k) === initialTargetDocType;
              },
            );

            if (!matchingEntry) {
              toast.error(
                "Please choose a file for the selected document before re-uploading.",
              );
              return;
            }

            const [, file] = matchingEntry;
            if (!file) {
              toast.error(
                "Please choose a file for the selected document before re-uploading.",
              );
              return;
            }

            await reuploadMutation.mutateAsync({
              loanApplicationId: selectedApplication.id,
              documentType: initialTargetDocType,
              file,
            });

            toast.success("Document re-uploaded successfully");
            // clear the single file
            setUploadFiles((f) => ({
              ...f,
              [partyKey]: { ...f[partyKey], [matchingEntry[0]]: null },
            }));
            onClose && onClose();
            refetchDocuments && refetchDocuments();
            return;
          } catch (err) {
            toast.error("Re-upload failed");
            return;
          }
        }

        const allEntries = [];
        ["applicant", "coApplicant", "guarantor", "other"].forEach((party) => {
          Object.entries(uploadFiles[party] || {}).forEach(
            ([docType, file]) => {
              if (file) allEntries.push({ party, docType, file });
            },
          );
        });

        if (allEntries.length === 0) {
          toast.error("Please select at least one document to upload.");
          return;
        }

        const filesPayload = allEntries.map((entry) => ({
          file: entry.file,
          documentType: normalizeDocType(entry.docType),
        }));

        await uploadDocumentsMutation.mutateAsync({
          id: selectedApplication.id,
          files: filesPayload,
        });

        toast.success("Documents uploaded successfully");
        setUploadFiles({
          applicant: {},
          coApplicant: {},
          guarantor: {},
          other: {},
        });
        onClose && onClose();
        refetchDocuments && refetchDocuments();
      }}
    >
      <div
        ref={containerRef}
        className="w-full max-h-[75vh] overflow-y-auto pr-2 bg-"
      >
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upload Documents</h2>
            <div className="ml-4 text-sm text-gray-600">
              Application:{" "}
              {selectedApplication?.loanNumber || selectedApplication?.id}
            </div>
          </div>
        </div>

        {!initialDocument && (
          <StepNavbar
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={(id) => setCurrentStep(id)}
          />
        )}

        <div className="grid grid-cols-1 gap-6">
          {currentStep === "applicant" && (
            <div ref={applicantRef}>
              <SectionCard title="Applicant Documents" icon={Upload}>
                <div className="text-sm text-slate-500 mb-4">
                  {applicantRequiredDocs.length} required — upload PDFs or
                  images
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ...applicantRequiredDocs.map((d) => ({
                      type: d,
                      required: true,
                    })),
                    ...applicantOptionalDocs.map((d) => ({
                      type: d,
                      required: false,
                    })),
                  ]
                    .filter(({ type }) => {
                      if (!initialTargetDocType) return true;
                      return normalizeDocType(type) === initialTargetDocType;
                    })
                    .map(({ type, required }) => {
                      const id = `file-applicant-${type}`;
                      const filename =
                        uploadFiles?.applicant?.[type]?.name || "";
                      return (
                        <div key={type} className="flex flex-col">
                          <InputField
                            label={type}
                            isRequired={required}
                            placeholder={required ? "Required" : "Optional"}
                            value={filename}
                            readOnly
                            containerClassName="mb-0"
                          />
                          <div className="mt-2 flex gap-2">
                            <input
                              id={id}
                              type="file"
                              accept="application/pdf,image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                setUploadFiles((f) => ({
                                  ...f,
                                  applicant: { ...f.applicant, [type]: file },
                                }));
                              }}
                            />
                            <Button
                              variant="outline"
                              className="px-2! py-1! font-xs! rounded! "
                              onClick={() =>
                                document.getElementById(id).click()
                              }
                            >
                              Choose file
                            </Button>
                            <div className="text-sm text-gray-500 self-center">
                              {filename || "No file chosen"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </SectionCard>
            </div>
          )}

          {currentStep === "coApplicant" && (
            <div ref={coApplicantRef}>
              <SectionCard title="Co-Applicant Documents" icon={Upload}>
                <div className="text-sm text-slate-500 mb-4">
                  {coApplicantRequiredDocs.length} required
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ...coApplicantRequiredDocs.map((d) => ({
                      type: d,
                      required: true,
                    })),
                    ...coApplicantOptionalDocs.map((d) => ({
                      type: d,
                      required: false,
                    })),
                  ]
                    .filter(({ type }) => {
                      if (!initialTargetDocType) return true;
                      return normalizeDocType(type) === initialTargetDocType;
                    })
                    .map(({ type, required }) => {
                      const id = `file-coApplicant-${type}`;
                      const filename =
                        uploadFiles?.coApplicant?.[type]?.name || "";
                      return (
                        <div key={type} className="flex flex-col">
                          <InputField
                            label={type}
                            isRequired={required}
                            placeholder={required ? "Required" : "Optional"}
                            value={filename}
                            readOnly
                            containerClassName="mb-0"
                          />
                          <div className="mt-2 flex gap-2">
                            <input
                              id={id}
                              type="file"
                              accept="application/pdf,image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                setUploadFiles((f) => ({
                                  ...f,
                                  coApplicant: {
                                    ...f.coApplicant,
                                    [type]: file,
                                  },
                                }));
                              }}
                            />
                            <Button
                              variant="outline"
                              className="px-2! py-1! font-xs! rounded! "
                              onClick={() =>
                                document.getElementById(id).click()
                              }
                            >
                              Choose file
                            </Button>
                            <div className="text-sm text-gray-500 self-center">
                              {filename || "No file chosen"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </SectionCard>
            </div>
          )}

          {currentStep === "guarantor" && (
            <div ref={guarantorRef}>
              <SectionCard title="Guarantor Documents" icon={Upload}>
                <div className="text-sm text-slate-500 mb-4">
                  {guarantorRequiredDocs.length} required
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ...guarantorRequiredDocs.map((d) => ({
                      type: d,
                      required: true,
                    })),
                    ...guarantorOptionalDocs.map((d) => ({
                      type: d,
                      required: false,
                    })),
                  ]
                    .filter(({ type }) => {
                      if (!initialTargetDocType) return true;
                      return normalizeDocType(type) === initialTargetDocType;
                    })
                    .map(({ type, required }) => {
                      const id = `file-guarantor-${type}`;
                      const filename =
                        uploadFiles?.guarantor?.[type]?.name || "";
                      return (
                        <div key={type} className="flex flex-col">
                          <InputField
                            label={type}
                            isRequired={required}
                            placeholder={required ? "Required" : "Optional"}
                            value={filename}
                            readOnly
                            containerClassName="mb-0"
                          />
                          <div className="mt-2 flex gap-2">
                            <input
                              id={id}
                              type="file"
                              accept="application/pdf,image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                setUploadFiles((f) => ({
                                  ...f,
                                  guarantor: { ...f.guarantor, [type]: file },
                                }));
                              }}
                            />
                            <Button
                              variant="outline"
                              className="px-2! py-1! font-xs! rounded! "
                              onClick={() =>
                                document.getElementById(id).click()
                              }
                            >
                              Choose file
                            </Button>
                            <div className="text-sm text-gray-500 self-center">
                              {filename || "No file chosen"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </SectionCard>
            </div>
          )}

          {currentStep === "other" && (
            <div ref={otherRef}>
              <SectionCard title="Other Documents" icon={Upload}>
                <div className="text-sm text-slate-500 mb-4">
                  {otherRequiredDocs.length} required
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ...otherRequiredDocs.map((d) => ({
                      type: d,
                      required: true,
                    })),
                    ...otherOptionalDocs.map((d) => ({
                      type: d,
                      required: false,
                    })),
                  ]
                    .filter(({ type }) => {
                      if (!initialTargetDocType) return true;
                      return normalizeDocType(type) === initialTargetDocType;
                    })
                    .map(({ type, required }) => {
                      const id = `file-other-${type}`;
                      const filename = uploadFiles?.other?.[type]?.name || "";
                      return (
                        <div key={type} className="flex flex-col">
                          <InputField
                            label={type}
                            isRequired={required}
                            placeholder={required ? "Required" : "Optional"}
                            value={filename}
                            readOnly
                            containerClassName="mb-0"
                          />
                          <div className="mt-2 flex gap-2">
                            <input
                              id={id}
                              type="file"
                              accept="application/pdf,image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                setUploadFiles((f) => ({
                                  ...f,
                                  other: { ...f.other, [type]: file },
                                }));
                              }}
                            />
                            <Button
                              variant="outline"
                              className="px-2! py-1! font-xs! rounded! "
                              onClick={() =>
                                document.getElementById(id).click()
                              }
                            >
                              Choose file
                            </Button>
                            <div className="text-sm text-gray-500 self-center">
                              {filename || "No file chosen"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </SectionCard>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={() => onClose && onClose()}>
          Cancel
        </Button>
        <Button
          type="submit"
          className={`${cv.PRIMARY_BUTTON_COLOR} text-white`}
        >
          Submit All
        </Button>
      </div>
    </form>
  );
}
