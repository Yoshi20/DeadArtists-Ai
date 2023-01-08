class RenameRarityFromPaintings < ActiveRecord::Migration[7.0]
  def change
    rename_column :paintings, :rarity, :rarity_rank
  end
end
