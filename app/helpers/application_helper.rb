module ApplicationHelper

  def call_types_raw
    ['phone', 'sms', 'email']
  end

  def call_types
    t(call_types_raw, scope: 'defines.call_types')
  end

  def call_types_for_select
    call_types.zip(call_types_raw)
  end

  def default_meta_tags
    {
      reverse: true,
      separator: '|',
      description: meta_tag_description(''),
      keywords: 'dead artists ai, dead artists, nft, blockchain, web3, ai, modern art, traditional art',
      canonical: request.original_url,
      noindex: !Rails.env.production?,
      icon: [
        { href: image_url('favicon.png') },
        { href: image_url('profile_pic.webp'), rel: 'apple-touch-icon', sizes: '180x180', type: 'image/webp' },
      ],
      og: {
        site_name: 'deadartists.ai',
        title: 'Dead Artists AI',
        description: meta_tag_description(''),
        type: 'website',
        url: request.original_url,
        image: image_url('profile_pic.webp')
      }
    }
  end

  def meta_tag_description(str)
    "Dead Artists AI is a NFT art project on the blockchain. It brings dead artists back to life and let them join Web3. This is the #{str} page."
  end

end
