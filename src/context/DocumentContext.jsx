// src/context/DocumentContext.jsx
import { createContext, useContext, useState } from "react";

// 1. Create context
const DocumentContext = createContext();

// 2. Provider
export const DocumentProvider = ({ children }) => {
  const [document, setDocument] = useState(null); // default null

  return (
    <DocumentContext.Provider value={{ document, setDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};

// 3. Custom hook
export const useDocument = () => useContext(DocumentContext);
