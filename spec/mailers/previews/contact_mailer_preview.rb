# Preview all emails at http://localhost:3000/rails/mailers/contact_mailer
class ContactMailerPreview < ActionMailer::Preview
	def contact_email
    # Set up a temporary contact form for the preview
    contact_form = ContactForm.new(full_name: "Joe Smith", email: "joe@gmail.com", message: "I want to work together!")

    ContactMailer.with(contact_form: contact_form).contact_email
	end
end
