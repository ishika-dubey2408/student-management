
package com.student.student_management.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Document(collection = "students")
public class Student {

    @Id
    private String id;

    @NotBlank(message = "First name is required")
    @Pattern(
        regexp ="^[A-Za-z]+$",
        message= "First name must contain only letters and spaces" 
    )
    @Size(max=50,message="First name cannot exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
      @Pattern(
        regexp ="^[A-Za-z]+$",
        message= "last name must contain only letters and spaces" 
    )
    @Size(max=50,message="First name cannot exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Date of birth is required")
    @Pattern(
        regexp = "^\\d{4}-\\d{2}-\\d{2}$",
        message = "Date of birth must be in YYYY-MM-DD format"
    )
    private String dateOfBirth;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    @Size(max=200,message="Email name cannot exceed 200 characters")

    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[0-9]{10}$",
        message = "Phone number must contain exactly 10 digits"
    )
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    @Size(max=200,message="Address name cannot exceed 200 characters")

    private String address;

    @NotBlank(message = "Enrollment date is required")
    @Pattern(
        regexp = "^\\d{4}-\\d{2}-\\d{2}$",
        message = "Enrollment date must be in YYYY-MM-DD format"
    )
    private String enrollmentDate;

    @NotBlank(message = "Major is required")
    @Size(max=100,message=" Major cannot exceed 100 characters")
     private String major;

    // Default constructor
    public Student() {
    }

    // Parameterized constructor
    public Student(String id, String firstName, String lastName,
                   String dateOfBirth, String email, String phoneNumber,
                   String address, String enrollmentDate, String major) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.enrollmentDate = enrollmentDate;
        this.major = major;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    

    public String getFirstName() {
       return firstName;
 }

    public void setFirstName(String firstName) {
         this.firstName = firstName;
     }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(String enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }
}