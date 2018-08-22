class TracksController < ApplicationController

  def index
    @artists = RSpotify::Track.search(params[:name])

    render json: @artists
  end
end
