using TeamPulse.Api.Models;
using TeamPulse.Api.Services;

namespace TeamPulse.Api.Endpoints;

public static class MemberEndpoints
{
    public static IEndpointRouteBuilder MapMemberEndpoints(this IEndpointRouteBuilder app)
    {
        var members = app.MapGroup("/api/members").WithTags("Members");

        members.MapGet("/", (TeamPulseDataStore store) => Results.Ok(store.GetMembers()))
            .WithName("GetMembers");

        members.MapGet("/{id:int}", (int id, TeamPulseDataStore store) =>
            store.GetMember(id) is { } member ? Results.Ok(member) : Results.NotFound())
            .WithName("GetMemberById");

        members.MapPost("/", (MemberProfile member, TeamPulseDataStore store) =>
            Results.Created($"/api/members/{store.AddMember(member).Id}", member))
            .WithName("CreateMember");

        members.MapPut("/{id:int}", (int id, MemberProfile member, TeamPulseDataStore store) =>
            store.UpdateMember(id, member) is { } updated ? Results.Ok(updated) : Results.NotFound())
            .WithName("UpdateMember");

        members.MapDelete("/{id:int}", (int id, TeamPulseDataStore store) =>
            store.DeleteMember(id) ? Results.NoContent() : Results.NotFound())
            .WithName("DeleteMember");

        app.MapGet("/api/teams/{teamId:int}/members", (int teamId, TeamPulseDataStore store) =>
            Results.Ok(store.GetMembersByTeam(teamId)))
            .WithTags("Members")
            .WithName("GetTeamMembers");

        return app;
    }
}
