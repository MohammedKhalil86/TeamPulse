namespace TeamPulse.Api.Models;

public sealed record LoginRequest(string Email, string Password);

public sealed record LoginSession(
    int UserId,
    string FullName,
    string Email,
    AppRole AppRole,
    string BusinessTitle,
    int? TeamId);

public sealed record UserResponse(
    int Id,
    string FullName,
    string Email,
    AppRole AppRole,
    string BusinessTitle,
    int? TeamId,
    string? AvatarUrl);

public sealed record ManagerDashboardResponse(
    int TeamCount,
    int MemberCount,
    int AverageHealthScore,
    int AverageDeliveryScore,
    int AverageEngagementScore,
    int HighRiskMemberCount,
    IReadOnlyList<Team> Teams,
    IReadOnlyList<Goal> UpcomingGoals,
    IReadOnlyList<Feedback> RecentFeedback);

public sealed record MemberDashboardResponse(
    UserResponse User,
    MemberProfile? Profile,
    Team? Team,
    Evaluation? LatestEvaluation,
    IReadOnlyList<Goal> Goals,
    IReadOnlyList<Feedback> RecentFeedback,
    IReadOnlyList<OneToOneNote> Notes);
