using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStayApi.Data;
using SmartStayApi.Models;

namespace SmartStayApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoomsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/rooms (public browsing)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
    {
        return await _context.Rooms.OrderByDescending(r => r.Id).ToListAsync();
    }

    // POST: api/rooms (requires authenticated user)
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Room>> CreateRoom([FromBody] Room room)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idClaim, out var userId))
        {
            return Unauthorized();
        }

        room.Id = 0;
        room.OwnerId = userId;
        room.CreatedAt = DateTime.UtcNow;

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRooms), new { id = room.Id }, room);
    }

    // PUT: api/rooms/5
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Room>> UpdateRoom(int id, [FromBody] Room updated)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var existing = await _context.Rooms.FindAsync(id);
        if (existing is null)
        {
            return NotFound(new { message = $"Không tìm thấy phòng #{id}" });
        }

        existing.Title = updated.Title;
        existing.Price = updated.Price;
        existing.Area = updated.Area;
        existing.Address = updated.Address;
        existing.IsAvailable = updated.IsAvailable;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE: api/rooms/5
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRoom(int id)
    {
        var existing = await _context.Rooms.FindAsync(id);
        if (existing is null)
        {
            return NotFound(new { message = $"Không tìm thấy phòng #{id}" });
        }

        _context.Rooms.Remove(existing);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
