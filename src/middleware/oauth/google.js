import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { User } from "../../models/users.js"

// 2 - Creiamo una nuova strategia di autenticazione con Google
const googleStrategy = new GoogleStrategy(
    {
        clientID:
            "935374883606-piaa3bvfphp8m48eoo2q1lrddu7u4b6b.apps.googleusercontent.com", // Client ID e secret della nostra app
        clientSecret: "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",
        callbackURL: "http://localhost:3030/users/oauth-callback",
    },
    async function (_, __, profile, cb) {
        console.log(profile)

        // qui dentro abbiamo i dati dell'utenza di Google,
        // ma noi vogliamo creare un utente nel nostro database.

        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
            //2B - se non esiste, lo creiamo
            // Ci assicuriamo che lo schema consenta un campo dove salviamo l'id di Google
            // e che la password non sia richiesta se questo è il metodo di autenticazione
            user = await User.create({
                googleId: profile.id,
                name: profile.name.givenName + " " + profile.name.familyName,
                email: profile.emails[0].value,
            })
        }

        // dopo aver creato l'utente, lo passiamo a passport che lo inserisce
        // in req.user

        cb(null, user)

        // se volessimo per qualsiasi motivo bloccare l'accesso a questo utente,
        // o sollevare un errore, possiamo farlo passando un errore come primo
        // parametro di cb

        // cb(new Error("User not allowed"))
    }
)

export default googleStrategy
