const routes = require('../api/routes');
const middleware = require('../api/middlewares');

module.exports = function(app) {
    app.use('/auth/',routes.authRoute);
    app.get('/authenticate-user', middleware.authHandler.confirmAuthentication)
    app.use('/api/', routes.publicRoute);
    app.use('/user/:userId/', 
        middleware.authHandler.setCurrentUser,
        middleware.authHandler.protectedRoute, 
        routes.messageRoute);
    app.use('/user/:userId/', 
        middleware.authHandler.setCurrentUser,
        middleware.authHandler.protectedRoute, 
        routes.userRoute);  
    app.use('/user/:userId/', 
        middleware.authHandler.setCurrentUser,
        middleware.authHandler.protectedRoute, 
        routes.groupRoute);   
    app.use(middleware.errorHandler);


}