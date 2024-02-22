const { spawn } = require('child_process');
const mongoose = require('mongoose')
require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Project = require('../models/projectModel')
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCJPUHB5HDfrTsnP-R73UiOrx-TliQzwVs");

async function promptGemini(prompt) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
}

const parseCppCode = async (code) => {
    const prompt_classes = code + `
    Given some user code extract the following information about classes in JSON format. here is the exact output format:
    [{
        "isClass": true,
        "name": "Animal",
        "attributes": [
            {
            "name": "species",
            "access_modifier": "private",
            },
            {
            "name": "age",
            "access_modifier": "private",
            },
        ],
        "methods": [
            {
            "name": "isOlder",
            "access_modifier": "public",
            "parameters": [
                    {
                    "name": "anotherAnimal",
                    "type": "Animal",
                    },
                ],
            },
        ],
        "linesOfCode": "2-8",
    },
    {
        "isClass": true,
        "name": "AnotherClass",
        "attributes": [
            {
                "name": "name",
                "access_modifier": "protected"
            },
            {
                "name": "age",
                "access_modifier": "private"
            }
        ],
        "methods": [
            {
                "name": "testing",
                "access_modifier": "public",
                "parameters": []
            }
        ],
        "linesOfCode": "10-15"
    }]

Output- This is the mongoose schema so load the data into this schema exactly in perfect JSON format with the exact data types
{   [{
        isClass: {//it only becomes false for interfaces. true by default.
            type: Boolean
        },
        name: {// name of the class or interface
            type: String
        },
        attributes: [ // attributes of the class or interface
            {
                name: { // name of the attribute
                    type: String,
                },
                access_modifier: { // public private or protected
                    type: String,
                },
            }
        ],
        methods: [ // methods of the class or interface
            {
                name: { // name of the method
                    type: String,
                },
                access_modifier: {
                    type: String, // public private or protected
                },
                parameters: [ // all the parameters of the method 
                    {
                        name: { // name of the parameter
                            type: String,
                        },
                        type: { // data type of the parameter
                            type: String,
                        },
                    },
                ],
            }
        ],
        linesOfCode: String //string of all the lines of the code of this class.
    }]
}`;

    const prompt_relationship = code + `
    Given some user code extract the following information about OOP concepts in the code.
    For inheritance, Identify classes that extend another class with the format class Derived : accessSpecifier Base. The linesOfCode is a string of the line numbers in the child class where this happens and all the line numbers for functions and attribtues common to both classes
    For encapsulation, Identify the source type to be class and name is the name of the class. (classes that encapsulate data and protect them from direct access and modification).  linesOfCode a string of is the line number(s) of the attributed or functions that are private.
    For method overriding, The source and target function names should be in the format ClassName.FunctionName. Identify functions in derived classes that have the same name and signature as functions in the base class. linesOfCode a string containing the line numbers of the function in both classes seperated by ,. 
    For method overloading, Look for multiple functions with the same name in a class but different parameter lists. For each instance of this happening, linesOfCode   string of  the line number(s) of the function and all its overloaded variants.
    For abstract classes, Identify classes that have pure virtual functions (functions with = 0). For each instance of this happening, linesOfCode is a string of the line number(s) of the function.
    For polymorphism, Look for places where there is inheritance and the child class overrides something from the parent. Also Look for derived or subclasses that are instantiated in main with the super class. Also Recognize the use of pointers or references to base class types to achieve runtime polymorphism. For each instance of this happening, linesOfCode is a string of the line number(s) of the instantiation as well as the function in both the classes that has been overridden.
    If there are multiple instances of the same concept consider each instance as a new type of relationship. For example, heres the format of an output:
    
        {
            "type": "polymorphism",
            "source": {
                "type": "instance",
                "name": "shape1"
            },
            "target": {
                "type": "class",
                "name": "Circle"
            },
            "linesOfCode": "20-34" 
        },
        {
            "type": "polymorphism",
            "source": {
                "type": "class",
                "name": "Shape"
            },
            "target": {
                "type": "class",
                "name": "Square"
            },
            "linesOfCode": "34-47"
        }
    
    //////////////////////////////////////////////////////////////
    This is the mongoose schema so load the data into this schema exactly in perfect JSON format with the exact data types
               {     
                        [{
                            type: {
                                type: String, // the name of the type of relationship found
                                enum: ['inheritance', 'encapsulation', 'polymorphism', 'method overriding', 'method overloading', 'interface'],// strictly stick to these case sensetive options
                                required: true,
                            },
                            source: {
                                type: {
                                    type: String,
                                    enum: ['interface', 'attribute', 'class', 'instance', 'function'], // strictly stick to these case sensetive options
                                },
                                name: String,
                            },
                            target: {
                                type: {
                                    type: String,
                                    enum: ['interface', 'attribute', 'class', 'instance', 'function'],// strictly stick to these case sensetive options
                                },
                                name: String,
                            },
                            linesOfCode: String,
    
                        }]
    }`;

    try {
        const [response1, response2] = await Promise.all([promptGemini(prompt_classes), promptGemini(prompt_relationship)]);

        if (response1 && response2) {
            const json_object = {
                classes: JSON.parse(response1.replace(/```|json|JSON/g, '')),
                relationships: JSON.parse(response2.replace(/```|JSON|json/g, '')),
            };
            return json_object;
        } else {
            console.error('One or more responses are undefined');
            return null; // or throw an error or handle the situation differently
        }
    } catch (error) {
        console.error('Error parsing response:', error);

    }
}

const analyzeCode = async (code, progLang) => {
    // Call the Python script to analyze the code
    let process;

    if (progLang === 'python') {
        process = spawn('python', ['./nlp/analyseCodePython.py', code]);
    } else if (progLang === 'java') {
        process = spawn('python', ['./nlp/analyseCodeJava.py', code]);
    } else if (progLang === 'c++') {
        return parseCppCode(code);
    } else {
        return Promise.reject(new Error(`Unsupported programming language: ${progLang}`));
    }

    return new Promise((resolve, reject) => {
        let result = '';
        let errorOutput = '';

        process.stdout.on('data', (data) => {
            result += data.toString();
        });
        process.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        process.on('close', (code) => {
            if (code === 0) {
                try {
                    const analyzedCode = JSON.parse(result);
                    console.log("HERE", analyzedCode);
                    resolve(analyzedCode);
                } catch (parseError) {
                    console.error(parseError);
                    reject(new Error(`Failed to parse the result: ${parseError.message}`));
                }
            } else {
                console.error(`Parsing failed with code ${code}`);
                console.error(`Error output from Python script:\n${errorOutput}`);
                reject(new Error(`Parsing failed with code ${code}`));
            }
        });

    });

    // if the code is being updated not starting from scratch the process should be more simplified here

}
const generateRec = async (req, res) => {
    try {
        const { currentCode, sourceComponent, typeOfChange } = req.body;

        // Now you can use these variables in your code
        console.log('currentCode:', currentCode);
        console.log('sourceComponent:', sourceComponent);
        console.log('typeOfChange:', typeOfChange);

        let prompt = `Here is some code ${currentCode}. Keep in mind a beginner programmer who is just learning object-oriented programming. Provide code-free recommendations and brief justifications. Recommend 1 thing to ${typeOfChange} for each of the following with regard to the objects ${sourceComponent}- 1.an abstract parent class to inherit from (if it already has a parent -Nothing to ${typeOfChange}), 2.a child class that can inherit from it, 3.a class that inherits from the same parent as it (i.e., a sibling class), 4. an attribute, 5. a function(method), 6. an object of an one of the existing classes instantiated in main. If the recommended change already exists in the code, try 1 more time. If there are still no logical suggestions, say 'Nothing to ${typeOfChange}' For each suggestion justify the recommendation with a reason keeping in mind that the recommendations are meant to explain inheritance, polymorphism, abstraction, encapsulation, classes, interfaces, method overriding or overloading in each suggestion.Follow the format 1. <heading of thing to add/remove> \nRecommendation: <recommendation here with justification>.`;

        if (typeOfChange === "remove") {
            prompt = `Here is some code ${currentCode}. Keep in mind a beginner programmer who is just learning object-oriented programming. Provide code-free recommendations and brief justifications. Recommend 1 thing to ${typeOfChange} for each of the following with regard to the objects ${sourceComponent}- 1.an abstract parent class to inherit from (if it already has a parent -Nothing to ${typeOfChange}), 2.a child class that inherits from it, 3. an attribute, 4. a function(method), 5. an object of an one of the existing classes instantiated in main. If the recommended change already exists in the code, try 1 more time. If there are still no logical suggestions, say 'Nothing to ${typeOfChange}'. For each suggestion justify the recommendation with a reason keeping in mind that the recommendations are meant to explain inheritance, polymorphism, abstraction, encapsulation, classes, interfaces, method overriding or overloading in each suggestion. Follow the format 1. <heading of thing to remove> \nRecommendation: <recommendation here with justification on why it does/doesnt need to be removed>. Good reasons include understanding how not having abstraction changes the code logic, understanding the need for abstract classes, inheritance, polymorphism, etc. , redundany code, etc. Sometimes the user's code has a parent or interface to improve code reusablilty. so recommend removing it to see how inefficient the code would be without it. If theres any code that is not being instantiated it can be removed. Follow this train of thought. `;

        }
        const recommendation = await promptGemini(prompt);
        if (!recommendation.trim()) {
            console.log("Recommendation is empty.");
        }
        res.status(200).json(recommendation);
    } catch (error) {
        console.error("Error in generateRec:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const implementRec = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentCode, recommendation } = req.body;
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such ey' })
        }
        // Find the project by ID
        const project = await Project.findById(id);
        const lang = project?.progLang;
        // if they click the implement button this function is called 
        // it should generate the new code based on the recommendation they clicked implement for 
        const prompt = `
        Given the files in the following code project and the code in each file, generate the complete ${lang} code after implementing the given recommendation. 
        If you are updating code in a file, Start with a comment of the name of the file. For each file, Show the entire code for that file after implementing the recommendation the required changes without replacing the logic completely. 
        In the case of creating a new class where the old class didnt exist in the user's code, if the recommendation requies a new class to be created, and therefore a new file needs to be created, start the file with a comment on the name of the file, followed by the code. . 
        \n Heres an example format, 
        Provided Code:
        fileName: "Testing.py",
        code: 
        class Shape:
            def area(self):
                pass

        class Circle(Shape):
            def __init__(self, radius):
                self.radius = radius
        
            def area(self):
                return math.pi * self.radius ** 2
        
        fileName: "Main.py"
        code:
        # Example usage:
        from Circle import Circle

        circle = Circle(radius=5)
        print(f"Circle Area: {circle.area()}")
        print(f"Circle Perimeter: {circle.perimeter()}")
        
        \n
        Output after implementing recommendation to add a class and function:
        # Testing.py 
        class Shape:
            def area(self):
                pass
            # new function added 
            def perimeter(self):
                pass

        class Circle(Shape):
            def __init__(self, radius):
                self.radius = radius
        
            def area(self):
                return math.pi * self.radius ** 2
            # new function added to child class as well 
            def perimeter(self):
                return 2 * math.pi * self.radius

        # Rectangle.py 
        from Shape import Shape
        # new class added
        class Rectangle(Shape):
            def __init__(self, length, width):
                self.length = length
                self.width = width
            # new function added to child class as well    
            def area(self):
                return self.length * self.width
        
            def perimeter(self):
                return 2 * (self.length + self.width)
        
        # Main.py
        # Example usage:
        from Circle import Circle
        from Rectangle import Rectangle
        circle = Circle(radius=5)
        print(f"Circle Area: {circle.area()}")
        print(f"Circle Perimeter: {circle.perimeter()}")
        rectangle = Rectangle(length=4, width=6)
        print(f"Rectangle Area: {rectangle.area()}")
        print(f"Rectangle Perimeter: {rectangle.perimeter()}")
        **************
        End of sample code.
        Code to process: \n ${currentCode} \n Recommendation to be implemented: ${recommendation}.
        `
            ;
        const newCode = await promptGemini(prompt);
        // Assuming the 'newCode' variable holds the string with triple backticks and language identifier
        const trimmedCode = newCode.replace(/^```(?:python|java|cpp)\n([\s\S]+)```$/g, '$1');

        const extractedCodeData = [];

        // Split the trimmedCode into an array of lines
        const lines = trimmedCode.split('\n');

        let currentFileName = null;
        let currentCodex = [];
 
        lines.forEach(line => {
            // Check if the line is a filename line (contains "//" or "#" and ends with a file extension)
            const isFileNameLine = /(?:\/\/|#)\s*(\w+\.(?:java|py|cpp))/.test(line.trim());
            
            if (isFileNameLine) {
                // If it's a filename line, save the previous code data
                if (currentFileName) {
                    extractedCodeData.push({ fileName: currentFileName, code: currentCodex });
                }
                
                // Update the current filename and reset the current code
                currentFileName = line.trim().match(/(?:\/\/|#)\s*(\w+\.(?:java|py|cpp))/)[1];
                currentCodex = [];
            } else {
                // If it's not a filename line, append to the current code
                currentCodex.push(line);
            }
        });
        
        // Save the last code block
        if (currentFileName) {
            extractedCodeData.push({ fileName: currentFileName, code: currentCodex });
        }
        
        // Ensure that all files from the previous codeData are present in the extractedCodeData
        currentCode.forEach(prevFile => {
            const matchingFile = extractedCodeData.find(file => file.fileName === prevFile.fileName);
            if (!matchingFile) {
                // If a file is missing, add it with the same code as the previous state
                extractedCodeData.push({ fileName: prevFile.fileName, code: prevFile.code });
            } else {
                // If the file exists, check if the code has changed
                if (prevFile.code.join('\n') !== matchingFile.code.join('\n')) {
                    // If the code has changed, replace it with the previous state's code
                    matchingFile.code = prevFile.code;
                }
            }
        });
        
        const updatedCodeString = extractedCodeData.map(file => file.code.join('\n')).join('\n\n');
        let result;
        result = await analyzeCode(updatedCodeString, project.progLang);
        const classes = result.classes;
        const relationships = result.relationships;

        const latestCodeState = project.codeStates.reduce((max, state) =>
            state.codeIndex > max.codeIndex ? state : max, { codeIndex: -1 });
        const newCodeIndex = latestCodeState.codeIndex + 1;
        const newCodeState = {
            codeIndex: newCodeIndex,
            codeData: extractedCodeData,
            classes: classes,
            relationships: relationships
        };

        // Add the new code state to the project
        project.codeStates.push(newCodeState);
        await project.save();
        res.status(200).json(newCodeState);
    } catch (error) {
        console.error(`Error updating: ${error.message}`);
        res.status(400).json({ error: "Error updating" });
    }
}

module.exports = {
    analyzeCode,
    generateRec,
    implementRec,

};