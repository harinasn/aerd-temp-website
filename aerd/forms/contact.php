<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
    $human_check = $_POST['human_check'] ?? '';

    // Simple human check: 3 + 4 should equal 7
    if ($human_check != '7') {
        echo "Human check failed!";
        exit;
    }

    // Additional form validation
    if (empty($name) || empty($email) || empty($message)) {
        echo "Please fill in all required fields.";
        exit;
    }

    // Email configuration
    $to = "info@aerd.tech"; // updated email address
    $subject = "New Contact Form Submission";
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $body = "Name: $name\nPhone: $phone\nEmail: $email\nMessage:\n$message";

    // Attempt to send the email
    if (mail($to, $subject, $body, $headers)) {
        echo "OK";
    } else {
        echo "Failed to send email.";
    }
} else {
    echo "Invalid request.";
}
?>
