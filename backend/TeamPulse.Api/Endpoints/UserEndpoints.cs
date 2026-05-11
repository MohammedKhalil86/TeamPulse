using TeamPulse.Api.Services;

namespace TeamPulse.Api.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users").WithTags("Users");

        group.MapGet("/", (TeamPulseDataStore store) => Results.Ok(store.GetUsers()))
            .WithName("GetUsers");

        group.MapGet("/{id:int}", (int id, TeamPulseDataStore store) =>
            store.GetUser(id) is { } user ? Results.Ok(user) : Results.NotFound())
            .WithName("GetUserById");

        return app;
    }
}
