using System;
using JobTracker.API.Models;
using Xunit;

namespace JobTracker.Tests.Models
{
    public class JobApplicationTests
    {
        [Fact]
        public void JobApplication_PropertiesInitializeCorrectly()
        {
            // Arrange & Act
            var application = new JobApplication
            {
                Id = 1,
                CompanyName = "Test Company",
                Position = "Test Position",
                Status = "Applied",
                DateApplied = new DateTime(2023, 1, 1),
                LastUpdated = new DateTime(2023, 1, 2)
            };

            // Assert
            Assert.Equal(1, application.Id);
            Assert.Equal("Test Company", application.CompanyName);
            Assert.Equal("Test Position", application.Position);
            Assert.Equal("Applied", application.Status);
            Assert.Equal(new DateTime(2023, 1, 1), application.DateApplied);
            Assert.Equal(new DateTime(2023, 1, 2), application.LastUpdated);
        }

        [Fact]
        public void JobApplication_DefaultValuesAreCorrect()
        {
            // Arrange & Act
            var application = new JobApplication();

            // Assert
            Assert.Equal(0, application.Id);
            Assert.Equal(string.Empty, application.CompanyName);
            Assert.Equal(string.Empty, application.Position);
            Assert.Equal("Applied", application.Status); // Default status
            Assert.Equal(default, application.DateApplied);
            Assert.Null(application.LastUpdated); // Nullable DateTime
        }

        [Fact]
        public void JobApplication_CanModifyProperties()
        {
            // Arrange
            var application = new JobApplication
            {
                Id = 1,
                CompanyName = "Initial Company",
                Position = "Initial Position",
                Status = "Applied",
                DateApplied = new DateTime(2023, 1, 1)
            };

            // Act
            application.CompanyName = "Updated Company";
            application.Position = "Updated Position";
            application.Status = "Interviewing";
            application.LastUpdated = new DateTime(2023, 1, 15);

            // Assert
            Assert.Equal("Updated Company", application.CompanyName);
            Assert.Equal("Updated Position", application.Position);
            Assert.Equal("Interviewing", application.Status);
            Assert.Equal(new DateTime(2023, 1, 15), application.LastUpdated);
            
            // Original values should be unchanged
            Assert.Equal(1, application.Id);
            Assert.Equal(new DateTime(2023, 1, 1), application.DateApplied);
        }
    }
}
