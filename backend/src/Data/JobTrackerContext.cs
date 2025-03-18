using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Data
{
    public class JobTrackerContext : DbContext
    {
        public JobTrackerContext(DbContextOptions<JobTrackerContext> options)
            : base(options)
        {
        }

        public DbSet<JobApplication> JobApplications { get; set; }
    }
} 