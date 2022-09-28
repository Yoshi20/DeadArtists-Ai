class AddTraitRarityToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :trait_movement_pattern, :integer
    add_column :nfts, :trait_rarity, :integer
  end
end
