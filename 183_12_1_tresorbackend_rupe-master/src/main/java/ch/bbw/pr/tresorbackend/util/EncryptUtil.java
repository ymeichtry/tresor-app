package ch.bbw.pr.tresorbackend.util;

/**
 * EncryptUtil
 * Used to encrypt and decrypt content.
 * Simplified for testing saving plain content.
 * @author Peter Rutschmann
 */
public class EncryptUtil {

    // Simplified constructor - password is not used in this version
    public EncryptUtil(String userPassword) {
        // Does nothing in this simplified version
    }

    // Simplified encrypt - just returns the input string
    public String encrypt(String data) {
        return data;
    }

    // Simplified decrypt - just returns the input string
    public String decrypt(String encryptedData) {
        return encryptedData;
    }

     // Add a dummy decrypt method that matches the one previously attempted to avoid compilation errors in SecretController
     // This is a temporary fix to allow saving plain text.
     public String decrypt(String encryptedData, String userPassword) {
        return encryptedData;
     }
}
