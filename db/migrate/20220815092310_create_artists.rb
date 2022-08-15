class CreateArtists < ActiveRecord::Migration[7.0]
  def change
    create_table :artists do |t|
      t.string :name,        null: false
      t.string :description
      t.string :image_link
      t.string :wiki_link
      t.timestamps
    end
  end
end
