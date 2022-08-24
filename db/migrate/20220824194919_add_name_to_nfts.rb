class AddNameToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :name, :string
    add_column :nfts, :description, :string
    add_column :nfts, :image_link, :string
    add_column :nfts, :opensea_asset_id, :bigint
    add_column :nfts, :opensea_permalink, :string
    add_column :nfts, :trait_artist, :string
    add_column :nfts, :trait_painting, :string
    add_column :nfts, :trait_main_style, :string
    add_column :nfts, :trait_year_of_death, :string
    add_column :nfts, :trait_gender, :string
    add_column :nfts, :trait_origin, :string
  end
end
