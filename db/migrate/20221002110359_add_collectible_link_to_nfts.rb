class AddCollectibleLinkToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :collectible_link, :string
  end
end
