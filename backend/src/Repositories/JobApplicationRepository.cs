using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JobTracker.API.Models;
using JobTracker.API.Data;
using System.Linq;

namespace JobTracker.API.Repositories
{
    public class JobApplicationRepository : IJobApplicationRepository
    {
        private readonly JobTrackerContext _context;

        public JobApplicationRepository(JobTrackerContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<JobApplication>> GetAllAsync()
        {
            // Return applications ordered by ID in descending order (most recent first)
            return await _context.JobApplications
                .OrderByDescending(app => app.Id)
                .ToListAsync();
        }

        public async Task<JobApplication?> GetByIdAsync(int id)
        {
            return await _context.JobApplications.FindAsync(id);
        }

        public async Task<JobApplication> AddAsync(JobApplication application)
        {
            application.DateApplied = DateTime.UtcNow;
            application.LastUpdated = DateTime.UtcNow;
            
            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<JobApplication?> UpdateAsync(JobApplication application)
        {
            var existingApplication = await _context.JobApplications.FindAsync(application.Id);
            
            if (existingApplication == null)
                return null;

            existingApplication.CompanyName = application.CompanyName;
            existingApplication.Position = application.Position;
            existingApplication.Status = application.Status;
            existingApplication.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingApplication;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var application = await _context.JobApplications.FindAsync(id);
            if (application == null)
                return false;

            _context.JobApplications.Remove(application);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}