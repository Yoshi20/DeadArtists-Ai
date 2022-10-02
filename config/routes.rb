Rails.application.routes.draw do

  get 'home' => 'home#index'

  get 'mint' => 'mint#index'
  get 'contract_address' => 'mint#contract_address'
  get 'abi' => 'mint#abi'
  get 'user_nfts' => 'mint#user_nfts'
  get 'whitelist_addresses' => 'mint#whitelist_addresses'

  get 'faq' => 'faq#index'

  get 'roadmap' => 'roadmap#index'

  resources :artists

  resources :paintings

  resources :nfts

  resources :user_nfts, only: [:index, :show]

  resources :settings, only: [:index]

  devise_for :users, controllers: { registrations: 'users/registrations', sessions: 'users/sessions', passwords: 'users/passwords' }
  resources :users, only: [:index]#, :update, :destroy]

  get 'imprint' => 'imprint#index'
  get 'privacy_notice' => 'privacy_notice#index'
  get 'terms' => 'terms#index'

  get 'health_check', to: proc { [200, {}, ['success']] }

  root "home#index"

end
