import '../../App.css';
import './Secrets.css';
import React, {useEffect, useState} from 'react';
import {getSecretsforUser} from "../../comunication/FetchSecrets";

/**
 * Secrets
 * @author Peter Rutschmann
 */
const Secrets = ({loginValues}) => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedSecret, setSelectedSecret] = useState(null);

    useEffect(() => {
        const fetchSecrets = async () => {
            setErrorMessage('');
            if (!loginValues.email) {
                console.error('Secrets: No valid email, please do login first:' + loginValues);
                setErrorMessage("No valid email, please do login first.");
            } else {
                try {
                    const data = await getSecretsforUser(loginValues);
                    console.log(data);
                    setSecrets(data);
                } catch (error) {
                    console.error('Failed to fetch to server:', error.message);
                    setErrorMessage(error.message);
                }
            }
        };
        fetchSecrets();
    }, [loginValues]);

    const handleSecretClick = (secret) => {
        setSelectedSecret(secret);
    };

    const handleClosePopup = () => {
        setSelectedSecret(null);
    };

    const renderSecretContent = (secret) => {
        let contentToProcess = secret.content; // Start with the original content string
        let processedContent = null;

        try {
            // Attempt to parse the content string (handling potential nested JSON)
            const firstParse = JSON.parse(contentToProcess);

            if (typeof firstParse === 'string') {
                processedContent = JSON.parse(firstParse);
            } else if (typeof firstParse === 'object' && firstParse !== null) {
                processedContent = firstParse;
            } else {
                 // If first parse is not a string or object, treat as plain text
                 console.warn('First parse did not result in string or object.', firstParse);
                 processedContent = contentToProcess; // Keep original string
            }

            // After parsing attempts, check if the result is a usable object
            if (typeof processedContent !== 'object' || processedContent === null) {
                 // If not a usable object, keep the original string for plain text rendering
                 console.warn('Final processed content is not a usable object.', processedContent);
                 processedContent = contentToProcess; // Ensure original string is used
            }

        } catch (e) {
            // If parsing fails at any step, fallback to original string.
            console.warn('Failed to parse secret content as JSON, rendering as plain text:', e);
             processedContent = contentToProcess; // Ensure original string is used
        }

        // **Final Rendering Logic:**
        // If processedContent is a string, render as plain text.
        if (typeof processedContent === 'string') {
             return (
                <div className="secret-card">
                    <h3>Secret Content</h3>
                    <p>{processedContent}</p>
                </div>
            );
        }

        // If processedContent is a valid object, render structured content.
        if (typeof processedContent === 'object' && processedContent !== null) {
             switch (processedContent.kind) {
                case 'credential':
                    return (
                        <div className="secret-card credential">
                            <h3>Credential</h3>
                            <p><strong>Username:</strong> {processedContent.userName}</p>
                            <p><strong>Password:</strong> {processedContent.password}</p>
                            <p><strong>URL:</strong> {processedContent.url}</p>
                        </div>
                    );
                case 'creditcard':
                    return (
                        <div className="secret-card creditcard">
                            <h3>Credit Card</h3>
                            <p><strong>Card Type:</strong> {processedContent.cardtype}</p>
                            <p><strong>Card Number:</strong> {processedContent.cardnumber}</p>
                            <p><strong>Expiration:</strong> {processedContent.expiration}</p>
                            <p><strong>CVV:</strong> {processedContent.cvv}</p>
                        </div>
                    );
                case 'note':
                    return (
                        <div className="secret-card note">
                            <h3>Note</h3>
                            <p><strong>Title:</strong> {processedContent.title}</p>
                            <p><strong>Content:</strong> {processedContent.content}</p>
                        </div>
                    );
                default:
                    // Render object key-value pairs for unknown kinds or objects without 'kind'
                    return (
                        <div className="secret-card">
                            <h3>Secret Details</h3>
                            {Object.entries(processedContent).map(([key, value]) => (
                                // Ensure value is not an object for simple display
                                <p key={key}><strong>{key}:</strong> {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}</p>
                            ))}
                        </div>
                    );
            }
        }

         // Fallback for any other unexpected cases (should not be hit if logic is correct)
         console.error('Unexpected content type for rendering:', processedContent);
         return (
            <div className="secret-card">
                <h3>Error Displaying Secret</h3>
                <p>Could not display secret content.</p>
            </div>
        );
    };

    return (
        <div className="secrets-container">
            <h1>My Secrets</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            {secrets?.length > 0 ? (
                <div className="secrets-grid">
                    {secrets.map(secret => (
                        <div 
                            key={secret.id} 
                            className="secret-item"
                            onClick={() => handleSecretClick(secret)}
                        >
                            {renderSecretContent(secret)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-secrets">
                    <p>No secrets available</p>
                </div>
            )}

            {selectedSecret && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={handleClosePopup}>×</button>
                        <div className="popup-header">
                            <h2>Secret Details</h2>
                            <p className="secret-id">ID: {selectedSecret.id}</p>
                        </div>
                        {renderSecretContent(selectedSecret)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Secrets;