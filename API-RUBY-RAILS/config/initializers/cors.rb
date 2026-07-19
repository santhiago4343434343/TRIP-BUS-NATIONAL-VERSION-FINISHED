# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Permitir a origem do Angular. 4300 = porta remapeada p/ rodar junto do proway (4200).
    origins "http://localhost:4200", "http://127.0.0.1:4200",
            "http://localhost:4300", "http://127.0.0.1:4300"

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
