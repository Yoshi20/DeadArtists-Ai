// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import TomSelectController from "./tom_select_controller"
application.register("tom-select", TomSelectController)

import SubmitClosestFormController from "./submit_closest_form_controller"
application.register("submit-closest-form", SubmitClosestFormController)

import WalletController from "./wallet_controller"
application.register("wallet", WalletController)

import MintController from "./mint_controller"
application.register("mint", MintController)

import WelcomeController from "./welcome_controller"
application.register("welcome", WelcomeController)

import HideBackArrowsController from "./hide_back_arrows_controller"
application.register("hide-back-arrows", HideBackArrowsController)

import UserNftsController from "./user_nfts_controller"
application.register("user-nfts", UserNftsController)

import CountdownController from "./countdown_controller"
application.register("countdown", CountdownController)
