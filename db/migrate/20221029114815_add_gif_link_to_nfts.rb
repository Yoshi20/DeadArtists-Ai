class AddGifLinkToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :gif_link, :string
    add_column :nfts, :color_code, :string
    add_column :nfts, :rarity_rank, :integer
  end
end
