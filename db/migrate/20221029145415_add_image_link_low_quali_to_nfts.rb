class AddImageLinkLowQualiToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :image_link_low_quali, :string
    add_column :nfts, :gif_link_no_id, :string
  end
end
