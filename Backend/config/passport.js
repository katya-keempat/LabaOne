require('dotenv').config();

const passportjwt = require("passport-jwt");
const passport = require("passport");
const {User} = require('../config/db');
const { Strategy } = require("passport-jwt");
const option = {
    jwtFromRequest: passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}
const passportconfig = (passport) => {
passport.use(
    new Strategy(option,async (payload, done)=>{
        try{
            const user = await User.findByPk(payload.id);
            if(user){
                return done(null, user);
            }
            return done(null,false);
        } catch{
            return done(error,false);
        }
    })
)}
module.exports = {passportconfig}
