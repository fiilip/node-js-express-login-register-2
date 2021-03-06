const passport = require("passport");
const LocalStrategy= require("passport-local").Strategy;
const mysql = require("mysql");
const dbConfig = require("./dbConfig");
const bcrypt = require("bcrypt");

passport.serializeUser(function (userId,done) {
    done(null,userId);
});

passport.deserializeUser(function (userId, done) {
   done(null, userId);
    
});

//getum við loggað inn

passport.use(new LocalStrategy((
    function (username, password, done) {
        let connection = mysql.createConnection(dbConfig);
        let sp = "CALL getUserWithName(?)";

        connection.query(sp, username, (error, results, fields)=>{
            if(error){
                done(error);
            }
            if(results.length === 0){
                done(null, false);
            }else{
                const hash = results[0][0].password;
                bcrypt.compare(password, hash, function (error, response) {
                    if (response === true){
                        return done(null, {userId: results[0][0].id})
                    }else{
                        return done (null, false);
                        }
                    
                    });
                }
            });
        
        }
    )
));