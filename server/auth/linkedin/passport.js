var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;

exports.setup = function (User, config) {
  passport.use(new LinkedInStrategy({
      consumerKey: config.linkedin.clientID,
      consumerSecret: config.linkedin.clientSecret,
      callbackURL: config.linkedin.callbackURL,
      profileFields: ["id","firstName", "lastName", "educations", "headline", "skills", "location:(name)", "positions", "picture-url", "email-address", "twitter-accounts", "public-profile-url"]
    },
    function(token, tokenSecret, profile, done) {
    	console.log(profile);
      User.findOne({
        'linkedin.id': profile.id
      }, function(err, user) {
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'linkedin',
            linkedin: profile._json
          });
          user.save(function(err) {
            if (err) {
              done(err);
            }
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));
};

// var passport = require('passport');
// var LinkedInStrategy = require('passport-linkedin').Strategy;

// var ifExist = function(value) {
//   if (value !== undefined) {
//     return value.values.map(function(skill) {
//       return skill.skill.name;
//     }).join(", ");
//   }
//   else {
//     console.log('User has no skills listed to be mapped. Skills set to empty string');
//     return ''
//   }
// };


