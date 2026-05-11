using TeamPulse.Api.Models;
using TeamPulse.Api.Services;

namespace TeamPulse.Api.Endpoints;

public static class TeamEndpoints
{
    public static IEndpointRouteBuilder MapTeamEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/teams").WithTags("Teams");

        group.MapGet("/", (TeamPulseDataStore store) => Results.Ok(store.GetTeams()))
            .WithName("GetTeams");

        group.MapGet("/{id:int}", (int id, TeamPulseDataStore store) =>
            store.GetTeam(id) is { } team ? Results.Ok(team) : Results.NotFound())
            .WithName("GetTeamById");

        group.MapPost("/", (Team team, TeamPulseDataStore store) =>
            Results.Created($"/api/teams/{store.AddTeam(team).Id}", team))
            .WithName("CreateTeam");

        group.MapPut("/{id:int}", (int id, Team team, TeamPulseDataStore store) =>
            store.UpdateTeam(id, team) is { } updated ? Results.Ok(updated) : Results.NotFound())
            .WithName("UpdateTeam");

        group.MapDelete("/{id:int}", (int id, TeamPulseDataStore store) =>
            store.DeleteTeam(id) ? Results.NoContent() : Results.NotFound())
            .WithName("DeleteTeam");

        return app;
    }
}
