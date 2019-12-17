const health = require('./controllers/health');
const dashboard = require('./controllers/dashboard');


module.exports = function (app) {
       app.get('/', health.health);
       app.get('/heartbeat', health.heartbeat);
       app.get('/test', dashboard.getAllLimit10);
       app.get('/groups', dashboard.getRangingGroups);
       app.post('/test2', dashboard.databaseTest2);
}
