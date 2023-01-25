require 'rails_helper'

RSpec.describe "ContactForms", type: :request do
  describe "POST /contact" do
    it 'creates a new contact form' do
			post '/contact', :params => {
				contact_form: {
					full_name: 'John Smith',
					email: 'johnsmith@gmail.com',
					message: 'Hi! I\'d like to work together!',
				},
			}
			expect(response).to have_http_status(:created)
		end
  end
end
