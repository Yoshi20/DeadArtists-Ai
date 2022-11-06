class ChangeTraitMovementPatternToBeStringInNfts < ActiveRecord::Migration[7.0]
  def up
    change_column :nfts, :trait_movement_pattern, :string
  end

  def down
    change_column :nfts, :trait_movement_pattern, :integer, using: "trait_movement_pattern::integer"
  end

end
