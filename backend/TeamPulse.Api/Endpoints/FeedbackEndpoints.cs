using TeamPulse.Api.Models;
using TeamPulse.Api.Services;

namespace TeamPulse.Api.Endpoints;

public static class FeedbackEndpoints
{
    public static IEndpointRouteBuilder MapFeedbackEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/feedback").WithTags("Feedback");

        group.MapGet("/", (TeamPulseDataStore store) => Results.Ok(store.GetFeedback()))
            .WithName("GetFeedback");

        group.MapPost("/", (Feedback feedback, TeamPulseDataStore store) =>
            Results.Created($"/api/feedback/{store.AddFeedback(feedback).Id}", feedback))
            .WithName("CreateFeedback");

        group.MapDelete("/{id:int}", (int id, TeamPulseDataStore store) =>
            store.DeleteFeedback(id) ? Results.NoContent() : Results.NotFound())
            .WithName("DeleteFeedback");

        app.MapGet("/api/members/{memberId:int}/feedback", (int memberId, TeamPulseDataStore store) =>
            Results.Ok(store.GetFeedbackByMember(memberId)))
            .WithTags("Feedback")
            .WithName("GetMemberFeedback");

        return app;
    }
}
