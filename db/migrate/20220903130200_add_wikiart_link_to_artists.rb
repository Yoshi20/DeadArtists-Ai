class AddWikiartLinkToArtists < ActiveRecord::Migration[7.0]
  def change
    add_column :artists, :wikiart_link, :string
    add_column :artists, :year_of_death, :integer
    add_column :artists, :gender, :string
    add_column :artists, :origin, :string
  end
end
