const config = {
    production:{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
    },
    default:{
        DATABASE: "mongodb://localhost/PlantsApp",
    }
}
exports.get = function get(env){
    return config[env] || config.default;
} 