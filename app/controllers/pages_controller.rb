class PagesController < ApplicationController
  def home
		@title = "Colin Santee"
  end

	def download_resume
		send_file(
			"#{Rails.root}/public/Santee-Resume-2023-PDF.pdf",
			filename: "Santee-Resume-2023.pdf",
			type: "application/pdf"
		)
	end
end
