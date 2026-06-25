using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniCRM.Server.Data;
using MiniCRM.Server.Enums;

namespace MiniCRM.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {

        private readonly AppDbContext _context;

        public AnalyticsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardReport([FromQuery] string range = "12m")
        {
            var now = DateTime.UtcNow;

            DateTime trendStart;

            switch (range.ToLower())
            {
                case "30d":
                    trendStart = now.AddDays(-30);
                    break;

                case "quarter":
                    trendStart = now.AddMonths(-4);
                    break;

                default:
                    trendStart = now.AddMonths(-11);
                    break;
            }

            var currentMonthStart = DateTime.SpecifyKind(
                new DateTime(now.Year, now.Month, 1),
                DateTimeKind.Utc);

            var nextMonthStart = currentMonthStart.AddMonths(1);
            var previousMonthStart = currentMonthStart.AddMonths(-1);

            // Current month opportunities
            var currentMonthOpportunities = await _context.Opportunities
                .AsNoTracking()
                .Where(o => o.CreatedAt >= currentMonthStart)
                .ToListAsync();

            // Previous month opportunities
            var previousMonthOpportunities = await _context.Opportunities
                .AsNoTracking()
                .Where(o =>
                    o.CreatedAt >= previousMonthStart &&
                    o.CreatedAt < currentMonthStart)
                .ToListAsync();

            // Pipeline Value
            var pipelineValue = currentMonthOpportunities
                .Where(o =>
                    o.Stage != OpportunityStage.Lost &&
                    o.Stage != OpportunityStage.Won)
                .Sum(o => o.Value);

            var previousPipelineValue = previousMonthOpportunities
                .Where(o =>
                    o.Stage != OpportunityStage.Lost &&
                    o.Stage != OpportunityStage.Won)
                .Sum(o => o.Value);

            // Open Opportunities
            var openOpportunities = currentMonthOpportunities.Count(o =>
                o.Stage != OpportunityStage.Won &&
                o.Stage != OpportunityStage.Lost);

            var previousOpenOpportunities = previousMonthOpportunities.Count(o =>
                o.Stage != OpportunityStage.Won &&
                o.Stage != OpportunityStage.Lost    );

            // Average Deal Size
            var averageDealSize = currentMonthOpportunities.Any()
                ? currentMonthOpportunities.Average(o => o.Value)
                : 0;

            var previousAverageDealSize = previousMonthOpportunities.Any()
                ? previousMonthOpportunities.Average(o => o.Value)
                : 0;

            // Win Rate
            var currentClosedDeals = await _context.Opportunities
            .AsNoTracking()
            .Where(o =>
                o.ClosedAt != null &&
                o.ClosedAt >= currentMonthStart &&
                o.ClosedAt < nextMonthStart)
            .ToListAsync();


            var previousClosedDeals = await _context.Opportunities
                .AsNoTracking()
                .Where(o =>
                    o.ClosedAt != null &&
                    o.ClosedAt >= previousMonthStart &&
                    o.ClosedAt < currentMonthStart)
                .ToListAsync();


            var wonDeals = currentClosedDeals.Count(o =>
                o.Stage == OpportunityStage.Won);

            var lostDeals = currentClosedDeals.Count(o =>
                o.Stage == OpportunityStage.Lost);


            var winRate = wonDeals + lostDeals > 0
                ? Math.Round(
                    (decimal)wonDeals /
                    (wonDeals + lostDeals) * 100,
                    1)
                : 0;



            var previousWonDeals = previousClosedDeals.Count(o =>
                o.Stage == OpportunityStage.Won);

            var previousLostDeals = previousClosedDeals.Count(o =>
                o.Stage == OpportunityStage.Lost);


            var previousWinRate = previousWonDeals + previousLostDeals > 0
                ? Math.Round(
                    (decimal)previousWonDeals /
                    (previousWonDeals + previousLostDeals) * 100,
                    1)
                : 0;

            // 

            var leadPipelineTrend = new List<object>();

            DateTime periodStart;
            DateTime periodEnd = now;

            if (range == "30d")
            {
                periodStart = now.Date.AddDays(-29);
                for (int i = 29; i >= 0; i--)
                {
                    var dayStart = now.Date.AddDays(-i);
                    var dayEnd = dayStart.AddDays(1);


                    var count = await _context.Opportunities
                        .AsNoTracking()
                        .CountAsync(o =>

                            o.CreatedAt >= dayStart &&
                            o.CreatedAt < dayEnd 
                        );



                    leadPipelineTrend.Add(new
                    {
                        Label = dayStart.ToString("dd MMM"),
                        Total = count
                    });
                }
            }



            else if (range == "quarter")
            {
                var currentQuarter = ((now.Month - 1) / 3) + 1;

                var previousQuarterStartMonth =
                    currentQuarter == 1
                        ? 10
                        : ((currentQuarter - 2) * 3) + 1;

                var year =
                    currentQuarter == 1
                        ? now.Year - 1
                        : now.Year;

                var previousQuarterStart = new DateTime(
                    year,
                    previousQuarterStartMonth,
                    1,
                    0,
                    0,
                    0,
                    DateTimeKind.Utc);

                // Used by WonSummary
                periodStart = previousQuarterStart;
                periodEnd = previousQuarterStart.AddMonths(3);

                for (int i = 0; i < 3; i++)
                {
                    var monthStart = previousQuarterStart.AddMonths(i);
                    var monthEnd = monthStart.AddMonths(1);

                    var count = await _context.Opportunities
                        .AsNoTracking()
                        .CountAsync(o =>
                            o.CreatedAt >= monthStart &&
                            o.CreatedAt < monthEnd);

                    leadPipelineTrend.Add(new
                    {
                        Label = monthStart.ToString("MMM"),
                        Total = count
                    });
                }
            }



            else
            {
                periodStart = new DateTime(
                    now.Year,
                    now.Month,
                    1,
                    0,
                    0,
                    0,
                    DateTimeKind.Utc
                ).AddMonths(-11);

                for (int i = 11; i >= 0; i--)
                {

                    var monthStart = new DateTime(

                        now.Year,
                        now.Month,
                        1,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc

                    ).AddMonths(-i);


                    var monthEnd = monthStart.AddMonths(1);



                    var count = await _context.Opportunities
                        .AsNoTracking()
                        .CountAsync(o =>

                            o.CreatedAt >= monthStart &&
                            o.CreatedAt < monthEnd
                        );



                    leadPipelineTrend.Add(new
                    {
                        Label = monthStart.ToString("MMM"),
                        Total = count
                    });

                }

            }

            var opportunities = await _context.Opportunities
                .AsNoTracking()
                .CountAsync(o =>

                    o.CreatedAt >= periodStart &&
                    o.CreatedAt <= periodEnd
                );



            var won = await _context.Opportunities
                .AsNoTracking()
                .CountAsync(o =>

                    o.CreatedAt >= periodStart &&
                    o.CreatedAt <= periodEnd &&

                    o.Stage == OpportunityStage.Won

                );

            var conversionRate = opportunities > 0
                ? Math.Round(
                    (decimal)won /
                    opportunities * 100,
                    1)
                : 0;

            return Ok(new
            {
                Range = range,

                PipelineValue = new
                {
                    Current = pipelineValue,
                    Previous = previousPipelineValue
                },

                OpenOpportunities = new
                {
                    Current = openOpportunities,
                    Previous = previousOpenOpportunities
                },

                AverageDealSize = new
                {
                    Current = Math.Round(averageDealSize, 2),
                    Previous = Math.Round(previousAverageDealSize, 2)
                },

                WinRate = new
                {
                    Current = Math.Round(winRate, 2),
                    Previous = Math.Round(previousWinRate, 2)
                },
                LeadPipelineTrend = leadPipelineTrend,
                WonSummary = new
                {
                    Won = won,
                    Qualified = opportunities,
                    ConversionRate = conversionRate
                }
            });
        }
    }
}
