# Load the Rails application.
require_relative 'application'
require 'rspotify'

RSpotify.authenticate(ENV['CLIENT_ID'], ENV['CLIENT_SECRET'])

# Initialize the Rails application.
Rails.application.initialize!
