/**
 * Fetch methodes for secret api calls
 * @author Peter Rutschmann
 */

import CryptoJS from "crypto-js";

//Post secret to server
export const postSecret = async ({loginValues, content}) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;
    console.log(loginValues)

    try {
        const secretContent = JSON.stringify(content);
        const encrypted = CryptoJS.AES.encrypt(secretContent, loginValues.password).toString();

        const response = await fetch(`${API_URL}/secrets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginValues.email,
                encryptPassword: loginValues.password,
                content: encrypted
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }

        const data = await response.json();
        console.log('Secret successfully posted:', data);
        return data;
    } catch (error) {
        console.error('Error posting secret:', error.message);
        throw new Error('Failed to save secret. ' || error.message);
    }
};

//get all secrets for a user identified by its email
export const getSecretsforUser = async (loginValues) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/secrets/byemail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginValues.email,
                encryptPassword: loginValues.password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }
        const data = await response.json();
        console.log('Secret successfully got:', data);

        const decryptedSecrets = data.map(secret => {
            try {
                let encryptedString = secret.content;
                // Entferne doppelte Anführungszeichen, falls vorhanden
                if (typeof encryptedString === "string" && encryptedString.startsWith('"') && encryptedString.endsWith('"')) {
                    encryptedString = encryptedString.slice(1, -1);
                }
                const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, loginValues.password);
                const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
                console.log("Decrypted string:", decryptedString);
                if (!decryptedString) throw new Error("Decryption failed or wrong password");
                const decryptedContent = JSON.parse(decryptedString);
                return {
                    ...secret,
                    content: decryptedContent
                };
            } catch (e) {
                console.error("Fehler beim Entschlüsseln/Parsen eines Secrets:", e, secret);
                return {
                    ...secret,
                    content: null,
                    error: "Decryption failed"
                };
            }
        });
        return decryptedSecrets;
    } catch (error) {
        console.error('Failed to get secrets:', error.message);
        throw new Error('Failed to get secrets. ' || error.message);
    }
};