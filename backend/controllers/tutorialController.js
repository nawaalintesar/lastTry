const Tutorial = require('../models/tutorialModel')
const User = require('../models/userModel');
const mongoose = require('mongoose')
const fs = require('node:fs');
const nlpHandler = require('../nlp/nlpHandler');
// const TutorialTest = require('../models/tutorialsTest')

// get all tutorials
const viewTutorials = async (req, res) => {
  const tutorials = await Tutorial.find({}).sort({ updatedAt: 1 })
  res.status(200).json(tutorials)
}


// get a single tutorial for view
const getTutorial = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such ' })
  }

  const tutorial = await Tutorial.findById(id);
  // console.log(tutorial)
  if (!tutorial) {
    return res.status(404).json({ error: 'No such tutorial' })
  }

  res.status(200).json(tutorial) //right now gets the whole tutorial this should take only the description to be displayed on the tutorial page
}


const ObjectId = mongoose.Types.ObjectId;

const enrollTutorial = async (req, res) => {
  const userID = req.body.userID;
  const selectedLanguage = req.body.selectedLanguage; // Assuming the selected language is in the request body

  const tutorialId = req.params.id.toString();

  try {
    // get user information
    const user = await User.findById(userID);

    // Check if the tutorial exists
    const tutorial = await Tutorial.findById(tutorialId);

    console.log("ID IS ACTUALLY", tutorial ? tutorial._id : 'Not Found');

    if (!tutorial) {
      console.error('Tutorial not found 215');
      return res.status(404).json({ error: 'Tutorial not found 215' });
    }

    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is already enrolled in the tutorial
    const tutorialFound = await User.findOne({ enrolledTutorials: new ObjectId(tutorialId) });

    if (tutorialFound) {
      console.error('Tutorial already enrolled');
      return res.status(400).json({ error: 'Tutorial already enrolled' });
    } else {
      // Enroll the user in the tutorial with the selected language
      const result = await User.updateOne(
        { _id: new ObjectId(userID) },
        {
          $addToSet: {
            enrolledTutorials: {
              tutId: new ObjectId(tutorial._id),
              progLang: selectedLanguage,
            },
          },
        }
      );

      console.log(`Tutorial with ID ${tutorial._id} enrolled successfully for user with ID ${userID}`);
      res.status(200).json({ message: 'Tutorial enrolled successfully' });
    }
  } catch (error) {
    console.error('Error enrolling tutorial:', error.message);
    res.status(500).json({ error: error.message });
  }
};


const getEnrolledTutorials = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("hi");
    // Find the user by ID and populate the enrolledTutorials field
    const user = await User.findById(userId).populate({
      path: 'enrolledTutorials.tutId',
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const enrolledTutorials = user.enrolledTutorials || [];

    // Map the enrolledTutorials array to include only the necessary information
    const formattedEnrolledTutorials = enrolledTutorials.map((enrolledTutorial) => {
      return {
        tutId: enrolledTutorial.tutId,
        progLang: enrolledTutorial.progLang
      };
    });

    if (formattedEnrolledTutorials.length > 0) {
      // Sort tutorials by updatedAt in descending order (most recent first)
      formattedEnrolledTutorials.sort((a, b) => b.tutId.updatedAt - a.tutId.updatedAt);
    }

    res.status(200).json({ enrolledTutorials: formattedEnrolledTutorials });
  } catch (error) {
    console.error('Error fetching enrolled tutorials:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const searchAllTutorials = async (req, res) => {
  const searchTerm = req.body.text;
  console.log("response:", searchTerm)
  // If the search term is empty, return a message indicating no search is performed
  if (!searchTerm) {
    return res.status(200).json({ message: 'Enter the name of an OOP concept'});
  }

  try {
    // Perform case-insensitive search on the tutName field using regex
    const searchResults = await Tutorial.find({
      tutName: { $regex: searchTerm, $options: 'i' }
    });
    
    // If no results are found, return a message indicating no results
    if (searchResults.length === 0) {
      return res.status(200).json({ message: 'No results found.' });
    }

    return res.status(200).json({ searchResults });
  } catch (error) {
    // Handle any errors that occur during the search
    console.error('Error searching tutorials:', error);
    return res.status(500).json({ message: 'An error occurred while searching tutorials.' });
  }
};

const updateProgress = async (req, res) => {
  const userId = req.body.userId;
  const tutorialId = req.body.tutorialId;
  const progLang = req.body.progLang;
  const levelNumber = req.body.levelNumber;

  try {
    // Find the user and the enrolled tutorial
    const user = await User.findById(userId).populate('enrolledTutorials.tutId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const enrolledTutorial = user.enrolledTutorials.find(tutorial => tutorial.tutId._id.toString() === tutorialId && tutorial.progLang.toLowerCase() === progLang.toLowerCase());
    if (!enrolledTutorial) {
      return res.status(404).json({ message: `Tutorial not found for user ${userId} and progLang ${progLang}` });
    }

    const totalSteps = enrolledTutorial.tutId.level
      .filter(level => level.progLang.toLowerCase() === progLang.toLowerCase())
      .reduce((acc, level) => acc + level.noTutSteps, 0);

    if (enrolledTutorial.progress + 1 <= totalSteps) {
      enrolledTutorial.progress += 1;
      // Save the changes to the database
      await user.save();
      console.log("hello", enrolledTutorial.progress)
    }

    res.status(200).json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};


const calculateProgress = async (req, res) => {
  const userId = req.body.userId;
  const tutorialId = req.body.tutorialId;
  const progLang = req.body.progLang;
  const user = await User.findById(userId).populate('enrolledTutorials.tutId');

  if (!user) {
      throw new Error('User not found');
  }

  const enrolledTutorial = user.enrolledTutorials.find(tutorial => tutorial.tutId._id.toString()===tutorialId.toString() && tutorial.progLang.toLowerCase() === progLang.toLowerCase());

  if (!enrolledTutorial) {
    return res.status(404).json({message: `User has not enrolled in any tutorial with ID ${tutorialId} for ${progLang} hehe ${enrolledTutorial}`});
  }

  const totalSteps = enrolledTutorial.tutId.level
  .filter(level => level.progLang.toLowerCase() === progLang.toLowerCase())
  .reduce((acc, level) => acc + level.noTutSteps, 0);

console.log("tasdfasd", totalSteps)
  const completedSteps = enrolledTutorial.progress;
  let progress = (completedSteps / totalSteps) * 100;
  progress = isNaN(progress) ? 0:progress;

  console.log("Asdf", completedSteps, progress);
  return res.status(200).json({progress});
};

const classifyTutorial = async (req, res) => {
  try {
    // Extract parameters from query string
    const { code, progLang } = req.body;
    console.log(code, "This is from backend");
    console.log(progLang, "This is from backend too");

    // Your existing logic here
    const result = await nlpHandler.analyzeCode(code, progLang.toLowerCase());
    console.log(result);
    const classes = result.classes;
    const relationship = result.relationship;

    console.log(classes);
    console.log(relationship);

    res.status(200).json({ classes, relationship });
  } catch (error) {
    console.error('Error in classifyTutorial:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//new function to test
const populateDatabase = async (req, res) => {

  // Example usage
  console.log("Inside new func");
  const path = require('path');
  const paths = [
    path.join(__dirname, '../models/Tutorials/Classes.txt'),
    path.join(__dirname, '../models/Tutorials/Encapsulation.txt'),
    path.join(__dirname, '../models/Tutorials/Abstract.txt'),
    path.join(__dirname, '../models/Tutorials/Over.txt'),
    path.join(__dirname, '../models/Tutorials/Inheritance.txt'),
    path.join(__dirname, '../models/Tutorials/Interfaces.txt'),
    path.join(__dirname, '../models/Tutorials/Polymorphism.txt'),
    path.join(__dirname, '../models/Tutorials/Combined.txt'),
  ];
  try {
    for (const filePath of paths) {
      // Read the content of the file
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Split the file content by lines
      const lines = fileContent.split('\n');
      // Initialize variables
      let tutName = lines[0];
      let tutDescription = "";
      let level = [];
      let progLang = "";
      let levelNumber = 0;
      let codeData = [];
      let tutorialSteps = [];
      let noTutSteps = 0;
      let currentFileName = null;
      let classes = [];
      let relationship = [];
      // Process each line


      for (const line of lines) {
        // Check for the first line and assign it to tutName
        if (!tutName && !line.startsWith('//')) {
          tutName = line.trim();
          continue; // Skip to the next iteration
        }
        // Check for the line that starts with //Tutorial Description
        if (line.startsWith('//Tutorial Description')) {
          // Read lines assign them to tutDescription
          let currentIndex = lines.indexOf(line) + 1; // Move to the next line
          while (currentIndex < lines.length && !lines[currentIndex].startsWith('//DescriptionEnd')) {
            tutDescription += lines[currentIndex] + '\n';
            currentIndex++;
          }
          continue; // Skip to the next iteration
        }
        // Check for the line that starts with //Level
        if (line.startsWith('//Level')) {
          // If this is not the first level, push the previous level information to the level array
          if (levelNumber !== 0) {
            // level.push({
            //   levelNumber,
            //   progLang,
            //   codeData: codeData,
            //   noTutSteps: tutorialSteps.length,
            //   tutorialSteps: tutorialSteps,
            //   classes: classes,
            //   relationships: relationship


            // });

            // Reset arrays for the new level
            codeData = [];
            tutorialSteps = [];
            noTutSteps = 0;
            classes = [];
            relationships = [];
          }

          // Check for the line that starts with //Level
          if (line.startsWith('//Level')) {
            // Split from the character 1- and get level number and language
            const regex = /\/\/Level (\d+)- (\S+)/;
            const match = line.match(regex);

            if (match) {
              levelNumber = parseInt(match[1], 10);
              progLang = match[2].trim();

              // Check for the code section
              let isCodeSection = false;
              let currentFileName = null;
              let code = []; // Initialize code array

              // Iterate through the lines to read code until //Steps
              for (let i = lines.indexOf(line) + 1; i < lines.length; i++) {
                if (lines[i].startsWith('//Code')) {
                  isCodeSection = true;
                  continue;
                } else if (lines[i].startsWith('//Steps')) {
                  break; // Stop when reaching "//Steps"
                }

                if (isCodeSection) {
                  // Check for the presence of "***" indicating a new file name
                  if (lines[i].trim() === '***') {
                    // Save the previous file's code and start a new file
                    if (currentFileName && code.length > 0) {
                      console.log("No. of tut steps", noTutSteps);
                      console.log(progLang);
                      // const fileNameWithoutExtension = currentFileName.replace(/\.[^/.]+$/, "");
                      // const outputFile = path.join(__dirname, 'output', `${fileNameWithoutExtension}_code.txt`);
                      // fs.writeFileSync(outputFile, codeString, 'utf8');

                      codeData.push({ fileName: currentFileName, code: code });
                      currentFileName = null;
                      code = [];

                    }
                    continue;
                  }

                  // If not "***", consider it as code
                  if (!currentFileName) {
                    // The line after "***" is the new file name, default to "main.js" if empty
                    currentFileName = lines[i].trim() || 'main.js';
                    //console.log("filename", currentFileName);
                  } else {
                    code.push(lines[i]);
                    //console.log(lines[i]);
                  }
                }
              }

              // Save the last file's code if any
              if (currentFileName && code.length > 0) {
                codeData.push({ fileName: currentFileName, code: code });

              }

              let codeString = "";

              for (let index in codeData) { //line here is index going through each file in the project 
                for (let line in codeData[index]) { //going through keys in code data 
                  console.log(line);
                  if (line == "code") {
                    console.log("yes");
                    for (let ind in codeData[index].code) {
                      const currentLine = codeData[index].code[ind];
                      if (currentLine.includes("import")) {
                        // If it contains the word "import" and doesn't exist in codeString, push it to the beginning
                        if (!codeString.includes(currentLine)) {
                          codeString = `${currentLine}\n${codeString}`;
                        }
                      } 
                      else {
                       
                          codeString += `${currentLine}\n`;
                        
                      }
                    }
        
                  }
                }
              }
              console.log("codeString is", codeString);
              console.log(progLang);
              if (progLang != 'C++') {
                const result = await nlpHandler.analyzeCode(codeString, progLang.toLowerCase());
                classes = result.classes;
                relationship = result.relationships;
                console.log("pushing", relationship);
              }
        
        
            
        
              let isStepsSection = false;

              for (let i = lines.indexOf(line) + 1; i < lines.length; i++) {
                // Check for the line that starts with //Steps
                if (lines[i].startsWith('//Steps')) {
                  // console.log(lines[i])
                  isStepsSection = true;
                  continue;

                }

                // Read lines until the string '--------------' and assign them to steps
                if (isStepsSection) {
                  if (lines[i].startsWith('--------------')) {
                    isStepsSection = false;
                    break; // Stop when reaching '--------------'
                  }

                  tutorialSteps.push(lines[i].trim());
                  // console.log(tutorialSteps);
                  noTutSteps = tutorialSteps.length;
                }
              }

              //here
              if (levelNumber !== 0) {
        
                level.push({
                  levelNumber,
                  progLang,
                  codeData: codeData,
                  tutorialSteps: tutorialSteps,
                  noTutSteps:tutorialSteps.length,
                  classes: classes,
                relationships: relationship
                });
              }
              
            }
          }
        }
      }

      const existingTutorial = await Tutorial.findOne({ tutName });

      if (existingTutorial) {
        existingTutorial.tutDescription = tutDescription;
        existingTutorial.level = level;
        await existingTutorial.save();

      }
      else {
        // Save the tutorial to the database
        const project = await Tutorial.create({
          tutName,
          tutDescription,
          level
        });
      }
      console.log('Database populated successfully!');
    }
  } catch (error) {
    res.status(500).json("error")
    console.error('Error populating database:', error.message); // this is not the actual error check console its the time out thing

  } finally {
    // Send a response outside the try-catch block
    res.status(200).json("All files processed successfully!");
  }
}

module.exports = {
  viewTutorials,
  getTutorial,
  enrollTutorial,
  getEnrolledTutorials,
  populateDatabase,
  classifyTutorial,
  searchAllTutorials,
  calculateProgress,
  updateProgress
}