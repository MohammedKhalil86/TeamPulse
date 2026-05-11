namespace TeamPulse.Api.Endpoints;

public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/health", () => Results.Ok(new
        {
            status = "Healthy",
            service = "TeamPulse.Api",
            checkedAt = DateTimeOffset.UtcNow
        }))
        .WithName("Health")
        .WithTags("Health");

        return app;
    }
}
