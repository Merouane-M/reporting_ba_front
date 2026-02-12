import Layout from '../components/general/Layout';
import { documentTypes } from '../constants/documents'; 
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="w-full h-full p-24">
        {/* Top text */}
        <h1 className="text-center text-2xl font-semibold mb-6 text-gray-800">
          Veuillez choisir un type de documents
        </h1>
        
        {/* List of cards in two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
          {documentTypes.map((doc, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-white shadow-md hover:shadow-lg hover:border-sofiblue transition-shadow cursor-pointer"
              onClick={() => navigate(`/documents/${doc.abbr}`)} // <-- updated route
            >
              <div className="text-left text-xl font-bold text-sofiblue">
                {doc.abbr}
              </div>
              <div className="mt-2 text-lg text-gray-700">
                {doc.fullName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
