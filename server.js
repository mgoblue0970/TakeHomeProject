import express from 'express';
import bodyParser from 'body-parser';
import { importSPKI, jwtVerify } from 'jose';
// need this to prevent CORS vulns due to information going between two servers.
import cors from 'cors';

const app = express();
const port = 3000;

// For testing
// app.use(cors({
//    origin: 'http://localhost',  
//    methods: ['POST']
// }));

app.use(cors());
app.use(bodyParser.json());

const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEMU1JFVEO9FkVr0r041GpAWzKvQi1TBYm
arJj3+aNeC2aK9GT7Hct1OJGWQGbUkNWTeUr+Ui09PjBit+AMYuHgA==
-----END PUBLIC KEY-----`;

// I didn't have the author's private key.  I made my own keypair to test with the code to verify
// turning the row red works... and it does for the public key below.  For production, I'll comment
// out the test key below and use the author's provided key above.

//const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
//MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEse2evGqakqTcpRYuj42LGpJELxe+
//FLhP+IgPL7xdj8HY2o0nZRGAV9FF5UKUfLb8VvSETv535lvzrz8Eh47g1w==
//-----END PUBLIC KEY-----`;

app.post('/verify-jwt', async (req, res) => {
    console.log('Received /verify-jwt request with body:', req.body);

    const token = req.body.token;
    if (!token) {
        console.log('No token found in request body.');
        return res.json({ valid: false });
    }

    try {
        const key = await importSPKI(PUBLIC_KEY_PEM, 'ES256');
        const { payload } = await jwtVerify(token, key);

        console.log('JWT successfully verified. Payload:', payload);

        return res.json({ valid: true });
    } catch (err) {
        console.log('JWT verification failed:', err.message);
        return res.json({ valid: false });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
