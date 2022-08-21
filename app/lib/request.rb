module Request

  require 'httparty'
  require 'json'

  def self.ggleap_auth
    Rails.cache.fetch("ggleap_auth", expires_in: 5.minutes) do
      jwt = nil
      url = "https://api.ggleap.com/production/authorization/public-api/auth"
      params = {
        "AuthToken": ENV['GGLEAP_API_TOKEN']
      }
      puts "Requesting: POST #{url}"
      begin
        resp = HTTParty.post(url,
          body: params.to_json,
          headers: {
            'Content-Type': 'application/json'
          }
        )
        if resp.success?
          jwt = resp.parsed_response["Jwt"]
        end
      rescue OpenURI::HTTPError => ex
        puts ex
      end
      jwt
    end
  end

  def self.ggleap_users(jwt)
    users = []
    url = "https://api.ggleap.com/production/users/summaries"
    puts "Requesting: GET #{url}"
    begin
      resp = HTTParty.get(url,
        headers: {
          'Authorization': "Bearer #{jwt}"
        }
      )
      if resp.success?
        users = resp.parsed_response["Users"]
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
  end

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

# Example:
# jwt = Request::ggleap_auth
# users = Request::ggleap_users(jwt)
# users.each do |u|
#   puts u["Email"]
# end
