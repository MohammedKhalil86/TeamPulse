using TeamPulse.Api.Models;
using TeamPulse.Api.Services;

namespace TeamPulse.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Authentication");

        group.MapPost("/login", (LoginRequest request, TeamPulseDataStore store) =>
            store.Login(request) is { } session ? Results.Ok(session) : Results.Unauthorized())
            .WithName("Login");

        group.MapPost("/logout", () => Results.Ok(new
        {
            message = "Logged out",
            loggedOutAt = DateTimeOffset.UtcNow
        }))
        .WithName("Logout");

        return app;
    }
}
