class ContactFormsController < ApplicationController
	# POST /contact
	def create
		@contact_form = ContactForm.new(contact_form_params)
		if @contact_form.save 
			ContactMailer.with(contact_form: @contact_form).contact_email.deliver_now
			render json: { message: "Contact form submitted!" }, status: :created
		else
			render json: { error: @contact_form.errors }, status: :unprocessable_entity
		end
	end

	private
	def contact_form_params
		params.require(:contact_form).permit(:full_name, :email, :message)
	end
end
