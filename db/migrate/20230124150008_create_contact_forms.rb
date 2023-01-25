class CreateContactForms < ActiveRecord::Migration[7.0]
  def change
    create_table :contact_forms do |t|
			t.string :email
			t.string :full_name
			t.string :message
      t.timestamps
    end
  end
end
