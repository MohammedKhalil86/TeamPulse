using TeamPulse.Api.Models;

namespace TeamPulse.Api.Data;

public sealed record TeamPulseSeed(
    List<User> Users,
    List<Team> Teams,
    List<MemberProfile> Members,
    List<Evaluation> Evaluations,
    List<Goal> Goals,
    List<Feedback> Feedback,
    List<OneToOneNote> Notes);

public static class SeedData
{
    public static TeamPulseSeed Create(string contentRootPath) =>
        SeedDataLoader.Load(contentRootPath);
}
