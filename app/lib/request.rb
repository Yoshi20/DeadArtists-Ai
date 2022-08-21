module Request

  require 'httparty'
  require 'json'

  def self.opensea_collection(collection)
    url = "https://testnets-api.opensea.io/api/v1/assets?collection=#{collection}"
    puts "Requesting: GET #{url}"
    begin
      resp = HTTParty.get(url,
        # headers: {
        #   'X-API-KEY': ENV['OPENSEA_API_KEY']
        # }
      )
      if resp.success?
        user = resp.parsed_response["User"]
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
  end

end
