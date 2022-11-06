Rails.application.routes.draw do

  get 'home' => 'home#index'

  get 'mint' => 'mint#index'
  get 'contract_address' => 'mint#contract_address'
  get 'staking_contract_address' => 'mint#staking_contract_address'
  get 'abi' => 'mint#abi'
  get 'whitelist_addresses' => 'mint#whitelist_addresses'

  get 'faq' => 'faq#index'

  get 'roadmap' => 'roadmap#index'

  resources :artists

  resources :paintings

  resources :nfts

  resources :user_nfts, only: [:index, :show]
  get 'get_user_nfts' => 'user_nfts#get_user_nfts'

  resources :settings, only: [:index]

  devise_for :users, controllers: { registrations: 'users/registrations', sessions: 'users/sessions', passwords: 'users/passwords' }
  resources :users, only: [:index]#, :update, :destroy]

  get 'imprint' => 'imprint#index'
  get 'privacy_notice' => 'privacy_notice#index'
  get 'terms' => 'terms#index'

  get 'health_check', to: proc { [200, {}, ['success']] }

  root "home#index"

end
