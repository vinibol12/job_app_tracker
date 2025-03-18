using JobTracker.API.Models;

namespace JobTracker.API.Repositories
{
    public interface IJobApplicationRepository
    {
        Task<IEnumerable<JobApplication>> GetAllAsync();
        Task<JobApplication?> GetByIdAsync(int id);
        Task<JobApplication> AddAsync(JobApplication application);
        Task<JobApplication?> UpdateAsync(JobApplication application);
        Task<bool> DeleteAsync(int id);
    }
} 