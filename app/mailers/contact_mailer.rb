class ContactMailer < ApplicationMailer
	def contact_email 
		@contact_form = params[:contact_form]

		mail(to: ENV["ADMIN_EMAIL"], subject: "New message from #{@contact_form.full_name}!")
	end
end
