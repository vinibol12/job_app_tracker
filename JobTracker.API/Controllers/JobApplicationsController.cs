using JobTracker.API.Models;
using JobTracker.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobApplicationsController : ControllerBase
    {
        private readonly IJobApplicationRepository _repository;

        public JobApplicationsController(IJobApplicationRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobApplication>>> GetApplications()
        {
            var applications = await _repository.GetAllAsync();
            return Ok(applications);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JobApplication>> GetApplication(int id)
        {
            var application = await _repository.GetByIdAsync(id);
            
            if (application == null)
                return NotFound();

            return Ok(application);
        }

        [HttpPost]
        public async Task<ActionResult<JobApplication>> CreateApplication(JobApplication application)
        {
            var created = await _repository.AddAsync(application);
            return CreatedAtAction(nameof(GetApplication), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<JobApplication>> UpdateApplication(int id, JobApplication application)
        {
            if (id != application.Id)
                return BadRequest();

            var updated = await _repository.UpdateAsync(application);
            
            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteApplication(int id)
        {
            var result = await _repository.DeleteAsync(id);
            
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
} 