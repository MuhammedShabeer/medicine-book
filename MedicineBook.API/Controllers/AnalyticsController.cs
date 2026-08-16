using MedicineBook.API.Data;
using MedicineBook.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedicineBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Endpoint for clients to report user actions (e.g., search, view_medicine)
        [HttpPost("track")]
        public async Task<IActionResult> TrackAction([FromBody] TrackActionDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            // Fallback for older tokens that only had ClaimTypes.Name
            if (string.IsNullOrEmpty(userId))
            {
                var userName = User.FindFirstValue(ClaimTypes.Name);
                if (!string.IsNullOrEmpty(userName))
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
                    userId = user?.Id;
                }
            }

            if (string.IsNullOrEmpty(userId))
            {
                // Silently ignore tracking for invalid users to avoid 401 logouts
                return Ok(new { Status = "Ignored" });
            }

            var log = new UserActivityLog
            {
                UserId = userId,
                ActionType = request.ActionType,
                Details = request.Details,
                Timestamp = DateTime.UtcNow
            };

            _context.UserActivityLogs.Add(log);
            await _context.SaveChangesAsync();

            return Ok(new { Status = "Success" });
        }

        // Dashboard endpoint - Admin only
        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDashboardData()
        {
            var today = DateTime.UtcNow.Date;
            var sevenDaysAgo = today.AddDays(-7);

            var totalUsers = await _context.Users.CountAsync();
            
            var loginsToday = await _context.UserActivityLogs
                .Where(l => l.ActionType == "Login" && l.Timestamp >= today)
                .Select(l => l.UserId)
                .Distinct()
                .CountAsync();

            var recentActivity = await _context.UserActivityLogs
                .Include(l => l.User)
                .OrderByDescending(l => l.Timestamp)
                .Take(50)
                .Select(l => new
                {
                    l.Id,
                    l.UserId,
                    UserName = l.User != null ? (l.User.FullName ?? l.User.UserName) : "Unknown",
                    l.ActionType,
                    l.Details,
                    l.Timestamp
                })
                .ToListAsync();

            // Most active users in the last 7 days (by action count)
            var mostActiveUsers = await _context.UserActivityLogs
                .Where(l => l.Timestamp >= sevenDaysAgo)
                .GroupBy(l => l.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    ActionCount = g.Count()
                })
                .OrderByDescending(g => g.ActionCount)
                .Take(5)
                .ToListAsync();

            // Join with user names
            var activeUserStats = new List<object>();
            foreach (var stat in mostActiveUsers)
            {
                var user = await _context.Users.FindAsync(stat.UserId);
                activeUserStats.Add(new
                {
                    UserName = user?.FullName ?? user?.UserName ?? "Unknown",
                    ActionCount = stat.ActionCount
                });
            }

            return Ok(new
            {
                TotalUsers = totalUsers,
                ActiveUsersToday = loginsToday,
                RecentActivity = recentActivity,
                MostActiveUsers = activeUserStats
            });
        }
    }

    public class TrackActionDto
    {
        public string ActionType { get; set; } = string.Empty;
        public string? Details { get; set; }
    }
}
