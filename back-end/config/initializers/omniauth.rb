require 'omniauth'
require 'rspotify'
require 'omniauth-spotify'

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :spotify, ENV['CLIENT_ID'], ENV['CLIENT_SECRET'], provider_ignores_state: true, scope: %w(
    playlist-read-private
    user-read-private
    user-read-email
    streaming
  ).join(' ')
end
