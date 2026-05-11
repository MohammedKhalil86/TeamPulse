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
    public static TeamPulseSeed Create()
    {
        var teams = CreateTeams();
        var managers = CreateManagers();
        var users = new List<User>(managers);
        var members = new List<MemberProfile>();
        var evaluations = new List<Evaluation>();
        var goals = new List<Goal>();
        var feedback = new List<Feedback>();
        var notes = new List<OneToOneNote>();

        var names = new[]
        {
            "Ahmed Hassan", "Mona Adel", "Omar Samir", "Nour Khaled", "Yara Mahmoud", "Karim Nabil",
            "Salma Fouad", "Hany Amin", "Dina Atef", "Mostafa Sherif", "Laila Gamal", "Youssef Magdy",
            "Farida Tarek", "Mahmoud Salah", "Nada Wael", "Ali Ibrahim", "Sara Essam", "Heba Said",
            "Amr Fathy", "Reem Ashraf", "Khaled Zakaria", "Mai Hossam", "Tamer Samy", "Aya Lotfy",
            "Sherif Adel", "Rana Yasser", "Bassem Farouk", "Jana Omar", "Ehab Nader", "Noha Mamdouh",
            "Fady George", "Mariam Adel", "Seif Magdy", "Hadeer Kamal", "Hazem Raouf", "Lina Mourad",
            "Islam Wagdy", "Malak Hisham", "Talaat Reda", "Nesma Adel", "Mohamed Fawzy", "Asmaa Galal",
            "Wael Hamdy", "Shahd Ayman", "Nabil Younes", "Rania Sameh", "Adel Sobhy", "Menna Hatem",
            "Fares Emad", "Passant Adel", "Maged Ezz", "Dalia Samir", "Tarek Helmy", "Amina Raafat",
            "Ziad Hesham", "Hala Nasser", "Osama Galal", "Judy Mostafa", "Marwan Atef", "Ghada Essam"
        };

        var rolesByTeam = new Dictionary<int, string[]>
        {
            [1] = ["Angular Engineer", "Frontend Engineer", "UI Engineer", "Frontend Tech Lead"],
            [2] = ["Backend Engineer", "API Engineer", ".NET Engineer", "Integration Engineer"],
            [3] = ["Cloud Engineer", "Platform Engineer", "DevOps Engineer", "SRE"],
            [4] = ["QA Engineer", "Automation Engineer", "Test Analyst", "Quality Lead"],
            [5] = ["Delivery Analyst", "Scrum Master", "Business Analyst", "Release Coordinator"]
        };

        var skillsByTeam = new Dictionary<int, string[]>
        {
            [1] = ["Angular", "TypeScript", "PrimeNG", "RxJS", "SCSS"],
            [2] = ["ASP.NET Core", "C#", "REST APIs", "Minimal API", "Testing"],
            [3] = ["Azure", "Docker", "CI/CD", "Observability", "Scripting"],
            [4] = ["Playwright", "API Testing", "Test Design", "Automation", "Defect Analysis"],
            [5] = ["Agile Delivery", "Planning", "Stakeholder Management", "Reporting", "Risk Tracking"]
        };

        for (var index = 0; index < names.Length; index++)
        {
            var memberId = index + 1;
            var userId = 100 + memberId;
            var teamId = (index / 12) + 1;
            var teamMemberIndex = index % 12;
            var performanceScore = 68 + ((index * 7) % 28);
            var engagementScore = 66 + ((index * 5) % 30);
            var riskLevel = performanceScore < 74 || engagementScore < 73
                ? RiskLevel.High
                : performanceScore < 82 || engagementScore < 80 ? RiskLevel.Medium : RiskLevel.Low;

            users.Add(new User
            {
                Id = userId,
                FullName = names[index],
                Email = memberId <= 2 ? $"member{memberId}@teampulse.demo" : $"member{memberId:00}@teampulse.demo",
                Password = memberId <= 2 ? "Member@123" : "Demo@123",
                AppRole = AppRole.TeamMember,
                BusinessTitle = rolesByTeam[teamId][teamMemberIndex % rolesByTeam[teamId].Length],
                TeamId = teamId,
                AvatarUrl = $"https://i.pravatar.cc/150?u=teampulse-member-{memberId}"
            });

            members.Add(new MemberProfile
            {
                Id = memberId,
                UserId = userId,
                FullName = names[index],
                Role = rolesByTeam[teamId][teamMemberIndex % rolesByTeam[teamId].Length],
                Seniority = GetSeniority(teamMemberIndex),
                TeamId = teamId,
                Skills = skillsByTeam[teamId].Skip(teamMemberIndex % 2).Take(3).ToList(),
                PerformanceScore = performanceScore,
                EngagementScore = engagementScore,
                RiskLevel = riskLevel
            });

            evaluations.Add(new Evaluation
            {
                Id = memberId,
                MemberId = memberId,
                Period = "2026 Q1",
                TechnicalScore = ClampScore(performanceScore + ((index % 5) - 2)),
                CommunicationScore = ClampScore(engagementScore + ((index % 7) - 3)),
                OwnershipScore = ClampScore(performanceScore + ((index % 3) - 1)),
                TeamworkScore = ClampScore(engagementScore + ((index % 4) - 1)),
                DeliveryScore = ClampScore(performanceScore + ((index % 6) - 2)),
                Comments = BuildEvaluationComment(performanceScore, engagementScore),
                CreatedAt = new DateTimeOffset(2026, 4, 3, 10, 0, 0, TimeSpan.Zero).AddHours(index)
            });

            goals.Add(new Goal
            {
                Id = memberId,
                Title = $"Improve {skillsByTeam[teamId][teamMemberIndex % skillsByTeam[teamId].Length]} capability",
                Description = "Complete a focused workshop task and apply the learning in the current delivery stream.",
                OwnerType = OwnerType.Member,
                OwnerId = memberId,
                Progress = (index * 9) % 101,
                Status = GetGoalStatus((index * 9) % 101, index),
                DueDate = new DateOnly(2026, 6, 30).AddDays(index % 12)
            });

            feedback.Add(new Feedback
            {
                Id = memberId,
                MemberId = memberId,
                FromUserId = teamId,
                Type = GetFeedbackType(index),
                Message = GetFeedbackMessage(index, skillsByTeam[teamId][teamMemberIndex % skillsByTeam[teamId].Length]),
                CreatedAt = new DateTimeOffset(2026, 4, 10, 9, 30, 0, TimeSpan.Zero).AddDays(index % 20)
            });

            if (index % 2 == 0)
            {
                notes.Add(new OneToOneNote
                {
                    Id = notes.Count + 1,
                    MemberId = memberId,
                    ManagerId = teamId,
                    Note = "Discussed current goals, delivery confidence, and support needed for the next sprint.",
                    CreatedAt = new DateTimeOffset(2026, 4, 20, 11, 0, 0, TimeSpan.Zero).AddDays(index % 15)
                });
            }
        }

        foreach (var team in teams)
        {
            goals.Add(new Goal
            {
                Id = goals.Count + 1,
                Title = $"{team.Name} quarterly delivery health",
                Description = "Improve planning confidence, team visibility, and predictable delivery outcomes.",
                OwnerType = OwnerType.Team,
                OwnerId = team.Id,
                Progress = team.DeliveryScore - 10,
                Status = GoalStatus.InProgress,
                DueDate = new DateOnly(2026, 6, 30)
            });

            goals.Add(new Goal
            {
                Id = goals.Count + 1,
                Title = $"{team.Name} engagement action plan",
                Description = "Run team-level actions from retrospectives and one-to-one conversations.",
                OwnerType = OwnerType.Team,
                OwnerId = team.Id,
                Progress = team.EngagementScore - 15,
                Status = GoalStatus.InProgress,
                DueDate = new DateOnly(2026, 7, 15)
            });
        }

        return new TeamPulseSeed(users, teams, members, evaluations, goals, feedback, notes);
    }

    private static List<User> CreateManagers() =>
    [
        CreateManager(1, "Hassan Mahmoud", "manager1@teampulse.demo", "Engineering Manager", 1),
        CreateManager(2, "Mariam Khaled", "manager2@teampulse.demo", "Backend Engineering Manager", 2),
        CreateManager(3, "Tarek Mostafa", "manager3@teampulse.demo", "Platform Engineering Manager", 3),
        CreateManager(4, "Nadine Samir", "manager4@teampulse.demo", "Quality Engineering Manager", 4),
        CreateManager(5, "Ola Youssef", "manager5@teampulse.demo", "Delivery Manager", 5)
    ];

    private static List<Team> CreateTeams() =>
    [
        new() { Id = 1, Name = "Frontend Squad", Mission = "Build usable Angular experiences for team evaluation workflows.", ManagerId = 1, HealthScore = 86, DeliveryScore = 84, EngagementScore = 88, RiskLevel = RiskLevel.Low },
        new() { Id = 2, Name = "Backend Squad", Mission = "Provide simple, reliable APIs for workshop business scenarios.", ManagerId = 2, HealthScore = 82, DeliveryScore = 86, EngagementScore = 80, RiskLevel = RiskLevel.Medium },
        new() { Id = 3, Name = "Platform Squad", Mission = "Support local-first engineering workflows and deployment readiness.", ManagerId = 3, HealthScore = 89, DeliveryScore = 87, EngagementScore = 85, RiskLevel = RiskLevel.Low },
        new() { Id = 4, Name = "QA Squad", Mission = "Improve confidence through test planning and quality feedback.", ManagerId = 4, HealthScore = 78, DeliveryScore = 80, EngagementScore = 77, RiskLevel = RiskLevel.Medium },
        new() { Id = 5, Name = "Delivery Squad", Mission = "Coordinate delivery plans, risks, and stakeholder visibility.", ManagerId = 5, HealthScore = 84, DeliveryScore = 82, EngagementScore = 83, RiskLevel = RiskLevel.Low }
    ];

    private static User CreateManager(int id, string fullName, string email, string title, int teamId) =>
        new()
        {
            Id = id,
            FullName = fullName,
            Email = email,
            Password = "Manager@123",
            AppRole = AppRole.Manager,
            BusinessTitle = title,
            TeamId = teamId,
            AvatarUrl = $"https://i.pravatar.cc/150?u=teampulse-manager-{id}"
        };

    private static Seniority GetSeniority(int teamMemberIndex) =>
        teamMemberIndex switch
        {
            <= 2 => Seniority.Junior,
            <= 6 => Seniority.Mid,
            <= 10 => Seniority.Senior,
            _ => Seniority.Lead
        };

    private static GoalStatus GetGoalStatus(int progress, int index)
    {
        if (progress >= 95)
        {
            return GoalStatus.Completed;
        }

        if (index % 17 == 0)
        {
            return GoalStatus.Blocked;
        }

        return progress == 0 ? GoalStatus.NotStarted : GoalStatus.InProgress;
    }

    private static FeedbackType GetFeedbackType(int index) => (index % 4) switch
    {
        0 => FeedbackType.Recognition,
        1 => FeedbackType.Improvement,
        2 => FeedbackType.Risk,
        _ => FeedbackType.General
    };

    private static string GetFeedbackMessage(int index, string primarySkill) => (index % 4) switch
    {
        0 => index % 3 == 0
            ? $"Consistently delivers quality work on {primarySkill} tasks and raises the bar for the team."
            : "Strong collaboration during the sprint — helped unblock two colleagues and kept delivery on track.",
        1 => index % 3 == 0
            ? "Needs earlier visibility when delivery risks appear so the team can course-correct in time."
            : $"Would benefit from deeper focus on {primarySkill} documentation to support knowledge sharing.",
        2 => index % 2 == 0
            ? "Workload looks high — please flag if delivery commitments need to be adjusted for the next sprint."
            : "Missed two standups this cycle without notice. Please flag any blockers early so the team can help.",
        _ => index % 2 == 0
            ? $"Good progress on {primarySkill} competency. Continue applying it in delivery and team reviews."
            : "Showing steady growth in ownership. Encourage continuing to take initiative on team priorities."
    };

    private static int ClampScore(int score) => Math.Clamp(score, 60, 98);

    private static string BuildEvaluationComment(int performanceScore, int engagementScore)
    {
        if (performanceScore >= 88 && engagementScore >= 86)
        {
            return "Strong delivery ownership with positive collaboration across the team.";
        }

        if (performanceScore < 75)
        {
            return "Needs clearer delivery planning and more consistent follow-through on commitments.";
        }

        if (engagementScore < 75)
        {
            return "Good technical contribution with an opportunity to improve communication rhythm.";
        }

        return "Solid quarter with clear progress and a few focused improvement opportunities.";
    }
}
