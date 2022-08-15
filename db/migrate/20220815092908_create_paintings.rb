class CreatePaintings < ActiveRecord::Migration[7.0]
  def change
    create_table :paintings do |t|
      t.string :name,        null: false
      t.string :image_link
      t.timestamps
    end
    add_column :paintings, :artist_id, :bigint
    add_foreign_key :paintings, :artists
  end
end
