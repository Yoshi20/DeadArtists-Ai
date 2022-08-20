Rails.application.routes.draw do

  get 'welcome' => 'welcome#index'

  get 'home' => 'home#index'

  get 'faq' => 'faq#index'

  get 'roadmap' => 'roadmap#index'

  resources :artists

  resources :paintings

  resources :nfts

  resources :settings, only: [:index]

  devise_for :users, controllers: { registrations: 'users/registrations', sessions: 'users/sessions', passwords: 'users/passwords' }
  resources :users, only: [:index]#, :update, :destroy]

  root "welcome#index"

end
