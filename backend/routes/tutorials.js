const express = require('express')
// make sure they can only see tutorials if they are logged in
const {
    viewTutorials,
    getTutorial,
    enrollTutorial,
    getEnrolledTutorials,
    populateDatabase,
    classifyTutorial,
    searchAllTutorials,
    calculateProgress,
    updateProgress
} = require('../controllers/tutorialController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()


// require auth for all tutorial routes
router.use(requireAuth)

// GET all tutorials
router.get('/', viewTutorials)
// GET all enrolled tutorials
router.get('/enrolled', getEnrolledTutorials)
router.get('/populate', populateDatabase)
// router.get('/populateagain', populateDatabaseNew)


// GET a single tutorial
router.get('/:id', getTutorial)

// POST a new tutorial enrollment request
router.post('/:id/enroll', enrollTutorial)

router.post('/classify', classifyTutorial);

router.post('/search', searchAllTutorials)
router.patch('/calculateProgress', calculateProgress)
router.patch('/updateProgress', updateProgress)

module.exports = router