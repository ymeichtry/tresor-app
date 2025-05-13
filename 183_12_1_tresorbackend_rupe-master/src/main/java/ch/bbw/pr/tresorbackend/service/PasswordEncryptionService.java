package ch.bbw.pr.tresorbackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * PasswordEncryptionService
 * @author Peter Rutschmann
 */
@Service
public class PasswordEncryptionService {

   @Value("${security.pepper}")
   private String pepper;

   private static final int SALT_LENGTH = 16;

   public PasswordEncryptionService() {
      // Constructor can remain empty
   }

   public String hashPassword(String password) {
      byte[] saltBytes = generateSalt();
      String salt = Base64.getEncoder().encodeToString(saltBytes);
      String saltedHashedPassword = hash(password, salt, pepper);
      return salt + ":" + saltedHashedPassword;
   }

   public boolean verifyPassword(String password, String storedHash) {
      String[] parts = storedHash.split(":");
      if (parts.length != 2) {
         return false;
      }
      String salt = parts[0];
      String hashToCompare = hash(password, salt, pepper);
      return hashToCompare.equals(parts[1]);
   }

   private String hash(String password, String salt, String pepper) {
      try {
         MessageDigest md = MessageDigest.getInstance("SHA-512");
         String combined = salt + password + pepper;
         byte[] hashedBytes = md.digest(combined.getBytes());
         return Base64.getEncoder().encodeToString(hashedBytes);
      } catch (NoSuchAlgorithmException e) {
         throw new RuntimeException("Hashing algorithm not available", e);
      }
   }

   private byte[] generateSalt() {
      byte[] salt = new byte[SALT_LENGTH];
      new SecureRandom().nextBytes(salt);
      return salt;
   }
}
