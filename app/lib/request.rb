module Request

  require 'httparty'
  require 'json'

  def self.opensea_collection(collection)
    #url = "https://testnets-api.opensea.io/api/v1/assets?collection=#{collection}" blup
    url = "https://testnets-api.opensea.io/api/v1/assets?collection=deadartistsairinkeby"
    puts "Requesting: GET #{url}"
    begin
      resp = HTTParty.get(url,
        # headers: {
        #   'X-API-KEY': ENV['OPENSEA_API_KEY']
        # }
      )
      if resp.success?
        invalid_nfts = []
        resp.parsed_response['assets'].each do |asset|
          traits_hash = {}
          asset['traits'].each do |trait|
            traits_hash[trait['trait_type'].gsub(' ', '_').downcase.to_sym] = trait['value']
          end
          if !Nft.exists?(opensea_asset_id: asset['id'])
            artist = Artist.find_by(name: traits_hash[:artist])
            nft = Nft.new(
              name: asset['name'],
              description: asset['description'],
              image_link: asset['image_url'],
              opensea_asset_id: asset['id'],
              opensea_permalink: asset['permalink'],
              trait_artist: traits_hash[:artist],
              trait_painting: traits_hash[:painting],
              trait_main_style: traits_hash[:main_style],
              trait_year_of_death: traits_hash[:year_of_death],
              trait_gender: traits_hash[:gender],
              trait_origin: traits_hash[:origin],
              artist_id: artist&.id,
              painting_id: artist.present? ? artist.paintings.find_by(name: traits_hash[:painting])&.id : nil,
            )
            if nft.save
              puts "-> Successfully created: " + nft.name
            else
              invalid_nfts << nft.name + " -> " + nft.errors.full_messages.to_s
            end
          else
            puts "-> NFT already exists: " + asset['name']
          end
        end
        puts "-> Couldn't create the following NFT: " + invalid_nfts.to_s if invalid_nfts.any?
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
  end

end
