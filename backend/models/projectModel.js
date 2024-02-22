const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
    {
        prjName: {
            type: String,
            required: true,
        },

        progLang: {
            type: String,
            required: true,
            enum: ['python', 'java', 'c++'],
        },
        codeStates: [
            {
                codeIndex: {
                    type: Number,
                    required: true,
                },
                codeData: [
                    {
                        fileName: {
                            type: String,
                            required: true,
                        },
                        code: {
                            type: [String],
                            required: true,
                        },
                    },
                ],
                classes: [
                    {
                        isClass: {//for interface
                            type: Boolean,
                            required: true
                        },
                        name: {
                            type: String,
                            required: true,
                        },
                        attributes: [
                            {
                                name: {
                                    type: String,
                                },
                                access_modifier: {
                                    type: String,
                                },
                            },
                        ],
                        methods: [
                            {
                                name: {
                                    type: String,
                                },
                                access_modifier: {
                                    type: String,
                                },
                                parameters: [
                                    {
                                        name: {
                                            type: String,
                                        },
                                        type: {
                                            type: String,
                                        },
                                    },
                                ],
                            },
                        ],
                        linesOfCode: String
                    },
                ],
                relationships:
                    [{
                        type: {
                            type: String,
                            enum: ['inheritance', 'abstraction', 'encapsulation', 'polymorphism', 'method overriding', 'method overloading', 'abstract class', 'interface'],
                            required: true,
                        },
                        source: {
                            type: {
                                type: String,
                                enum: ['interface','attribute',  'class', 'instance', 'function'],
                            },
                            name: String,
                        },
                        target: {
                            type: {
                                type: String,
                                enum: ['interface','attribute',  'class', 'instance', 'function'],
                            },
                            name: String,
                        },
                        linesOfCode: String,

                    }],
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
