namespace TeamPulse.Api.Models;

public sealed class Team
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Mission { get; set; } = "";
    public int ManagerId { get; set; }
    public int HealthScore { get; set; }
    public int DeliveryScore { get; set; }
    public int EngagementScore { get; set; }
    public RiskLevel RiskLevel { get; set; }
}
