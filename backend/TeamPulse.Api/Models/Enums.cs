using System.Text.Json.Serialization;

namespace TeamPulse.Api.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AppRole
{
    Manager,
    TeamMember
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum RiskLevel
{
    Low,
    Medium,
    High
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Seniority
{
    Junior,
    Mid,
    Senior,
    Lead
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum OwnerType
{
    Team,
    Member
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum GoalStatus
{
    NotStarted,
    InProgress,
    Blocked,
    Completed
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum FeedbackType
{
    Recognition,
    Improvement,
    Risk,
    General
}
