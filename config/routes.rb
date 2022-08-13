Rails.application.routes.draw do

  resources :contacts, only: [:index, :new, :create, :update, :destroy]

  resources :devices, only: [:index]

  resources :settings, only: [:index]

  devise_for :users, controllers: { registrations: 'users/registrations', sessions: 'users/sessions', passwords: 'users/passwords' }
  resources :users, only: [:index]#, :update, :destroy]

  root "welcome#index"
  #blup
  # devise_scope :user do
  #   root to: "devise/sessions#new"
  # end

end
