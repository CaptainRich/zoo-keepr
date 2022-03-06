
// Middle-ware to make the application aware of all of our routes.

const router          = require('express').Router();
const animalRoutes    = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

router.use(animalRoutes);
router.use(zookeeperRoutes);

////////////////////////////////////////////////////////////////////////////////
module.exports = router;  