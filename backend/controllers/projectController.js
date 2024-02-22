const mongoose = require('mongoose')
const { analyzeCode } = require('../nlp/nlpHandler');
const User = require('../models/userModel');
const Project = require('../models/projectModel')

// get all user's code projects
const viewProjects = async (req, res) => {
  const userId =  req.user.id;
  console.log("hello im in view projects");
  try {
    // Find the user by ID and populate the createdProjects field
    const user = await User.findById(userId).populate({
      path: 'createdProjects' // Sort in descending order
    });
    const createdProjects = user.createdProjects || [];
    if (createdProjects.length > 0) {
      // Sort projects by createdAt in descending order (most recent first)
      createdProjects.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    res.status(200).json(createdProjects);
  } catch (error) {
    console.error('Error fetching created projects:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// get a single project for view
const getProject = async (req, res) => {

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such e' })
    }
    // Find the project by ID
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'No such project' })
    }

    // Return project details (name, language, code, etc.)
    res.status(200).json({
      project
      // Add other relevant project details as needed
    });
  } catch (error) {
    console.error('Error fetching project:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const clearCodeStates= async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such porrj' })
  }
  try {
    const project = await Project.findById(id);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    // Retain only the first element of codeStates array
    project.codeStates = [project.codeStates[0]];

    // Save the updated project
    await project.save();

    res.status(200).json({ message: "Successfully updated project", project });
} catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal server error" });
}


};
// create a new code project
const createProject = async (req, res) => {
  const { prjName, progLang } = req.body;

  let emptyFields = [];

  if (!prjName) {
    emptyFields.push('prjName');
  }
  if (!progLang) {
    emptyFields.push('progLang');
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
  }

  // add to the database
  try {
    // Create the initial code state
    const initialCodeState = {
      codeIndex: 0,
      codeData: { fileName: "main." + progLang, code: "" }, // Set the initial code to an empty string
      diagramID: null, // You can set it to null or provide a default value
      OOPConcept: [],
    };
    
    // Create the project with the initial code state
    const project = await Project.create({
      prjName,
      progLang,
      codeStates: [initialCodeState], // Initialize with the initial code state
    });
    const userId =  req.user.id;; // Replace with the actual user ID

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { createdProjects: project._id } },
      { new: true }
    );
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId =  req.user.id;
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { createdProjects: id } },
    { new: true }
  );
  const project = await Project.findOneAndDelete({ _id: id })

  if (!project) {
    return res.status(400).json({ error: 'No such project' })
  }

  res.status(200).json("deleted")
}

const updateProject = async (req, res) => {

  const { id } = req.params;
  const updatedCode = req.body.codeData;
  console.log("updatedCode", updatedCode)
  // const updatedCodeString= 
  try {
    // only allow if its in the users created projects
    const project = await Project.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    // Find the latest code state and check if any file's code has changed
    const latestCodeState = project.codeStates.reduce((max, state) =>
      state.codeIndex > max.codeIndex ? state : max, { codeIndex: -1 });
  
      const isCodeChanged = updatedCode.some((updatedFile) => {
        const existingFile = latestCodeState.codeData.find(file =>
          (file.fileName === updatedFile.fileName && JSON.stringify(file.code) !== JSON.stringify(updatedFile.code)) ||
          !latestCodeState.codeData.some(existing => existing.fileName === updatedFile.fileName)
        );
        return existingFile !== undefined;
      });
      
      const isFileCountChanged = latestCodeState.codeData.length !== updatedCode.length;

      if (!isCodeChanged && !isFileCountChanged) {
        console.log("No code change or file count change");
        res.status(200).json("No code change or file count change");
      }
    else {
      // If the code has changed, proceed to create a new code state
      const newCodeIndex = latestCodeState.codeIndex + 1;
      const updatedCodeString= updatedCode.map(file => file.code.join('\n')).join('\n\n');
      let result;
      try {
        result = await analyzeCode(updatedCodeString, project.progLang);

  
      const classes = result.classes;
      const relationships = result.relationships;
      console.log("everything", result)
      console.log("asdfasdfadsfasdfsadfdsa")
      console.log(classes);
      console.log("asd", relationships);
      console.log("code", updatedCode);

      const newCodeState = {
        codeIndex: newCodeIndex,
        codeData: updatedCode,
        classes: classes,
        relationships: relationships
      };
      
      // Add the new code state to the project
      project.codeStates.push(newCodeState);
      await project.save();
      res.status(200).json(project);
    } catch (analyzeError) {
      console.error("Error analyzing code:", analyzeError);
      return res.status(500).json({ error: 'An error occurred while analyzing the code. Please try again.' });
    }
    }

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the project.' });
    throw new Error(`Error updating: ${error.message}`);

  }
};

const searchCreatedProjects = async (req, res) => {
  const userId =  req.user.id;
  const searchTerm = req.body.text;
  console.log("response:", searchTerm)
  // If the search term is empty, return a message indicating no search is performed
  if (!searchTerm.trim()) {
    return res.status(200).json({ message: 'Enter the name of an OOP concept'});
  }

  try {
    const user = await User.findById(userId).populate('createdProjects');

    // If the user or createdProjects array is empty, return a message indicating no projects are found
    if (!user || !user.createdProjects || user.createdProjects.length === 0) {
      return res.status(200).json({ message: 'No projects found.' });
    }

    // Filter projects based on the prjName containing the trimmed search term
    const matchingProjects = user.createdProjects.filter((project) =>
      project.prjName.toLowerCase().includes(searchTerm)
    );

    // If no matching projects are found, return a message indicating no results
    if (matchingProjects.length === 0) {
      return res.status(200).json({ message: 'No results found.' });
    }
    

    return res.status(200).json({ matchingProjects });
  } catch (error) {
    // Handle any errors that occur during the search
    console.error('Error searching tutorials:', error);
    return res.status(500).json({ message: 'An error occurred while searching tutorials.' });
  }
};
module.exports = {
  viewProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
  searchCreatedProjects,
  clearCodeStates
}