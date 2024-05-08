import React from 'react';
import Divider from "@mui/material/Divider";
import DocSelector from "./components/DocSelector";
import TitlesGrid from "./components/TitlesGrid";



function App() {

  return (
      <div>
        <DocSelector></DocSelector>
        <Divider>Saved Titles</Divider>
        <TitlesGrid></TitlesGrid>
      </div>
  );
}

export default App;