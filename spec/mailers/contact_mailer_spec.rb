require "rails_helper"

RSpec.describe ContactMailer, type: :mailer do
  it 'sends a email with contact form info' do 
    contact_form = ContactForm.new(full_name: "Joe Smith", email: "joe@gmail.com", message: "I want to work together!")

		email = ContactMailer.with(contact_form: contact_form).contact_email

		# Check if the email is sent
    assert_emails 1 do
      email.deliver_now
    end

		# Check the contents are correct
    assert_equal [ENV['GMAIL_ACCOUNT']], email.from
    assert_equal [ENV['ADMIN_EMAIL']], email.to
    assert_equal "New message from #{contact_form.full_name}!", email.subject
    assert_match contact_form.full_name, email.html_part.body.encoded
    assert_match contact_form.full_name, email.text_part.body.encoded
    assert_match contact_form.email, email.html_part.body.encoded
    assert_match contact_form.email, email.text_part.body.encoded
    assert_match contact_form.message, email.html_part.body.encoded
    assert_match contact_form.message, email.text_part.body.encoded
	end
end
