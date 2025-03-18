using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobTracker.API.Data;
using JobTracker.API.Models;
using JobTracker.API.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace JobTracker.Tests.Repositories
{
    public class JobApplicationRepositoryTests
    {
        private async Task<JobTrackerContext> GetDatabaseContext()
        {
            var options = new DbContextOptionsBuilder<JobTrackerContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var context = new JobTrackerContext(options);
            
            // Seed the database with test data
            if (await context.JobApplications.CountAsync() <= 0)
            {
                for (int i = 1; i <= 3; i++)
                {
                    context.JobApplications.Add(new JobApplication
                    {
                        CompanyName = $"Test Company {i}",
                        Position = $"Test Position {i}",
                        Status = "Applied",
                        DateApplied = DateTime.Now.AddDays(-i),
                        LastUpdated = DateTime.Now.AddDays(-i)
                    });
                }
                
                await context.SaveChangesAsync();
            }
            
            return context;
        }
        
        [Fact]
        public async Task GetAllAsync_ReturnsAllApplications_OrderedByIdDescending()
        {
            // Arrange
            var context = await GetDatabaseContext();
            var repository = new JobApplicationRepository(context);
            
            // Act
            var result = await repository.GetAllAsync();
            
            // Assert
            var applications = result.ToList();
            Assert.Equal(3, applications.Count);
            
            // Verify descending order by ID
            for (int i = 0; i < applications.Count - 1; i++)
            {
                Assert.True(applications[i].Id > applications[i + 1].Id);
            }
        }
        
        [Fact]
        public async Task GetByIdAsync_ReturnsCorrectApplication()
        {
            // Arrange
            var context = await GetDatabaseContext();
            var repository = new JobApplicationRepository(context);
            
            // Get an existing application ID
            var existingId = (await context.JobApplications.FirstAsync()).Id;
            
            // Act
            var result = await repository.GetByIdAsync(existingId);
            
            // Assert
            Assert.NotNull(result);
            Assert.Equal(existingId, result.Id);
        }
        
        [Fact]
        public async Task GetByIdAsync_ReturnsNull_ForNonExistentId()
        {
            // Arrange
            var context = await GetDatabaseContext();
            var repository = new JobApplicationRepository(context);
            
            // Act
            var result = await repository.GetByIdAsync(999);
            
            // Assert
            Assert.Null(result);
        }
        
        [Fact]
        public async Task AddAsync_CreatesNewApplication_WithCurrentTimestamps()
        {
            // Arrange
            var context = await GetDatabaseContext();
            var repository = new JobApplicationRepository(context);
            var newApplication = new JobApplication
            {
                CompanyName = "New Test Company",
                Position = "New Test Position",
                Status = "Applied"
            };
            
            // Act
            var result = await repository.AddAsync(newApplication);
            
            // Assert
            Assert.NotEqual(0, result.Id);
            Assert.Equal("New Test Company", result.CompanyName);
            Assert.Equal("New Test Position", result.Position);
            
            // Verify the application was added to the database
            var savedApplication = await context.JobApplications.FindAsync(result.Id);
            Assert.NotNull(savedApplication);
            Assert.Equal(newApplication.CompanyName, savedApplication.CompanyName);
            
            // Verify timestamps
            Assert.NotEqual(default, result.DateApplied);
            Assert.NotEqual(default, result.LastUpdated);
            
            // Instead of direct equality, verify DateApplied and LastUpdated are very close to each other
            // (within 1 second, which is more than enough for any realistic scenario)
            Assert.NotNull(result.LastUpdated);
            var timeDifference = (result.LastUpdated.Value - result.DateApplied).TotalSeconds;
            Assert.True(Math.Abs(timeDifference) < 1, 
                $"DateApplied and LastUpdated should be very close. Actual difference: {timeDifference} seconds");
        }
        
        [Fact]
        public async Task UpdateAsync_UpdatesApplication_AndUpdatesTimestamp()
        {
            // Arrange
            var context = await GetDatabaseContext();
            var repository = new JobApplicationRepository(context);
            
            // Get an existing application to update
            var existingApplication = await context.JobApplications.FirstAsync();
            var originalLastUpdated = existingApplication.LastUpdated;
            
            // Prepare update
            var applicationToUpdate = new JobApplication
            {
                Id = existingApplication.Id,
                CompanyName = "Updated Company Name",
                Position = "Updated Position",
                Status = "Interviewing",
                DateApplied = existingApplication.DateApplied
            };
            
            // Allow some time to pass to ensure LastUpdated changes
            await Task.Delay(10);
            
            // Act
            var result = await repository.UpdateAsync(applicationToUpdate);
            
            // Assert
            Assert.NotNull(result);
            Assert.Equal(existingApplication.Id, result.Id);
            Assert.Equal("Updated Company Name", result.CompanyName);
            Assert.Equal("Updated Position", result.Position);
            Assert.Equal("Interviewing", result.Status);
            
            // Verify LastUpdated has been changed
            Assert.NotEqual(originalLastUpdated, result.LastUpdated);
            
            // Verify DateApplied is preserved
            Assert.Equal(existingApplication.DateApplied, result.DateApplied);
            
            // Verify changes are saved to the database
            var updatedInDb = await context.JobApplications.FindAsync(existingApplication.Id);
            Assert.NotNull(updatedInDb);
            Assert.Equal("Updated Company Name", updatedInDb.CompanyName);
        }
        
        [Fact]
        public async Task UpdateAsync_ReturnsNull_ForNonExistentId()
        {
            // Arrange
            var context = await GetDatabaseContext();
            var repository = new JobApplicationRepository(context);
            var nonExistentApplication = new JobApplication
            {
                Id = 999,
                CompanyName = "Non-existent",
                Position = "Test",
                Status = "Applied"
            };
            
            // Act
            var result = await repository.UpdateAsync(nonExistentApplication);
            
            // Assert
            Assert.Null(result);
        }
        
        [Fact]
        public async Task DeleteAsync_RemovesApplication_AndReturnsTrue()
        {
            // Arrange
            var context = await GetDatabaseContext();
            var repository = new JobApplicationRepository(context);
            
            // Get an existing application ID to delete
            var existingId = (await context.JobApplications.FirstAsync()).Id;
            
            // Act
            var result = await repository.DeleteAsync(existingId);
            
            // Assert
            Assert.True(result);
            
            // Verify the application was removed from the database
            var deletedApplication = await context.JobApplications.FindAsync(existingId);
            Assert.Null(deletedApplication);
        }
        
        [Fact]
        public async Task DeleteAsync_ReturnsFalse_ForNonExistentId()
        {
            // Arrange
            var context = await GetDatabaseContext();
            var repository = new JobApplicationRepository(context);
            
            // Act
            var result = await repository.DeleteAsync(999);
            
            // Assert
            Assert.False(result);
        }
    }
}
