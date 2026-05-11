namespace TeamPulse.Api.Models;

public sealed class MemberProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = "";
    public string Role { get; set; } = "";
    public Seniority Seniority { get; set; }
    public int TeamId { get; set; }
    public List<string> Skills { get; set; } = [];
    public int PerformanceScore { get; set; }
    public int EngagementScore { get; set; }
    public RiskLevel RiskLevel { get; set; }
}
