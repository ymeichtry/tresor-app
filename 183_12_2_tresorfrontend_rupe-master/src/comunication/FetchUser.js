/**
 * Fetch methodes for user api calls
 * @author Peter Rutschmann
 */


export const getUsers = async () => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'Get',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }

        const data = await response.json();
        console.log('User successfully got:', data);
        return data;
    } catch (error) {
        console.error('Failed to get user:', error.message);
        throw new Error('Failed to get user. ' || error.message);
    }
}

export const postUser = async (content) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }
        const data = await response.json();
        console.log('User successfully posted:', data);
        return data;
    } catch (error) {
        console.error('Failed to post user:', error.message);
        throw new Error('Failed to save user. ' || error.message);
    }
};

export const postResetPasswordEmail = async (email) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users/resetpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.text(); // Backend returns a string

        if (!response.ok) {
            throw new Error(data || 'Password reset failed.');
        }

        console.log('Password reset request successful:', data);
        return data;
    } catch (error) {
        console.error('Failed to request password reset:', error.message);
        throw new Error('Failed to request password reset. ' + error.message);
    }
};