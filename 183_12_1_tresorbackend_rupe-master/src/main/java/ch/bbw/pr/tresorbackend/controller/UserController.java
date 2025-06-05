package ch.bbw.pr.tresorbackend.controller;

import ch.bbw.pr.tresorbackend.model.ConfigProperties;
import ch.bbw.pr.tresorbackend.model.EmailAdress;
import ch.bbw.pr.tresorbackend.model.LoginUser;
import ch.bbw.pr.tresorbackend.model.LoginResponse;
import ch.bbw.pr.tresorbackend.model.RegisterUser;
import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.service.PasswordEncryptionService;
import ch.bbw.pr.tresorbackend.service.UserService;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

/**
 * UserController
 * @author Peter Rutschmann
 */
@RestController
@AllArgsConstructor
@RequestMapping("api/users")
public class UserController {

   private UserService userService;
   private PasswordEncryptionService passwordService;
   private final ConfigProperties configProperties;
   private static final Logger logger = LoggerFactory.getLogger(UserController.class);
   @Value("${RECAPTCHA_SECRET_KEY}") // Read from environment variable
   private String recaptchaSecretKey;
   private final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

   @Autowired
   public UserController(ConfigProperties configProperties, UserService userService,
                         PasswordEncryptionService passwordService) {
      this.configProperties = configProperties;
      System.out.println("UserController.UserController: cross origin: " + configProperties.getOrigin());
      // Logging in the constructor
      logger.info("UserController initialized: " + configProperties.getOrigin());
      logger.debug("UserController.UserController: Cross Origin Config: {}", configProperties.getOrigin());
      this.userService = userService;
      this.passwordService = passwordService;
   }

   // build create User REST API
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PostMapping
   public ResponseEntity<String> createUser(@Valid @RequestBody RegisterUser registerUser, BindingResult bindingResult) {
      //input validation
      if (bindingResult.hasErrors()) {
         List<String> errors = bindingResult.getFieldErrors().stream()
               .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
               .collect(Collectors.toList());
         System.out.println("UserController.createUser " + errors);

         JsonArray arr = new JsonArray();
         errors.forEach(arr::add);
         JsonObject obj = new JsonObject();
         obj.add("message", arr);
         String json = new Gson().toJson(obj);

         System.out.println("UserController.createUser, validation fails: " + json);
         return ResponseEntity.badRequest().body(json);
      }
      System.out.println("UserController.createUser: input validation passed");

      // reCAPTCHA verification
      boolean isCaptchaValid = verifyRecaptcha(registerUser.getRecaptchaToken());
      if (!isCaptchaValid) {
          JsonObject obj = new JsonObject();
          obj.addProperty("message", "reCAPTCHA verification failed.");
          String json = new Gson().toJson(obj);
          System.out.println("UserController.createUser, reCAPTCHA verification failed: " + json);
          return ResponseEntity.badRequest().body(json);
      }
      System.out.println("UserController.createUser: captcha passed.");

      //password validation
      if (!isStrongPassword(registerUser.getPassword())) {
         JsonObject obj = new JsonObject();
         obj.addProperty("message", "Password is not strong enough.");
         String json = new Gson().toJson(obj);
         System.out.println("UserController.createUser, password validation failed: " + json);
         return ResponseEntity.badRequest().body(json);
      }
      System.out.println("UserController.createUser, password validation passed");

      //transform registerUser to user
      User user = new User(
            null,
            registerUser.getFirstName(),
            registerUser.getLastName(),
            registerUser.getEmail(),
            passwordService.hashPassword(registerUser.getPassword())
            );

      User savedUser = userService.createUser(user);
      System.out.println("UserController.createUser, user saved in db");
      JsonObject obj = new JsonObject();
      obj.addProperty("answer", "User Saved");
      String json = new Gson().toJson(obj);
      System.out.println("UserController.createUser " + json);
      return ResponseEntity.accepted().body(json);
   }

   // build get user by id REST API
   // http://localhost:8080/api/users/1
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @GetMapping("{id}")
   public ResponseEntity<User> getUserById(@PathVariable("id") Long userId) {
      User user = userService.getUserById(userId);
      return new ResponseEntity<>(user, HttpStatus.OK);
   }

   // Build Get All Users REST API
   // http://localhost:8080/api/users
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @GetMapping
   public ResponseEntity<List<User>> getAllUsers() {
      List<User> users = userService.getAllUsers();
      return new ResponseEntity<>(users, HttpStatus.OK);
   }

   // Build Update User REST API
   // http://localhost:8080/api/users/1
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PutMapping("{id}")
   public ResponseEntity<User> updateUser(@PathVariable("id") Long userId,
                                          @RequestBody User user) {
      user.setId(userId);
      User updatedUser = userService.updateUser(user);
      return new ResponseEntity<>(updatedUser, HttpStatus.OK);
   }

   // Build Delete User REST API
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @DeleteMapping("{id}")
   public ResponseEntity<String> deleteUser(@PathVariable("id") Long userId) {
      userService.deleteUser(userId);
      return new ResponseEntity<>("User successfully deleted!", HttpStatus.OK);
   }


   // get user id by email
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PostMapping("/byemail")
   public ResponseEntity<String> getUserIdByEmail(@RequestBody EmailAdress email, BindingResult bindingResult) {
      System.out.println("UserController.getUserIdByEmail: " + email);
      //input validation
      if (bindingResult.hasErrors()) {
         List<String> errors = bindingResult.getFieldErrors().stream()
               .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
               .collect(Collectors.toList());
         System.out.println("UserController.createUser " + errors);

         JsonArray arr = new JsonArray();
         errors.forEach(arr::add);
         JsonObject obj = new JsonObject();
         obj.add("message", arr);
         String json = new Gson().toJson(obj);

         System.out.println("UserController.createUser, validation fails: " + json);
         return ResponseEntity.badRequest().body(json);
      }

      System.out.println("UserController.getUserIdByEmail: input validation passed");

      User user = userService.findByEmail(email.getEmail());
      if (user == null) {
         System.out.println("UserController.getUserIdByEmail, no user found with email: " + email);
         JsonObject obj = new JsonObject();
         obj.addProperty("message", "No user found with this email");
         String json = new Gson().toJson(obj);

         System.out.println("UserController.getUserIdByEmail, fails: " + json);
         return ResponseEntity.badRequest().body(json);
      }
      System.out.println("UserController.getUserIdByEmail, user find by email");
      JsonObject obj = new JsonObject();
      obj.addProperty("answer", user.getId());
      String json = new Gson().toJson(obj);
      System.out.println("UserController.getUserIdByEmail " + json);
      return ResponseEntity.accepted().body(json);
   }

   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PostMapping("/login")
   public ResponseEntity<LoginResponse> doLoginUser(@Valid @RequestBody LoginUser loginUser, BindingResult bindingResult) {
      // Input validation
      if (bindingResult.hasErrors()) {
         List<String> errors = bindingResult.getFieldErrors().stream()
               .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
               .collect(Collectors.toList());
         logger.error("Login validation failed: {}", errors);
         return ResponseEntity.badRequest().body(new LoginResponse("Invalid input: " + String.join(", ", errors), null));
      }

      // Find user by email
      User user = userService.findByEmail(loginUser.getEmail());
      if (user == null) {
         logger.warn("Login attempt failed: No user found with email {}", loginUser.getEmail());
         return ResponseEntity.badRequest().body(new LoginResponse("Invalid email or password", null));
      }

      // Verify password
      if (!passwordService.verifyPassword(loginUser.getPassword(), user.getPassword())) {
         logger.warn("Login attempt failed: Invalid password for user {}", loginUser.getEmail());
         return ResponseEntity.badRequest().body(new LoginResponse("Invalid email or password", null));
      }

      logger.info("User {} successfully logged in", loginUser.getEmail());
      return ResponseEntity.ok(new LoginResponse("Login successful", user.getId()));
   }

    private boolean verifyRecaptcha(String recaptchaToken) {
        if (recaptchaToken == null || recaptchaToken.isEmpty()) {
            logger.error("reCAPTCHA token is null or empty");
            return false;
        }

        if (recaptchaSecretKey == null || recaptchaSecretKey.isEmpty()) {
            logger.error("reCAPTCHA secret key is not configured");
            return false;
        }

        RestTemplate restTemplate = new RestTemplate();
        String verificationUrl = RECAPTCHA_VERIFY_URL + "?secret=" + recaptchaSecretKey + "&response=" + recaptchaToken;
        logger.debug("Verifying reCAPTCHA with URL: {}", verificationUrl);

        try {
            // The response from Google is a JSON object
            RecaptchaResponse recaptchaResponse = restTemplate.postForObject(
                    verificationUrl, null, RecaptchaResponse.class);

            if (recaptchaResponse == null) {
                logger.error("reCAPTCHA verification returned null response");
                return false;
            }

            if (!recaptchaResponse.isSuccess()) {
                logger.error("reCAPTCHA verification failed with errors: {}", 
                    recaptchaResponse.getErrorCodes());
                return false;
            }

            logger.info("reCAPTCHA verification successful");
            return true;
        } catch (Exception e) {
            logger.error("reCAPTCHA verification error: {}", e.getMessage(), e);
            return false;
        }
    }

    // Helper class to parse the reCAPTCHA verification response
    private static class RecaptchaResponse {
        private boolean success;
        private List<String> errorCodes;

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public List<String> getErrorCodes() {
            return errorCodes;
        }

        public void setErrorCodes(List<String> errorCodes) {
            this.errorCodes = errorCodes;
        }
    }

   // Helper method for password strength validation
   private boolean isStrongPassword(String password) {
      // Minimum 8 characters, at least one uppercase letter, one number, and one special character
      return password != null && password.matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-={}:;\"',.<>/?]).{8,}$");
   }

   // Build Password Reset REST API
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PostMapping("/resetpassword")
   public ResponseEntity<String> resetPassword(@RequestBody EmailAdress email) {
       try {
           User user = userService.findByEmail(email.getEmail());
           if (user == null) {
               return ResponseEntity.badRequest().body("No user found with this email");
           }
           // In a real application, you would send an email with a reset link.
           // For this exercise, we'll just reset to a temporary password.
           String newPassword = "Temp1234!"; // Or generate a random, secure one
           user.setPassword(passwordService.hashPassword(newPassword));
           userService.updateUser(user);
           // Log the new password for demonstration purposes (REMOVE IN PRODUCTION)
           logger.warn("Password reset for user {}. New password: {}", user.getEmail(), newPassword);
           return ResponseEntity.ok("Password reset successfully. Please log in with the temporary password and change it.");
       } catch (Exception e) {
           logger.error("Error resetting password for email {}: {}", email.getEmail(), e.getMessage());
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error resetting password.");
       }
   }

}
