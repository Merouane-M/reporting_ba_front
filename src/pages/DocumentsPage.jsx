import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDocument } from "../context/DocumentContext";
import { documentTypes } from "../constants/documents";
import DocumentsTable from "../components/DocumentsTable";
import Layout from "../components/general/Layout";
import { PlusIcon } from "@heroicons/react/24/outline";
import DocumentModal from "../components/deeform/DocumentModal";

function DocumentsPage() {
  const { type } = useParams();
  const { document, setDocument } = useDocument();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();

  const upperType = type?.toUpperCase();

  const docType = documentTypes.find(
    (d) => d.abbr === upperType
  );

  // this component is only source of truth for Document context 
  useEffect(() => {
    if (upperType) {
      setDocument(upperType);
    }
  }, [upperType, setDocument]);

  if (!docType) {
    return (
      <Layout>
        <p className="p-6 text-center text-red-600 font-semibold">
          Document type introuvable
        </p>
      </Layout>
    );
  }

  const handleAdd = () => {
    // Navigate to /documents/:type/create using the type from context (document)
    // Assuming document is uppercase (e.g., "DEE"), and your route param expects it that way
    navigate(`/documents/${document}/create`);
  };

  return (
    <Layout>
      <div className="flex flex-col w-9/10">
        <div className="flex flex-row justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-sofiblue">
            {docType.fullName}
          </h1>

          <button
            className="btn btn-primary gap-1 w-1/5 flex items-center justify-center"
            onClick={handleAdd}
            title="Add"
          >
            <PlusIcon className="h-5 w-5" />
            Ajouter
          </button>
        </div>

        <DocumentsTable type={upperType} />
      </div>
      <DocumentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        documentType={document}
      />
    </Layout>
  );
}

export default DocumentsPage;