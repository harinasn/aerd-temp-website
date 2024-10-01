<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get form fields
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

// Set the recipient email
$to = 'sales@aerd.tech';

// Create the email headers
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";

// Send the email
if (mail($to, $subject, $message, $headers)) {
  echo 'Email sent successfully!';
} else {
  http_response_code(500); // Internal server error
  echo 'Email sending failed!';
}
?>
