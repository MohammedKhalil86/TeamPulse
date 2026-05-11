using TeamPulse.Api.Models;
using TeamPulse.Api.Services;

namespace TeamPulse.Api.Endpoints;

public static class EvaluationEndpoints
{
    public static IEndpointRouteBuilder MapEvaluationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/evaluations").WithTags("Evaluations");

        group.MapGet("/", (TeamPulseDataStore store) => Results.Ok(store.GetEvaluations()))
            .WithName("GetEvaluations");

        group.MapPost("/", (Evaluation evaluation, TeamPulseDataStore store) =>
            Results.Created($"/api/evaluations/{store.AddEvaluation(evaluation).Id}", evaluation))
            .WithName("CreateEvaluation");

        group.MapPut("/{id:int}", (int id, Evaluation evaluation, TeamPulseDataStore store) =>
            store.UpdateEvaluation(id, evaluation) is { } updated ? Results.Ok(updated) : Results.NotFound())
            .WithName("UpdateEvaluation");

        group.MapDelete("/{id:int}", (int id, TeamPulseDataStore store) =>
            store.DeleteEvaluation(id) ? Results.NoContent() : Results.NotFound())
            .WithName("DeleteEvaluation");

        app.MapGet("/api/members/{memberId:int}/evaluations", (int memberId, TeamPulseDataStore store) =>
            Results.Ok(store.GetEvaluationsByMember(memberId)))
            .WithTags("Evaluations")
            .WithName("GetMemberEvaluations");

        return app;
    }
}
