// src/pages/DocumentsPage.jsx
import { useParams } from "react-router-dom";
import DocumentsTable from "../components/DocumentsTable";
import { documentTypes } from "../constants/documents";
import Layout from "../components/Layout";

function DocumentsPage() {
  const { type } = useParams(); // expects route like /documents/:type
  const docType = documentTypes.find(d => d.abbr === type.toUpperCase());

  if (!docType) return <p>Document type introuvable</p>;

  return (
    <Layout>

      <h1 className="text-left text-xl font-bold text-sofiblue">{docType.fullName}</h1>
      <DocumentsTable type={docType.abbr} />
    </Layout>
    
  );
}

export default DocumentsPage;
