const config = {
    production:{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGO_URI,
    },
    default:{
        SECRET: "HASHING_PASSWORD_123",
        DATABASE: "mongodb://localhost/PlantsApp",
    }
}
exports.get = function get(env){
    return config[env] || config.default;
} 