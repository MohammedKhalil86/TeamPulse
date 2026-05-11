using TeamPulse.Api.Services;

namespace TeamPulse.Api.Endpoints;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard").WithTags("Dashboard");

        group.MapGet("/manager", (TeamPulseDataStore store) => Results.Ok(store.GetManagerDashboard()))
            .WithName("GetManagerDashboard");

        group.MapGet("/member/{userId:int}", (int userId, TeamPulseDataStore store) =>
            store.GetMemberDashboard(userId) is { } dashboard ? Results.Ok(dashboard) : Results.NotFound())
            .WithName("GetMemberDashboard");

        return app;
    }
}
