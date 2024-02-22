const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tutorialSchema = new Schema({
    tutName: {
        type: String,
        required: true,
    },
    tutDescription: {
        type: String,
        required: true,
    },
    level: [
        {
            levelNumber: {
                type: Number,
                enum: [1, 2, 3],
                required: true,
            },
            progLang: {
                type: String,
                required: true,
                enum: ["Java", "Python", "C++"]
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
                            enum: ['interface', 'attribute', 'class', 'instance', 'function'],
                        },
                        name: String,
                    },
                    target: {
                        type: {
                            type: String,
                            enum: ['interface', 'attribute', 'class', 'instance', 'function'],
                        },
                        name: String,
                    },
                    linesOfCode: String,

                }],
            tutorialSteps: {
                type: [String],
                required: true,
            },
            noTutSteps: {
                type: Number,
                required: true,
            }
        },
    ],
}, { timestamps: true });

tutorialSchema.pre('save', function (next) {
    this.level.sort((a, b) => a.progLang.localeCompare(b.progLang));
    next();
});
tutorialSchema.index({ 'level.levelNumber': 1 });
module.exports = mongoose.model('Tutorial', tutorialSchema);
