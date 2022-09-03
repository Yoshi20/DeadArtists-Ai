class AddWikiartLinkToPaintings < ActiveRecord::Migration[7.0]
  def change
    add_column :paintings, :wikiart_link, :string
    add_column :paintings, :style, :string
    add_column :paintings, :content, :string
    add_column :paintings, :medium, :string
    add_column :paintings, :turnover, :bigint
    add_column :paintings, :rarity, :integer
  end
end
