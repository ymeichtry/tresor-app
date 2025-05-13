package ch.bbw.pr.tresorbackend.util;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * EncryptUtil
 * Used to encrypt content.
 * Not implemented yet.
 * @author Peter Rutschmann
 */
public class EncryptUtil {
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;
    private static final int SALT_LENGTH = 16;
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private final SecretKey secretKey;

    public EncryptUtil(String userPassword) {
        this.secretKey = generateKey(userPassword);
    }

    private SecretKey generateKey(String password) {
        try {
            // Generate a random salt
            byte[] salt = new byte[SALT_LENGTH];
            new SecureRandom().nextBytes(salt);

            // Create key using PBKDF2
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = digest.digest((password + Base64.getEncoder().encodeToString(salt)).getBytes(StandardCharsets.UTF_8));
            return new SecretKeySpec(keyBytes, "AES");
        } catch (Exception e) {
            throw new RuntimeException("Error generating key", e);
        }
    }

    public String encrypt(String data) {
        try {
            // Generate IV
            byte[] iv = new byte[GCM_IV_LENGTH];
            new SecureRandom().nextBytes(iv);

            // Initialize cipher
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);

            // Encrypt data
            byte[] encryptedData = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // Combine IV and encrypted data
            byte[] combined = new byte[iv.length + encryptedData.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encryptedData, 0, combined, iv.length, encryptedData.length);

            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data", e);
        }
    }

    public String decrypt(String encryptedData) {
        try {
            // Decode base64
            byte[] decoded = Base64.getDecoder().decode(encryptedData);

            // Extract IV and encrypted data
            byte[] iv = new byte[GCM_IV_LENGTH];
            byte[] encrypted = new byte[decoded.length - GCM_IV_LENGTH];
            System.arraycopy(decoded, 0, iv, 0, GCM_IV_LENGTH);
            System.arraycopy(decoded, GCM_IV_LENGTH, encrypted, 0, encrypted.length);

            // Initialize cipher
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, parameterSpec);

            // Decrypt data
            byte[] decrypted = cipher.doFinal(encrypted);
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting data", e);
        }
    }
}
