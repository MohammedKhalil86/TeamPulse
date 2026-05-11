using TeamPulse.Api.Models;
using TeamPulse.Api.Services;

namespace TeamPulse.Api.Endpoints;

public static class GoalEndpoints
{
    public static IEndpointRouteBuilder MapGoalEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/goals").WithTags("Goals");

        group.MapGet("/", (TeamPulseDataStore store) => Results.Ok(store.GetGoals()))
            .WithName("GetGoals");

        group.MapPost("/", (Goal goal, TeamPulseDataStore store) =>
            Results.Created($"/api/goals/{store.AddGoal(goal).Id}", goal))
            .WithName("CreateGoal");

        group.MapPut("/{id:int}", (int id, Goal goal, TeamPulseDataStore store) =>
            store.UpdateGoal(id, goal) is { } updated ? Results.Ok(updated) : Results.NotFound())
            .WithName("UpdateGoal");

        group.MapDelete("/{id:int}", (int id, TeamPulseDataStore store) =>
            store.DeleteGoal(id) ? Results.NoContent() : Results.NotFound())
            .WithName("DeleteGoal");

        app.MapGet("/api/members/{memberId:int}/goals", (int memberId, TeamPulseDataStore store) =>
            Results.Ok(store.GetMemberGoals(memberId)))
            .WithTags("Goals")
            .WithName("GetMemberGoals");

        app.MapGet("/api/teams/{teamId:int}/goals", (int teamId, TeamPulseDataStore store) =>
            Results.Ok(store.GetTeamGoals(teamId)))
            .WithTags("Goals")
            .WithName("GetTeamGoals");

        return app;
    }
}
