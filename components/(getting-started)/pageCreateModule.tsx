import React from 'react';
import CreateModule from '../(general)/createModule';

const PageCreateModule = ({ setUserChoices, newModule, setNewModule}) => {  
  return (
    <CreateModule newModule={newModule} setNewModule={setNewModule} setUserChoices={setUserChoices}/>
  )
}

export default PageCreateModule