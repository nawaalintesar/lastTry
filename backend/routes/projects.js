const express = require('express')
// make sure they are limitted to one project unless they are logged in
const {
    viewProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    searchCreatedProjects,
    clearCodeStates
} = require('../controllers/projectController')

const { generateRec, implementRec } = require('../nlp/nlpHandler')
const requireAuth = require('../middleware/requireAuth')

// app.use((req) => {
//     console.log('Request URL:', req.url);
//   });

const router = express.Router()

// Define the getRecommendations route without a route parameter
router.post('/getRecommendations', requireAuth,generateRec);
// Define the implementRecommendations route without a route parameter
router.post('/:id/implementRecommendation/', requireAuth,implementRec);

// GET all projects
router.get('/', requireAuth,viewProjects)

// GET a single project
router.get('/:id', getProject)
router.get('/:id/clearCodeStates', clearCodeStates)

// POST a new project
router.post('/', requireAuth,createProject)

// DELETE a project
router.delete('/:id',requireAuth, deleteProject)

// UPDATE a project
router.patch('/:id', updateProject)
router.post('/search',requireAuth,searchCreatedProjects )
module.exports = router